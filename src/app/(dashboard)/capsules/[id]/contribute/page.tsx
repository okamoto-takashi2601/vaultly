import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getCapsuleForContribute } from "@/lib/db/capsules";
import { getOrCreateUser } from "@/lib/db/users";
import { ContributeForm } from "@/components/contribute-form";

export default async function ContributePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const capsule = await getCapsuleForContribute(id);

  if (!capsule) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold">Capsule not available</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            This capsule is not accepting contributions, or the link may be invalid.
          </p>
          <Link
            href="/dashboard"
            className="text-sm text-[#d9b76e] hover:text-[#d9b76e]/80 transition-colors"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (capsule.status === "UNLOCKED") {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="h-14 w-14 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
            <Lock className="h-6 w-6 text-emerald-400" />
          </div>
          <h1 className="text-xl font-semibold">This capsule has already been opened</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            <span className="text-foreground font-medium">{capsule.title}</span> has been unlocked
            and contributions are no longer accepted.
          </p>
          <Link
            href="/dashboard"
            className="text-sm text-[#d9b76e] hover:text-[#d9b76e]/80 transition-colors"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const unlocksAt = new Date(capsule.unlocksAt);

  const unlockDateStr = unlocksAt.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#d9b76e] bg-[#d9b76e]/10 border border-[#d9b76e]/20 rounded-full px-3 py-1 mb-3">
          <Lock className="h-3 w-3" />
          Collaborative capsule
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{capsule.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add your message — it will be sealed until{" "}
          <span className="text-foreground">{unlockDateStr}</span>.
        </p>
      </div>

      <Card className="border-white/10 bg-[#22233a]">
        <CardContent className="p-6">
          <ContributeForm
            capsuleId={capsule.id}
            capsuleTitle={capsule.title}
            unlocksAt={unlocksAt}
            authorId={capsule.authorId}
            currentUserId={user.clerkId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
