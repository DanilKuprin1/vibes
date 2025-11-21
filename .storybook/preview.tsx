// .storybook/preview.ts
import type { Preview } from "@storybook/react-vite";
import { MemoryRouter, Routes, Route } from "react-router";
import "../src/global.css";
import React from "react";

import { supabase } from "@/lib/supabase/client";

const withSupabaseTestUser = (Story) => {
  const [state, setState] = React.useState<
    | { status: "loading" }
    | { status: "ok" }
    | { status: "error"; message: string }
  >({ status: "loading" });

  React.useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: import.meta.env.STORYBOOK_SUPABASE_TEST_EMAIL!,
            password: import.meta.env.STORYBOOK_SUPABASE_TEST_PASSWORD!,
            options: {
              captchaToken: "1x00000000000000000000AA",
            },
          });

        if (cancelled) return;

        if (loginError) {
          console.error(
            "Storybook Supabase test user login failed",
            loginError
          );
          setState({
            status: "error",
            message: loginError.message ?? "Login failed",
          });
          return;
        }

        console.log("Storybook login session", loginData?.session);

        // Double-check we actually have a session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (cancelled) return;

        console.log("Storybook getSession()", { sessionData, sessionError });

        if (!sessionData?.session || sessionError) {
          setState({
            status: "error",
            message:
              sessionError?.message ??
              "No Supabase session after login (AuthSessionMissingError)",
          });
          return;
        }

        setState({ status: "ok" });
      } catch (e: any) {
        if (cancelled) return;
        console.error("Storybook Supabase test user unexpected error", e);
        setState({
          status: "error",
          message: e?.message ?? "Unexpected error during Supabase login",
        });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return <div>Connecting Supabase test user…</div>;
  }

  if (state.status === "error") {
    return (
      <div style={{ padding: 16, color: "red" }}>
        Failed to login Supabase test user in Storybook: {state.message}
      </div>
    );
  }

  return <Story />;
};

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

  decorators: [
    withSupabaseTestUser,
    (Story, context) => {
      const initialPath = (context.args as any)?.initialPath || "/";
      return (
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="*" element={<Story />} />
          </Routes>
        </MemoryRouter>
      );
    },
  ],
};

export default preview;
