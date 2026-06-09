import { getPrisma } from "@/lib/prisma";

export async function getCapsulesByUserId(userId: string) {
  const prisma = await getPrisma();
  return prisma.capsule.findMany({
    where: { authorId: userId },
    include: { recipients: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCapsuleById(id: string, userId: string) {
  const prisma = await getPrisma();
  return prisma.capsule.findFirst({
    where: { id, authorId: userId },
    include: { contents: { orderBy: { order: "asc" } }, recipients: true },
  });
}

type MediaItem = { url: string; key: string; type: "IMAGE" | "VIDEO" };

export async function createCapsule(data: {
  title: string;
  body?: string;
  unlocksAt: Date;
  authorId: string;
  recipients: string[];
  media?: MediaItem[];
}) {
  const prisma = await getPrisma();

  const textContent = data.body
    ? [{ type: "TEXT" as const, body: data.body, order: 0 }]
    : [];

  const mediaContent = (data.media ?? []).map((m, i) => ({
    type: m.type,
    mediaUrl: m.url,
    mediaKey: m.key,
    order: textContent.length + i,
  }));

  return prisma.capsule.create({
    data: {
      title: data.title,
      status: "LOCKED",
      unlocksAt: data.unlocksAt,
      authorId: data.authorId,
      contents: { create: [...textContent, ...mediaContent] },
      recipients: { create: data.recipients.map((email) => ({ email })) },
    },
  });
}
