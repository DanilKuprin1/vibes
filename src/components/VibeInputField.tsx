import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

type VibeInputFieldProps = {
  onSubmit?:
    | string
    | ((formData: FormData) => void | Promise<void>)
    | undefined;
};
export default function VibeInputField({ onSubmit }: VibeInputFieldProps) {
  return (
    <PlaceholdersAndVanishInput
      placeholders={["Your mood in a sentence…"]}
      onSubmit={onSubmit}
    ></PlaceholdersAndVanishInput>
  );
}
