import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getOrCreateUser } from "@/lib/db/users";
import { getCapsuleForContribute } from "@/lib/db/capsules";
import { getPrisma } from "@/lib/prisma";

const mediaItemSchema = z.object({
  url: z.string().url(),
  key: z.string(),
  type: z.enum(["IMAGE", "VIDEO"]),
});

const contributeSchema = z.object({
  body: z.string().optional(),
  media: z.array(mediaItemSchema).default([]),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const capsule = await getCapsuleForContribute(id);

  if (!capsule) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isOwner = capsule.authorId === user.id;

  const prisma = await getPrisma();
  const existingContribution = await prisma.capsuleContribution.findFirst({
    where: { capsuleId: id, userId: user.id },
  });

  return NextResponse.json({
    hasContributed: !!existingContribution,
    isOwner,
    capsule: {
      title: capsule.title,
      unlocksAt: capsule.unlocksAt,
      status: capsule.status,
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const capsule = await getCapsuleForContribute(id);

  if (!capsule) {
    return NextResponse.json({ error: "Capsule not found or not collaborative" }, { status: 404 });
  }

  if (capsule.status === "UNLOCKED") {
    return NextResponse.json({ error: "This capsule has already been unlocked" }, { status: 403 });
  }

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (capsule.authorId === user.id) {
    return NextResponse.json({ error: "Capsule owners cannot contribute to their own capsule" }, { status: 403 });
  }

  const rawBody = await req.json();
  const parsed = contributeSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { body, media } = parsed.data;

  if (!body && media.length === 0) {
    return NextResponse.json({ error: "Contribution must have a message or at least one media file" }, { status: 400 });
  }

  const prisma = await getPrisma();

  // Get current max order for this capsule's contents
  const lastContent = await prisma.capsuleContent.findFirst({
    where: { capsuleId: id },
    orderBy: { order: "desc" },
  });
  const baseOrder = (lastContent?.order ?? -1) + 1;

  const textContent = body
    ? [{ type: "TEXT" as const, body, order: baseOrder, capsuleId: id, authorId: user.id }]
    : [];

  const mediaContent = media.map((m, i) => ({
    type: m.type,
    mediaUrl: m.url,
    mediaKey: m.key,
    order: baseOrder + textContent.length + i,
    capsuleId: id,
    authorId: user.id,
  }));

  const allContent = [...textContent, ...mediaContent];

  // Create content records and track contribution (Aurora DSQL: no interactive transactions)
  await prisma.capsuleContent.createMany({ data: allContent });

  // Record the contribution (upsert pattern: find + create to avoid Aurora DSQL issues)
  const existingContribution = await prisma.capsuleContribution.findFirst({
    where: { capsuleId: id, userId: user.id },
  });
  if (!existingContribution) {
    try {
      await prisma.capsuleContribution.create({
        data: { capsuleId: id, userId: user.id },
      });
    } catch {
      // Concurrent request already created it — ignore
    }
  }

  return NextResponse.json({ ok: true });
}
