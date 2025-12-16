import { RealtimeChat } from "@/features/chatview/components/realtime-chat";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getUserChats } from "../api/chatsData";
import { ChatSidebar } from "./ChatSidebar";
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile";
import { Switch } from "@/components/ui/switch";
import { useUpdateIsLookingForMatch } from "../hooks/useUpdateIsLookingForMatch";
import { Button } from "@/components/ui/button";

function SessionPage() {
  const [userChats, setUserChats] = useState<string[] | []>([]);
  const [openChat, setOpenChat] = useState<string | null>(null);
  const user = useCurrentUserProfile();
  const { data: profile, isLoading, isError } = useCurrentUserProfile();
  const { mutate: setLookingForMatch, isPending } =
    useUpdateIsLookingForMatch();

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

  async function handleFindMatchClick() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      console.error(
        "Unable to find match: missing auth session",
        error?.message || "no session",
      );
      return;
    }

    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "find_match", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    if (!res.ok) {
      console.error(
        "find_match request failed",
        res.status,
        res.statusText || "unknown error",
      );
      return;
    }
    const chats = await getUserChats(user.data?.id);
    setUserChats(chats);
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
              >
                Find Match
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

export default SessionPage;
