import AppDescription from "./AppDescription";
import LogoText from "./LogoText";
import { ShaderAnimation } from "./ui/neno-shader";
import VibeInputField from "./VibeInputField";

export default function FrontPage() {
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
          <VibeInputField></VibeInputField>
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
