import { useNavigate } from "react-router";
import AppDescription from "./AppDescription";
import LogoText from "./LogoText";
import { ShaderAnimation } from "./ui/neno-shader";
import VibeInputField from "./VibeInputField";
import loginIntoCometChat from "@/lib/cometChatUtils";

export default function FrontPage() {
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("e is: ", e);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const vibe = formData.get("vibe-input");

    if (vibe == "") {
      return;
    }
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
    console.log("Created user:", data);
    loginIntoCometChat(data.cometchat.authToken);

    const target = "/session";
    navigate(target);
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
        <div className="flex grow-3 items-start">
          <VibeInputField onSubmit={onSubmit}></VibeInputField>
        </div>
      </div>
      <div className="fixed bottom-0 flex justify-between bg-white/0 mb-4 w-full px-6 md:px-4 md:mb-4 ">
        <span className="text-white/15">
          © {new Date().getFullYear()} Danil Kuprin
        </span>
        {/* <a href="https://github.com/danilkuprin1" className="text-white/20">
          GitHub/danilkuprin1
        </a> */}
      </div>
    </main>
  );
}
