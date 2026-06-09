import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Lock, Unlock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getOrCreateUser } from "@/lib/db/users";
import { getCapsulesByUserId } from "@/lib/db/capsules";
import { auth } from "@clerk/nextjs/server";

function statusBadge(status: string) {
  if (status === "LOCKED")
    return (
      <Badge variant="secondary" className="gap-1 text-xs shrink-0">
        <Lock className="h-3 w-3" /> Locked
      </Badge>
    );
  if (status === "UNLOCKED")
    return (
      <Badge className="gap-1 text-xs shrink-0 bg-primary/20 text-primary border-primary/30">
        <Unlock className="h-3 w-3" /> Unlocked
      </Badge>
    );
  return (
    <Badge variant="outline" className="gap-1 text-xs shrink-0">
      <Clock className="h-3 w-3" /> Draft
    </Badge>
  );
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const capsules = await getCapsulesByUserId(user.id);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Capsules</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {capsules.length} capsule{capsules.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/capsules/new" />} className="gap-2">
          <Plus className="h-4 w-4" />
          New Capsule
        </Button>
      </div>

      {capsules.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-1">No capsules yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Create your first time capsule and seal a message for the future.
          </p>
          <Button nativeButton={false} render={<Link href="/capsules/new" />}>
            Create your first capsule
          </Button>
        </div>
      )}

      {capsules.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capsules.map((capsule) => (
            <Link key={capsule.id} href={`/capsules/${capsule.id}`}>
              <Card className="border-white/10 bg-[#22233a] hover:border-primary/40 hover:bg-[#26273f] transition-all cursor-pointer h-full">
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                      {capsule.title}
                    </h3>
                    {statusBadge(capsule.status)}
                  </div>
                  <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-white/10">
                    <span>
                      {capsule.status === "UNLOCKED" ? "Opened" : "Opens"}{" "}
                      {new Date(capsule.unlocksAt).toLocaleDateString("en", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>
                      {capsule.recipients.length} recipient
                      {capsule.recipients.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
