import { RealtimeChat } from "@/features/chatview/components/realtime-chat";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getUserChats } from "../api/chatsData";
import { ChatSidebar } from "./ChatSidebar";
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile";
import { Switch } from "@/components/ui/switch";
import { useUpdateIsLookingForMatch } from "../hooks/useUpdateIsLookingForMatch";
import { Button } from "@/components/ui/button";

function ChatsView() {
  const [userChats, setUserChats] = useState<string[] | []>([]);
  const [openChat, setOpenChat] = useState<string | null>(null);
  const { data: profile } = useCurrentUserProfile();
  const { mutate: setLookingForMatch } = useUpdateIsLookingForMatch();
  const [isFindingMatch, setIsFindingMatch] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownMs, setCooldownMs] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      if (!userId) {
        throw new Error("No user_id");
      }
      const chats = await getUserChats(userId);
      setUserChats(chats);
    };
    load();
  }, []);

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownMs(0);
      return;
    }
    const tick = () => {
      const remaining = Math.max(0, cooldownUntil - Date.now());
      setCooldownMs(remaining);
      if (remaining === 0) {
        setCooldownUntil(null);
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [cooldownUntil]);

  const formatCooldown = () => {
    const totalSeconds = Math.ceil(cooldownMs / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  async function handleFindMatchClick() {
    if (cooldownMs > 0) {
      return;
    }
    setIsFindingMatch(true);
    setCooldownUntil(Date.now() + 2 * 60 * 1000);
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      console.error(
        "Unable to find match: missing auth session",
        error?.message || "no session"
      );
      setIsFindingMatch(false);
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "find_match", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        console.error(
          "find_match request failed",
          res.status,
          res.statusText || "unknown error"
        );
        return;
      }

      const body: {
        room_id?: string;
        matched_user_id?: string;
        matched_display_name?: string | null;
      } = await res.json();

      const userId = session.user?.id ?? profile?.id;
      if (userId) {
        const chats = await getUserChats(userId);
        setUserChats(chats);
      }

      if (body?.room_id) {
        setOpenChat(body.room_id);
      }
    } catch (err) {
      console.error("find_match request failed", err);
    } finally {
      setIsFindingMatch(false);
    }
  }

  return (
    <div style={{ width: "100vw", height: "100dvh" }}>
      {userChats && (
        <div className="flex">
          <ChatSidebar
            chats={userChats}
            activeChatId={openChat}
            onSelectChat={(value) => {
              setOpenChat(value);
            }}
          ></ChatSidebar>
          <div>
            <div>
              <span>Available: </span>
              <Switch
                checked={profile?.is_looking_for_match}
                onCheckedChange={(checked) => {
                  setLookingForMatch(checked);
                }}
              ></Switch>

              <Button
                onClick={() => {
                  handleFindMatchClick();
                }}
                disabled={isFindingMatch || cooldownMs > 0}
              >
                {isFindingMatch
                  ? "Finding..."
                  : cooldownMs > 0
                  ? `Wait ${formatCooldown()}`
                  : "Find Match"}
              </Button>
            </div>

            {openChat && (
              <RealtimeChat
                roomId={openChat}
                username={profile?.display_name ?? "Mystery user"}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatsView;
