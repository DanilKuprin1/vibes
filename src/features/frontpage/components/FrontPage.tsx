import { useNavigate } from "react-router";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";
import { ShaderAnimation } from "@/components/ui/neno-shader";
import LogoText from "@/components/LogoText";
import AppDescription from "@/components/AppDescription";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export default function FrontPage() {
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => Math.round(latest));
  const text = useMotionTemplate`${rounded}/10`;

  useEffect(() => {
    const controls = animate(mv, progress, { duration: 0.5, ease: "easeOut" });
    return controls.stop;
  }, [progress, mv]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const formData = new FormData(form);
    const vibe = formData.get("vibe-input");

    if (vibe == "") {
      throw new Error("No vibe....");
    }

    setLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        // slow approach to ~90%
        if (prev < 8.5) return prev + Math.random();
        return prev;
      });
    }, 300);

    try {
      const { data: anonData, error: anonError } =
        await supabase.auth.signInAnonymously({
          options: { captchaToken },
        });

      if (anonError || !anonData?.user) {
        throw anonError || new Error("Anonymous sign-in failed");
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        throw new Error("No access token after anonymous sign-in");
      }

      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "first-vibe-submission",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ text: vibe }),
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to submit vibe: ${res.status}`);
      }
      clearInterval(interval);
      setProgress(10);
      await new Promise((resolve) => setTimeout(resolve, 200));
      navigate("/chats", { state: { matchedAt: Date.now() } });
    } catch {
      // TODO  implement the error page
      navigate("/error");
    }
  };
  return (
    <main className="relative flex flex-col  items-center w-full h-screen overflow-hidden gap-10 dark">
      <Turnstile
        as="aside"
        siteKey="0x4AAAAAACAN8tU84jhV0dZ6"
        onSuccess={(token) => {
          setCaptchaToken(token);
        }}
        className="fixed bottom-4 right-4 z-7"
        options={{
          action: "front-page",
          theme: "dark",
          size: "compact",
          language: "en",
        }}
        scriptOptions={{
          appendTo: "body",
        }}
      />
      <ShaderAnimation />
      <div className="bg-black/15  backdrop-blur-md absolute z-4 w-full h-full"></div>
      <div className="absolute z-10 flex flex-col h-full justify-center gap-50">
        <div className="flex justify-center ">
          <LogoText></LogoText>
        </div>
        <div className="">
          <AppDescription></AppDescription>
        </div>
        <div className="">
          {!loading && (
            <div className="flex flex-col items-center">
              <PlaceholdersAndVanishInput
                placeholders={["Your mood in a sentence..."]}
                onSubmit={onSubmit}
              ></PlaceholdersAndVanishInput>

              <a
                href="/login"
                className="text-foreground font-normal text hover:underline mt-2.5"
              >
                Already have an account?{" "}
              </a>
            </div>
          )}
        </div>

        {loading && (
          <div className=" mx-auto w-full max-w-xl text-center">
            <motion.p className="text-foreground text-3xl font-bold">
              Finding your match <motion.span>{text}</motion.span>
            </motion.p>
          </div>
        )}
      </div>
      <div className="fixed z-7 bottom-0 flex justify-between bg-white/0 mb-4 w-full px-6 md:px-4 md:mb-4 ">
        <span className="text-foreground/15">
          © {new Date().getFullYear()}{" "}
          <a href="https://github.com/danilkuprin1">Danil Kuprin</a>
        </span>
        {/* <a href="https://github.com/danilkuprin1" className="text-white/20">
          GitHub/danilkuprin1
        </a> */}
      </div>
    </main>
  );
}
