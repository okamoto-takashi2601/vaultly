import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "oklch(0.82 0.13 82)",
            colorBackground: "oklch(0.205 0.01 260)",
            colorText: "oklch(0.97 0.005 90)",
            colorInputBackground: "oklch(0.27 0.012 260)",
            colorInputText: "oklch(0.97 0.005 90)",
            borderRadius: "0.75rem",
          },
          elements: {
            cardBox: "border border-white/10 shadow-2xl",
          },
        }}
      />
    </div>
  );
}
