"use client";

import { supabase } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";

interface UseRealtimeChatProps {
  roomId: string; // rooms.id
  currentUserId: string; // user_profiles.id / auth user id
  currentUserName: string; // for the local user label
}

export interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  createdAt: string;
}

type DbMessageRow = {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export function useRealtimeChat({
  roomId,
  currentUserId,
  currentUserName,
}: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const mapRowToChatMessage = (row: DbMessageRow): ChatMessage => ({
    id: row.id,
    content: row.content,
    user_id: row.user_id,
    createdAt: row.created_at,
  });

  useEffect(() => {
    let isMounted = true;

    const loadAndSubscribe = async () => {
      // 1) Load existing messages for this room
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
            id,
            room_id,
            user_id,
            content,
            created_at
          `
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (!isMounted) return;

      if (error) {
        console.error("Error loading messages", error);
      } else if (data) {
        setMessages((data as DbMessageRow[]).map(mapRowToChatMessage));
      }

      // 2) Subscribe to Postgres changes for this room
      const channel = supabase
        .channel(`room:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`, //
          },
          (payload) => {
            if (!isMounted) return;
            const row = payload.new as DbMessageRow;
            setMessages((current) => [...current, mapRowToChatMessage(row)]);
          }
        )
        .subscribe((status, err) => {
          console.log("connection status:", status);
          if (err) {
            console.log("error:", err);
          }

          if (!isMounted) return;

          if (status === "SUBSCRIBED") {
            setIsConnected(true);
          } else {
            setIsConnected(false);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanupPromise = loadAndSubscribe();

    return () => {
      isMounted = false;
      void cleanupPromise;
    };
  }, [roomId]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      // Insert into the messages table.
      // The INSERT will trigger the postgres_changes listener above.
      const { error } = await supabase.from("messages").insert({
        room_id: roomId,
        user_id: currentUserId,
        content: trimmed,
      });

      if (error) {
        console.error("Error sending message", error);
      } else {
        // Optional: optimistic local add so sender sees it even if realtime is a bit slow
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(), // temporary id, purely client-side
            content: trimmed,
            user_id: currentUserId,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    },
    [roomId, currentUserId, currentUserName]
  );

  return { messages, sendMessage, isConnected };
}
