import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Unlock, Users, Calendar, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CapsuleLockedView } from "@/components/capsule-countdown";
import { ShareButtons } from "@/components/share-buttons";
import { DeleteCapsuleButton } from "@/components/delete-capsule-button";
import { getOrCreateUser } from "@/lib/db/users";
import { getCapsuleById } from "@/lib/db/capsules";

export default async function CapsuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const capsule = await getCapsuleById(id, user.id);
  if (!capsule) notFound();

  const now = new Date();
  const unlocksAt = new Date(capsule.unlocksAt);
  const isLocked = capsule.status !== "UNLOCKED" && unlocksAt > now;

  if (isLocked) {
    return (
      <CapsuleLockedView
        capsuleId={capsule.id}
        shareUrl={`${process.env.NEXT_PUBLIC_APP_URL}/capsules/${capsule.id}`}
        title={capsule.title}
        description={capsule.description}
        unlocksAt={unlocksAt}
        createdAt={new Date(capsule.createdAt)}
        recipients={capsule.recipients.map((r) => ({ id: r.id, email: r.email }))}
        isShared={capsule.isShared}
      />
    );
  }

  // Unlocked view
  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{capsule.title}</h1>
          {capsule.description && (
            <p className="text-sm text-muted-foreground mt-1">{capsule.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className="gap-1 bg-emerald-400/15 text-emerald-200 border-emerald-400/25">
            <Unlock className="h-3 w-3" /> Unlocked
          </Badge>
          <DeleteCapsuleButton capsuleId={capsule.id} />
        </div>
      </div>

      {/* Text contents */}
      {capsule.contents
        .filter((c) => c.type === "TEXT")
        .map((content) => (
          <Card key={content.id} className="border-white/10 bg-[#22233a] mb-4">
            <CardContent className="p-6">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{content.body}</p>
            </CardContent>
          </Card>
        ))}

      {/* Media grid */}
      {capsule.contents.some((c) => c.type === "IMAGE" || c.type === "VIDEO") && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {capsule.contents
            .filter((c) => c.type === "IMAGE" || c.type === "VIDEO")
            .map((content) => (
              <div
                key={content.id}
                className="relative rounded-xl overflow-hidden border border-white/10 bg-[#22233a]"
              >
                {content.type === "IMAGE" && content.mediaUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={content.mediaUrl}
                    alt=""
                    className="w-full aspect-square object-cover"
                  />
                )}
                {content.type === "VIDEO" && content.mediaUrl && (
                  <video
                    src={content.mediaUrl}
                    controls
                    className="w-full aspect-video"
                  />
                )}
              </div>
            ))}
        </div>
      )}

      {/* Contributions from friends */}
      {(() => {
        const contributions = capsule.contents.filter(
          (c) => c.authorId && c.authorId !== capsule.authorId
        );
        if (contributions.length === 0) return null;

        // Group by authorId
        const byAuthor = contributions.reduce<Record<string, typeof contributions>>((acc, c) => {
          const key = c.authorId!;
          if (!acc[key]) acc[key] = [];
          acc[key].push(c);
          return acc;
        }, {});

        return (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-[#d9b76e]" />
              <span className="text-sm font-medium text-[#d9b76e]">Contributions from friends</span>
            </div>
            <div className="flex flex-col gap-3">
              {Object.entries(byAuthor).map(([, items]) => (
                <Card key={items[0].id} className="border-[#d9b76e]/20 bg-[#22233a]">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-[#d9b76e] bg-[#d9b76e]/10 border border-[#d9b76e]/20 rounded-full px-2.5 py-0.5">
                        From a friend
                      </span>
                    </div>
                    {items.filter((c) => c.type === "TEXT").map((c) => (
                      <p key={c.id} className="text-sm leading-relaxed whitespace-pre-wrap mb-3 last:mb-0">
                        {c.body}
                      </p>
                    ))}
                    {items.some((c) => c.type === "IMAGE" || c.type === "VIDEO") && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {items
                          .filter((c) => c.type === "IMAGE" || c.type === "VIDEO")
                          .map((c) => (
                            <div
                              key={c.id}
                              className="relative rounded-lg overflow-hidden border border-white/10 bg-[#1c1d2c]"
                            >
                              {c.type === "IMAGE" && c.mediaUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={c.mediaUrl} alt="" className="w-full aspect-square object-cover" />
                              )}
                              {c.type === "VIDEO" && c.mediaUrl && (
                                <video src={c.mediaUrl} controls className="w-full aspect-video" />
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })()}

      <Separator className="bg-white/10 my-6" />

      <div className="flex flex-col gap-4 text-sm">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Opened</span>
          <span>
            {unlocksAt.toLocaleDateString("en", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        {capsule.recipients.length > 0 && (
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex flex-wrap gap-2">
              {capsule.recipients.map((r) => (
                <span
                  key={r.id}
                  className="rounded-full border border-white/10 bg-[#22233a] px-3 py-0.5 text-xs"
                >
                  {r.email}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-2">Share this capsule</p>
          <ShareButtons
            url={`${process.env.NEXT_PUBLIC_APP_URL}/capsules/${capsule.id}`}
            title={capsule.title}
            isLocked={false}
          />
        </div>
      </div>
    </div>
  );
}
