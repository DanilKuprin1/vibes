import CometChatApp from "@/CometChat/CometChatApp";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useLocation } from "react-router";
import { useState } from "react";

function SessionPage() {
  const location = useLocation();
  const { state } = location;
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(
    (state?.firstTimeUser ?? false) &&
      state?.matchedWithUser != undefined &&
      state?.matchedWithUser != null
  );

  return (
    <div style={{ width: "100vw", height: "100dvh" }} className="relative dark">
      {showWelcomeMessage && (
        <div className="absolute z-10 h-full w-full flex justify-center items-center border-2 border-amber-300">
          <Dialog
            open={showWelcomeMessage}
            onOpenChange={() => {
              setShowWelcomeMessage((value) => {
                return !value;
              });
            }}
          >
            {/* <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger> */}
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Congrats! You just got yourself a match with:{" "}
                  {state.matchedWithUser}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Name</Label>
                  <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Username</Label>
                  <Input
                    id="username-1"
                    name="username"
                    defaultValue="@peduarte"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <CometChatApp />
    </div>
  );
}

export default SessionPage;
