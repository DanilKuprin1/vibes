import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router";

export default function FrontPage() {
  let navigate = useNavigate();
  const onSubmit = async (formData: FormData) => {
    "use server";

    const vibe = formData.get("vibe")?.toString().trim() ?? "";

    const response = await supabase.auth.signInAnonymously();

    if (response.error || !response.data.user?.id) {
      throw new Error(
        `Failed to create anonymous session: ${response.error?.message}`
      );
    }
    const { data, error } = await supabase.from("user_profiles").insert({
      id: response.data.user?.id,
      vibe_text: vibe,
    });
    if (error) {
      throw new Error(
        "Failed to create user_profile for user: " +
          response.data.user.id +
          "; Reason: " +
          error.message
      );
    }
    // TODO: start the process of looking for a match to create a chat with.

    const target = "/session";
    navigate(target);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_theme(colors.primary/18%),transparent_60%)] bg-background text-foreground">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-[-30%] h-[70vh] bg-gradient-to-b from-primary/25 via-transparent to-transparent blur-3xl" />
        <div className="absolute left-[-10%] top-1/3 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute right-[-15%] top-1/2 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex justify-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground backdrop-blur">
            VibeSync
          </span>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur">
          <div className="relative overflow-hidden rounded-[2.5rem]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,_theme(colors.primary/12%)_0%,_transparent_55%)] opacity-90" />
            <div className="relative space-y-8 px-8 py-12 sm:px-12 sm:py-16">
              <header className="space-y-4 text-center">
                <h1 className="text-balance text-4xl font-display font-bold tracking-tight sm:text-5xl">
                  Drop your vibe. Step inside.
                </h1>
                <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
                  Ground the room in how you&apos;re feeling right now. We begin
                  every session from the vibe you share here.
                </p>
              </header>

              <form className="space-y-6" action={onSubmit}>
                <label
                  htmlFor="vibe"
                  className="block text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground"
                >
                  Your vibe
                </label>
                <textarea
                  id="vibe"
                  name="vibe"
                  placeholder="e.g. Curious introvert, craving deep talks"
                  className="h-36 w-full resize-none rounded-2xl border border-border/60 bg-background/80 p-5 text-xl leading-relaxed text-foreground font-[--font-display]  shadow-inner transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                />
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-primary to-accent px-6 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                >
                  Continue
                  <span
                    aria-hidden
                    className="text-lg leading-none transition-transform group-hover:translate-x-1"
                  >
                    ➜
                  </span>
                </button>
              </form>

              <p className="text-center text-xs text-muted-foreground/90">
                You can update or clear your vibe once you&apos;re through the
                door.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
