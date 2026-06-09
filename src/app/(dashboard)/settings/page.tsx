import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { User, Mail, Shield, Calendar, CreditCard } from "lucide-react";
import { UpgradeButton } from "@/components/upgrade-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getOrCreateUser } from "@/lib/db/users";

const PLAN_LIMITS: Record<string, string> = {
  FREE: "Up to 3 capsules · 8 MB per image",
  PERSONAL: "Up to 20 capsules · 50 MB per image",
  FAMILY: "Unlimited capsules · 256 MB per image",
};

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [clerkUser, dbUser] = await Promise.all([currentUser(), getOrCreateUser()]);
  if (!clerkUser || !dbUser) redirect("/sign-in");

  const plan = dbUser.plan ?? "FREE";

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <Card className="border-white/10 bg-[#22233a] mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <UserButton />
          <div>
            <p className="font-medium">{dbUser.name ?? clerkUser.firstName ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{dbUser.email}</p>
          </div>
          <p className="text-xs text-muted-foreground ml-auto">Click avatar to edit profile</p>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card className="border-white/10 bg-[#22233a] mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-1.5 capitalize">
              {plan.charAt(0) + plan.slice(1).toLowerCase()}
            </Badge>
            <p className="text-sm text-muted-foreground">{PLAN_LIMITS[plan] ?? PLAN_LIMITS.FREE}</p>
          </div>
          {plan === "FREE" && (
            <UpgradeButton plan="PERSONAL" />
          )}
        </CardContent>
      </Card>

      {/* Account info */}
      <Card className="border-white/10 bg-[#22233a]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Email</span>
            <span className="ml-auto text-right break-all">{dbUser.email}</span>
          </div>
          <Separator className="bg-white/10" />
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Member since</span>
            <span className="ml-auto">
              {new Date(dbUser.createdAt).toLocaleDateString("en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {dbUser.stripeCustomerId && (
            <>
              <Separator className="bg-white/10" />
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Billing</span>
                <span className="ml-auto text-xs text-primary">Active subscription</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
