import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/db/users";
import { getCapsuleById } from "@/lib/db/capsules";
import { getPrisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const capsule = await getCapsuleById(id, user.id);
  if (!capsule) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(capsule);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const capsule = await getCapsuleById(id, user.id);
  if (!capsule) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const prisma = await getPrisma();
  const updated = await prisma.capsule.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.status === "SEALED" && { unlockedAt: null }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const capsule = await getCapsuleById(id, user.id);
  if (!capsule) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const prisma = await getPrisma();
  await prisma.capsule.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
