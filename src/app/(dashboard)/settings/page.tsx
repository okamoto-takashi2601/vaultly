import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { User, Mail, Calendar, CreditCard, Shield, Globe } from "lucide-react";
import { UpgradeButton } from "@/components/upgrade-button";
import { LanguageSelector } from "@/components/language-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getOrCreateUser } from "@/lib/db/users";
import { getServerTranslations, isValidLanguage } from "@/lib/i18n";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [clerkUser, dbUser] = await Promise.all([currentUser(), getOrCreateUser()]);
  if (!clerkUser || !dbUser) redirect("/sign-in");

  const plan = dbUser.plan ?? "FREE";
  const lang = isValidLanguage(dbUser.language) ? dbUser.language : "en";
  const tr = getServerTranslations(lang);

  const PLAN_LIMITS: Record<string, string> = {
    FREE: tr.plan_free,
    PERSONAL: tr.plan_personal,
    FAMILY: tr.plan_family,
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{tr.settings_title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{tr.settings_subtitle}</p>
      </div>

      {/* Profile */}
      <Card className="border-white/10 bg-[#22233a] mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {tr.settings_profile}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <UserButton />
          <div>
            <p className="font-medium">{dbUser.name ?? clerkUser.firstName ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{dbUser.email}</p>
          </div>
          <p className="text-xs text-muted-foreground ml-auto">{tr.settings_click_avatar}</p>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="border-white/10 bg-[#22233a] mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            {tr.settings_language}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">{tr.settings_language_desc}</p>
          <LanguageSelector currentLang={lang} />
        </CardContent>
      </Card>

      {/* Plan */}
      <Card className="border-white/10 bg-[#22233a] mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            {tr.settings_plan}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-1.5 capitalize">
              {plan.charAt(0) + plan.slice(1).toLowerCase()}
            </Badge>
            <p className="text-sm text-muted-foreground">{PLAN_LIMITS[plan] ?? PLAN_LIMITS.FREE}</p>
          </div>
          {plan === "FREE" && process.env.STRIPE_SECRET_KEY && (
            <UpgradeButton plan="PERSONAL" />
          )}
        </CardContent>
      </Card>

      {/* Account info */}
      <Card className="border-white/10 bg-[#22233a]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {tr.settings_account}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{tr.settings_email}</span>
            <span className="ml-auto text-right break-all">{dbUser.email}</span>
          </div>
          <Separator className="bg-white/10" />
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{tr.settings_member_since}</span>
            <span className="ml-auto">
              {new Date(dbUser.createdAt).toLocaleDateString(lang === "ja" ? "ja-JP" : lang === "zh" ? "zh-CN" : lang === "vi" ? "vi-VN" : "en", {
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
                <span className="text-muted-foreground">{tr.settings_billing}</span>
                <span className="ml-auto text-xs text-primary">{tr.settings_billing_active}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
