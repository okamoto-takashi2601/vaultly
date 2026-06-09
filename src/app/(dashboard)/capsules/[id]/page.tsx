import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Unlock, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Placeholder — replace with DB query
const mockCapsule = {
  id: "1",
  title: "Letter to my future self",
  status: "LOCKED",
  unlocksAt: new Date("2030-01-01"),
  createdAt: new Date("2026-06-09"),
  contents: [
    {
      id: "c1",
      type: "TEXT",
      body: "Dear future me,\n\nI hope you're doing well. Right now I'm working on Vaultly, a time capsule app for a hackathon. I hope you shipped something you're proud of.\n\nWith love,\nPast you",
    },
  ],
  recipients: [{ email: "me@example.com" }],
};

export default async function CapsuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  if (!id) notFound();

  const capsule = mockCapsule; // TODO: fetch from DB by id
  const isLocked = capsule.status === "LOCKED";

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{capsule.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Created {capsule.createdAt.toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        {isLocked ? (
          <Badge variant="secondary" className="gap-1 shrink-0">
            <Lock className="h-3 w-3" /> Locked
          </Badge>
        ) : (
          <Badge className="gap-1 shrink-0 bg-primary/20 text-primary border-primary/30">
            <Unlock className="h-3 w-3" /> Unlocked
          </Badge>
        )}
      </div>

      {/* Locked state */}
      {isLocked && (
        <Card className="border-white/10 bg-[#22233a] mb-6">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">This capsule is sealed</p>
              <p className="text-sm text-muted-foreground mt-1">
                Opens on{" "}
                <span className="text-foreground font-medium">
                  {capsule.unlocksAt.toLocaleDateString("en", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content — only show if unlocked */}
      {!isLocked && (
        <div className="flex flex-col gap-4 mb-6">
          {capsule.contents.map((content) => (
            <Card key={content.id} className="border-white/10 bg-[#22233a]">
              <CardContent className="p-6">
                {content.type === "TEXT" && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {content.body}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator className="bg-white/10 mb-6" />

      {/* Meta */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Unlocks</span>
          <span>
            {capsule.unlocksAt.toLocaleDateString("en", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <span className="text-muted-foreground">Recipients</span>
            <div className="flex flex-col gap-1 mt-1">
              {capsule.recipients.map((r) => (
                <span key={r.email} className="text-sm">
                  {r.email}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
