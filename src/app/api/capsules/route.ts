import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getOrCreateUser } from "@/lib/db/users";
import { getCapsulesByUserId, createCapsule } from "@/lib/db/capsules";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  unlocksAt: z.string().datetime(),
  recipients: z.array(z.string().email()).default([]),
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

  const capsule = await createCapsule({
    title: parsed.data.title,
    body: parsed.data.body,
    unlocksAt: new Date(parsed.data.unlocksAt),
    authorId: user.id,
    recipients: parsed.data.recipients,
  });

  return NextResponse.json(capsule, { status: 201 });
}
