import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { sendUnlockEmail } from "@/lib/email";

// Called by EventBridge Scheduler at unlock time
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify shared secret so only EventBridge can trigger this
  const secret = req.headers.get("x-unlock-secret");
  if (secret !== process.env.UNLOCK_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const prisma = await getPrisma();

  const capsule = await prisma.capsule.findFirst({
    where: { id },
    include: {
      recipients: true,
    },
  });

  if (!capsule) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (capsule.status === "UNLOCKED") {
    return NextResponse.json({ message: "Already unlocked" });
  }

  // Fetch author name
  const author = await prisma.user.findUnique({ where: { id: capsule.authorId } });

  // Mark unlocked
  await prisma.capsule.update({
    where: { id },
    data: { status: "UNLOCKED", unlockedAt: new Date() },
  });

  // Collect recipient emails — include author so they also get notified
  const recipientEmails = capsule.recipients.map((r) => r.email);
  if (author?.email && !recipientEmails.includes(author.email)) {
    recipientEmails.push(author.email);
  }

  if (recipientEmails.length > 0) {
    await sendUnlockEmail({
      to: recipientEmails,
      capsuleTitle: capsule.title,
      capsuleId: id,
      authorName: author?.name ?? "Someone",
    });
  }

  return NextResponse.json({ message: "Unlocked and notified", recipients: recipientEmails.length });
}
