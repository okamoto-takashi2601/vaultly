import { getPrisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const prisma = await getPrisma();

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

  const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null;

  // Aurora DSQL doesn't support Prisma's upsert transaction pattern — use find + create/update
  const existing = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });

  if (!existing) {
    return prisma.user.create({
      data: { clerkId: clerkUser.id, email, name, imageUrl: clerkUser.imageUrl },
    });
  }

  // Skip update if nothing changed to avoid Aurora DSQL OCC write conflicts
  if (existing.email === email && existing.name === name && existing.imageUrl === clerkUser.imageUrl) {
    return existing;
  }

  try {
    return await prisma.user.update({
      where: { id: existing.id },
      data: { email, name, imageUrl: clerkUser.imageUrl },
    });
  } catch {
    // Write conflict from concurrent requests (dev double-render) — return existing data
    return existing;
  }
}
