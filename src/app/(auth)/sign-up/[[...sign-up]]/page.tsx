import { SignUp } from "@clerk/nextjs";
import { darkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
      />
      <SignUp appearance={darkAppearance} />
    </div>
  );
}
