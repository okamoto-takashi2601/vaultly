import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { DsqlSigner } from "@aws-sdk/dsql-signer";

// IAM tokens expire every 15 min — refresh client after 14 min
const TOKEN_TTL_MS = 14 * 60 * 1000;

const cache = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaCreatedAt: number | undefined;
};

async function createPrismaClient(): Promise<PrismaClient> {
  const signer = new DsqlSigner({
    hostname: process.env.DSQL_ENDPOINT!,
    region: process.env.AWS_REGION ?? "us-east-1",
  });
  const token = await signer.getDbConnectAdminAuthToken();
  const connectionString = `postgresql://admin:${encodeURIComponent(token)}@${process.env.DSQL_ENDPOINT}:5432/postgres?sslmode=verify-full`;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export async function getPrisma(): Promise<PrismaClient> {
  const now = Date.now();
  const expired = !cache.prismaCreatedAt || now - cache.prismaCreatedAt > TOKEN_TTL_MS;
  if (!cache.prisma || expired) {
    cache.prisma = await createPrismaClient();
    cache.prismaCreatedAt = now;
  }
  return cache.prisma;
}
