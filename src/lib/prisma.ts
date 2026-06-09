import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { DsqlSigner } from "@aws-sdk/dsql-signer";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

async function generateDsqlToken(): Promise<string> {
  const signer = new DsqlSigner({
    hostname: process.env.DSQL_ENDPOINT!,
    region: process.env.AWS_REGION ?? "us-east-1",
  });
  return signer.getDbConnectAdminAuthToken();
}

async function createPrismaClient(): Promise<PrismaClient> {
  const token = await generateDsqlToken();
  const connectionString = `postgresql://admin:${encodeURIComponent(token)}@${process.env.DSQL_ENDPOINT}:5432/postgres?sslmode=require`;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// Singleton — recreated when token expires (handled at request level)
export async function getPrisma(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = await createPrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}
