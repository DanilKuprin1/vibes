import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "@/global.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource-variable/playfair-display/index.css";

import App from "./App.tsx";
import SessionPage from "./features/chatview/components/SessionPage.tsx";
import LoginPage from "./components/LoginPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/session" element={<SessionPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
