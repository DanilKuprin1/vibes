import {} from "@ably/chat-react-ui-kit";
import { RealtimeChat } from "@/features/chatview/components/realtime-chat";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getUserChats } from "../api/chatsData";

function SessionPage() {
  const [userChats, setUserChats] = useState<string[] | []>([]);
  useEffect(() => {
    const load = async () => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      const chats = await getUserChats(userId);
      setUserChats(chats);
    };
    load();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100dvh" }} className="relative dark">
      return{" "}
      {userChats && (
        <div className="fixed top-1/2 left-1/2 w-500 h-500">
          <RealtimeChat roomName={userChats[0]} username={"my super name"} />
        </div>
      )}
    </div>
  );
}

export default SessionPage;
