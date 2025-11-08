import { useNavigate } from "react-router";
import AppDescription from "./AppDescription";
import LogoText from "./LogoText";
import { ShaderAnimation } from "./ui/neno-shader";
import loginIntoCometChat from "@/lib/cometChatUtils";
import { useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";

export default function FrontPage() {
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
      return;
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
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "first-vibe-submission",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // 👇 important if backend is on another origin
          credentials: "include",
          body: JSON.stringify({ text: vibe }),
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to submit vibe: ${res.status}`);
      }
      const data = await res.json();
      clearInterval(interval);
      setProgress(10);
      await new Promise((resolve) => setTimeout(resolve, 200));
      loginIntoCometChat(data.cometchat.authToken);
      navigate("/session", {
        state: { firstTimeUser: true, matchedWithUser: data.matchedWithUser },
      });
    } catch {
      // TODO  implement the error page
      navigate("/error");
    }
  };
  return (
    <main className="relative flex flex-col  items-center w-full h-screen overflow-hidden gap-10 dark">
      <ShaderAnimation />
      <div className="absolute z-10 flex flex-col h-full">
        <div className="flex flex-col justify-center grow-3 gap-20">
          <div className="flex justify-center ">
            <LogoText></LogoText>
          </div>
          <div className=" ">
            <AppDescription></AppDescription>
          </div>
        </div>
        <div className="flex flex-col grow-3 items-center justify-start ">
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
          {loading && (
            <div className=" mx-auto w-full max-w-xl text-center">
              <motion.p className="text-foreground text-3xl font-bold">
                Finding your match <motion.span>{text}</motion.span>
              </motion.p>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 flex justify-between bg-white/0 mb-4 w-full px-6 md:px-4 md:mb-4 ">
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
