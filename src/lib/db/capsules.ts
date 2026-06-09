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

export async function createCapsule(data: {
  title: string;
  body: string;
  unlocksAt: Date;
  authorId: string;
  recipients: string[];
}) {
  const prisma = await getPrisma();
  return prisma.capsule.create({
    data: {
      title: data.title,
      status: "LOCKED",
      unlocksAt: data.unlocksAt,
      authorId: data.authorId,
      contents: {
        create: [{ type: "TEXT", body: data.body, order: 0 }],
      },
      recipients: {
        create: data.recipients.map((email) => ({ email })),
      },
    },
  });
}
