import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/db/users";
import { getPrisma } from "@/lib/prisma";
import { isValidLanguage } from "@/lib/i18n";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { language } = await req.json();
  if (!isValidLanguage(language)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const prisma = await getPrisma();
  await prisma.user.update({
    where: { id: user.id },
    data: { language },
  });

  return NextResponse.json({ ok: true });
}
