import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CapsuleCalendar } from "@/components/capsule-calendar";
import { getOrCreateUser } from "@/lib/db/users";
import { getCapsulesByUserId } from "@/lib/db/capsules";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const capsules = await getCapsulesByUserId(user.id);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Capsules</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {capsules.length} capsule{capsules.length !== 1 ? "s" : ""} · unlock dates on calendar
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/capsules/new" />} className="gap-2">
          <Plus className="h-4 w-4" />
          New Capsule
        </Button>
      </div>

      <CapsuleCalendar capsules={capsules} />
    </div>
  );
}
