import AnoAI from "@/components/ui/animated-shader-background";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="relative flex flex-col justify-center items-center h-screen w-screen overflow-hidden bg-background dark">
      <AnoAI />
      <div className="flex flex-col items-center absolute z-10">
        <LoginForm className=" w-90"></LoginForm>
        <a
          href="/"
          className="text-foreground text-base font-light mt-1.5 hover:underline"
        >
          Go Back
        </a>
      </div>
    </div>
  );
}
