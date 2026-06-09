import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getOrCreateUser } from "@/lib/db/users";
import { getCapsulesByUserId, createCapsule } from "@/lib/db/capsules";
import { scheduleUnlock } from "@/lib/scheduler";

const mediaItemSchema = z.object({
  url: z.string().url(),
  key: z.string(),
  type: z.enum(["IMAGE", "VIDEO"]),
});

const createSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().optional(),
  unlocksAt: z.string().datetime(),
  recipients: z.array(z.string().email()).default([]),
  media: z.array(mediaItemSchema).default([]),
  isShared: z.boolean().default(false),
}).refine((d) => d.body || d.media.length > 0, {
  message: "Capsule must have at least a message or one media file",
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const capsules = await getCapsulesByUserId(user.id);
  return NextResponse.json(capsules);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const unlocksAt = new Date(parsed.data.unlocksAt);

  const capsule = await createCapsule({
    title: parsed.data.title,
    body: parsed.data.body,
    unlocksAt,
    authorId: user.id,
    recipients: parsed.data.recipients,
    media: parsed.data.media,
    isShared: parsed.data.isShared,
  });

  // Schedule unlock job if EventBridge is configured
  if (process.env.AWS_SCHEDULER_ROLE_ARN && process.env.AWS_SCHEDULER_TARGET_ARN) {
    try {
      const jobId = await scheduleUnlock(capsule.id, unlocksAt);
      const prisma = await (await import("@/lib/prisma")).getPrisma();
      await prisma.capsule.update({ where: { id: capsule.id }, data: { schedulerJobId: jobId } });
    } catch (err) {
      console.error("Failed to schedule unlock job:", err);
    }
  }

  return NextResponse.json(capsule, { status: 201 });
}
