"use client";

import { supabase } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";

interface UseRealtimeChatProps {
  roomId: string; // rooms.id
}

export interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  username: string;
  createdAt: string;
}

type DbMessageRow = {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_profiles?: {
    display_name: string | null;
  } | null;
};

export function useRealtimeChat({ roomId }: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mapRowToChatMessage = (row: DbMessageRow): ChatMessage => ({
    id: row.id,
    content: row.content,
    user_id: row.user_id,
    createdAt: row.created_at,
    username: row.user_profiles?.display_name ?? "Mystery user",
  });

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;
    let retryTimeout: number | null = null;
    const maxAttempts = 5;

    const loadAndSubscribe = async (attempt = 0) => {
      if (cancelled || !roomId) return;

      setIsLoading(true);
      // 1) Load existing messages for this room
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
            id,
            room_id,
            user_id,
            content,
            created_at,
            user_profiles (
            display_name
            )
          `
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Error loading messages", error);
        setIsLoading(false);

        if (attempt < maxAttempts && !cancelled) {
          const delay = Math.min(1000 * 2 ** attempt, 30000); // 1s,2s,4s... capped
          retryTimeout = window.setTimeout(
            () => loadAndSubscribe(attempt + 1),
            delay
          );
        }

        return;
      }

      if (data) {
        setMessages((data as DbMessageRow[]).map(mapRowToChatMessage));
      }
      setIsLoading(false);

      if (cancelled) return;

      // 2) Subscribe to Postgres changes for this room
      channel = supabase
        .channel(`room:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            if (cancelled) return;
            const row = payload.new as DbMessageRow;
            setMessages((current) => [...current, mapRowToChatMessage(row)]);
          }
        )
        .subscribe((status, err) => {
          if (cancelled) return;

          console.log("connection status:", status);
          if (err) {
            console.log("error:", err);
          }

          if (status === "SUBSCRIBED") {
            setIsConnected(true);
          } else {
            setIsConnected(false);

            // retry on hard failures of the channel
            if (
              (status === "CHANNEL_ERROR" ||
                status === "TIMED_OUT" ||
                status === "CLOSED") &&
              attempt < maxAttempts &&
              !cancelled
            ) {
              const delay = Math.min(1000 * 2 ** attempt, 30000);
              retryTimeout = window.setTimeout(() => {
                if (cancelled) return;
                if (channel) {
                  supabase.removeChannel(channel);
                  channel = null;
                }
                loadAndSubscribe(attempt + 1);
              }, delay);
            }
          }
        });
    };

    loadAndSubscribe();

    return () => {
      cancelled = true;
      if (retryTimeout) {
        window.clearTimeout(retryTimeout);
      }
      if (channel) {
        supabase.removeChannel(channel);
      }
      setIsLoading(false);
    };
  }, [roomId]);

  const sendMessage = useCallback(
    async (content: string) => {
      const currentUserId = (await supabase.auth.getUser()).data.user?.id;
      if (!currentUserId) {
        throw new Error("Supabase current user ID wasn't found");
      }

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
      }
    },
    [roomId]
  );

  return { messages, sendMessage, isConnected, isLoading };
}
