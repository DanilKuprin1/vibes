import { SignUpForm } from "./sign-up-form";
import AnoAI from "./ui/animated-shader-background";

export default function SignUpPage() {
  return (
    <div className="relative flex flex-col justify-center items-center h-screen w-screen overflow-hidden bg-background dark">
      <AnoAI />
      <div className="flex flex-col items-center absolute z-10">
        <SignUpForm className="w-90" />
      </div>
    </div>
  );
}
