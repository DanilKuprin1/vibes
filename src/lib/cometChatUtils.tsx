import { CometChatUIKit } from "@cometchat/chat-uikit-react";

export default function loginIntoCometChat(authToken: string) {
  CometChatUIKit.loginWithAuthToken(authToken).then(
    (user) => console.log("Login successful:", user),
    (error) => console.log("Login failed:", error)
  );
}
