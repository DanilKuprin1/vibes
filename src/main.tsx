import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import {
  UIKitSettingsBuilder,
  CometChatUIKit,
} from "@cometchat/chat-uikit-react";
import { setupLocalization } from "./CometChat/utils/utils.ts";
import { CometChatProvider } from "./CometChat/context/CometChatContext.tsx";
import "@/global.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource-variable/playfair-display/index.css";

import App from "./App.tsx";
import SessionPage from "./components/SessionPage.tsx";

export const COMETCHAT_CONSTANTS = {
  APP_ID: import.meta.env.VITE_COMETCHAT_APP_ID, // Replace with your App ID
  REGION: import.meta.env.VITE_COMETCHAT_REGION, // Replace with your App Region
  // AUTH_KEY: "", // Replace with your Auth Key or leave blank if you are authenticating using Auth Token
};
const uiKitSettings = new UIKitSettingsBuilder()
  .setAppId(COMETCHAT_CONSTANTS.APP_ID)
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  // .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
  .subscribePresenceForAllUsers()
  .build();

CometChatUIKit.init(uiKitSettings)?.then(() => {
  setupLocalization();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <CometChatProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/session" element={<SessionPage />} />
          </Routes>
        </BrowserRouter>
      </CometChatProvider>
    </StrictMode>
  );
});
