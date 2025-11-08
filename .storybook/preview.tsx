// .storybook/preview.ts
import type { Preview } from "@storybook/react-vite";
import { MemoryRouter, Routes, Route } from "react-router";
import "../src/global.css";

import {
  UIKitSettingsBuilder,
  CometChatUIKit,
} from "@cometchat/chat-uikit-react";
import { CometChatProvider } from "../src/CometChat/context/CometChatContext";
import { setupLocalization } from "../src/CometChat/utils/utils";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: "todo" },
  },

  // ✱ ADDED: Initialize CometChat before any story renders
  loaders: [
    async () => {
      const uiKitSettings = new UIKitSettingsBuilder()
        .setAppId(import.meta.env.VITE_COMETCHAT_APP_ID)
        .setRegion(import.meta.env.VITE_COMETCHAT_REGION)
        .subscribePresenceForAllUsers()
        .build();

      await CometChatUIKit.init(uiKitSettings);
      setupLocalization();
      const existing = await CometChatUIKit.getLoggedinUser();
      if (!existing) {
        // Prefer an Auth Token if you have one; else use a dev UID.
        const token = import.meta.env.VITE_COMETCHAT_AUTH_TOKEN;
        const uid = import.meta.env.VITE_COMETCHAT_TEST_UID;

        if (token) {
          await CometChatUIKit.loginWithAuthToken(token);
        } else {
          // Requires AUTH_KEY to be set in settings above (dev only).
          await CometChatUIKit.login(uid);
        }
      }
      return {};
    },
  ],

  // ✱ ADDED: Provide your CometChat context to all stories
  decorators: [
    (Story, context) => {
      const initialPath = (context.args as any)?.initialPath || "/";
      return (
        <CometChatProvider>
          <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
              <Route path="*" element={<Story />} />
            </Routes>
          </MemoryRouter>
        </CometChatProvider>
      );
    },
  ],
};

export default preview;
