import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatSidebarProps = {
  chats: string[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
};

export function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-72 flex-col border-r bg-background">
      <div className="px-3 py-2 border-b">
        <h2 className="text-sm font-semibold">Chats</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {chats.map((chat) => (
            <Button
              key={chat}
              variant={chat === activeChatId ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left px-3 py-2 h-auto",
                "flex flex-col gap-0.5"
              )}
              onClick={() => onSelectChat(chat)}
            >
              <span className="text-sm font-medium truncate">{chat}</span>
              {/* {chat.lastMessage && (
                <span className="text-xs text-muted-foreground truncate">
                  {chat.lastMessage}
                </span>
              )} */}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
