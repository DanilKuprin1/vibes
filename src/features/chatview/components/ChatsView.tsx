import { RealtimeChat } from "@/features/chatview/components/realtime-chat";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getUserChats } from "../api/chatsData";
import { ChatSidebar } from "./ChatSidebar";
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile";
import { Switch } from "@/components/ui/switch";
import { useUpdateIsLookingForMatch } from "../hooks/useUpdateIsLookingForMatch";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

function ChatsView() {
  const [userChats, setUserChats] = useState<string[] | []>([]);
  const [openChat, setOpenChat] = useState<string | null>(null);
  const { data: profile } = useCurrentUserProfile();
  const { mutate: setLookingForMatch } = useUpdateIsLookingForMatch();
  const [isFindingMatch, setIsFindingMatch] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownMs, setCooldownMs] = useState<number>(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const navigate = useNavigate();
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        if (!userId) {
          navigate("/login", { replace: true });
          return;
        }
        const sessionRes = await supabase.auth.getSession();
        const sessionUser = sessionRes.data.session?.user;
        const anon =
          !!sessionUser?.is_anonymous ||
          sessionUser?.app_metadata?.provider === "anonymous";
        setIsAnonymous(anon);
        const chats = await getUserChats(userId);
        setUserChats(chats);
        const stored = sessionStorage.getItem("matchCooldownUntil");
        let until = stored ? parseInt(stored, 10) : null;
        if (!until) {
          const profileRes = await supabase
            .from("user_profiles")
            .select("last_matched_at")
            .eq("id", userId)
            .single();
          const lastMatchedRaw = profileRes.data?.last_matched_at;
          if (lastMatchedRaw) {
            const last = new Date(lastMatchedRaw).getTime();
            const target = last + 2 * 60 * 1000;
            if (target > Date.now()) {
              until = target;
            }
          }
        }
        if (until && until > Date.now()) {
          setCooldownUntil(until);
          sessionStorage.setItem("matchCooldownUntil", String(until));
        } else {
          sessionStorage.removeItem("matchCooldownUntil");
        }
      } catch (err) {
        console.error("Failed to initialize chats view", err);
      } finally {
        setIsCheckingAvailability(false);
      }
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
    if (isCheckingAvailability || cooldownMs > 0) {
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
                disabled={
                  isFindingMatch || cooldownMs > 0 || isCheckingAvailability
                }
              >
                {isFindingMatch
                  ? "Finding..."
                  : cooldownMs > 0
                  ? `Wait ${formatCooldown()}`
                  : "Find Match"}
              </Button>
              {isAnonymous && (
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={() => navigate("/sign-up")}
                >
                  Sign up to save your account
                </Button>
              )}
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
