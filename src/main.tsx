import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "@/global.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource-variable/playfair-display/index.css";

import App from "./App.tsx";
import ChatsView from "./features/chatview/components/ChatsView.tsx";
import LoginPage from "./components/LoginPage.tsx";
import SignUpPage from "./components/SignUpPage.tsx";
import { supabase } from "@/lib/supabase/client.ts";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

async function updatePresence() {
  const user_id = (await supabase.auth.getUser()).data.user?.id;
  if (!user_id) {
    return;
  }
  await supabase
    .from("user_presence")
    .upsert({ user_id: user_id, last_seen: new Date().toISOString() });
}

// example: call every 25 seconds
setInterval(updatePresence, 30000);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/chats" element={<ChatsView />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
