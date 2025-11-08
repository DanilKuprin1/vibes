import { LoginForm } from "./login-form";
import AnoAI from "./ui/animated-shader-background";

export default function LoginPage() {
  return (
    //     <main className="relative flex flex-col  items-center w-full h-screen overflow-hidden gap-10 dark">
    //   <ShaderAnimation />
    //   <div className="absolute z-10 flex flex-col h-full">

    // </main>

    <div className="relative flex flex-col justify-center items-center h-screen w-screen overflow-hidden bg-background dark">
      {/* <ShaderAnimation /> */}
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
