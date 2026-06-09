import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { sendUnlockEmail } from "@/lib/email";

// Called by Vercel Cron every hour. Unlocks any capsule whose unlocksAt has passed.
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = await getPrisma();
  const now = new Date();

  const capsules = await prisma.capsule.findMany({
    where: { status: { not: "UNLOCKED" }, unlocksAt: { lte: now } },
    include: { recipients: true },
  });

  let unlocked = 0;

  for (const capsule of capsules) {
    try {
      await prisma.capsule.update({
        where: { id: capsule.id },
        data: { status: "UNLOCKED", unlockedAt: now },
      });

      const author = await prisma.user.findUnique({ where: { id: capsule.authorId } });

      const recipientEmails = capsule.recipients.map((r) => r.email);
      if (author?.email && !recipientEmails.includes(author.email)) {
        recipientEmails.push(author.email);
      }

      if (recipientEmails.length > 0) {
        await sendUnlockEmail({
          to: recipientEmails,
          capsuleTitle: capsule.title,
          capsuleId: capsule.id,
          authorName: author?.name ?? "Someone",
        });
      }

      unlocked++;
    } catch (err) {
      console.error(`Failed to unlock capsule ${capsule.id}:`, err);
    }
  }

  return NextResponse.json({ unlocked, checked: capsules.length });
}
