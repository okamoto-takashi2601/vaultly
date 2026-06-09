import { DsqlSigner } from "@aws-sdk/dsql-signer";
import pkg from "pg";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const { Client } = pkg;
const endpoint = process.env.DSQL_ENDPOINT;
const region = process.env.AWS_REGION ?? "us-east-1";

// Generate IAM token
const signer = new DsqlSigner({ hostname: endpoint, region });
const token = await signer.getDbConnectAdminAuthToken();
console.log("✓ IAM token generated");

const client = new Client({
  host: endpoint,
  port: 5432,
  database: "postgres",
  user: "admin",
  password: token,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
console.log("✓ Connected to Aurora DSQL");

// Create migrations tracking table
await client.query(`
  CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    id TEXT PRIMARY KEY,
    checksum TEXT NOT NULL,
    finished_at TIMESTAMPTZ,
    migration_name TEXT NOT NULL,
    logs TEXT,
    rolled_back_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    applied_steps_count INT NOT NULL DEFAULT 0
  )
`);

// Get applied migrations
const { rows: applied } = await client.query(
  `SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL`
);
const appliedNames = new Set(applied.map((r) => r.migration_name));

// Find migration folders
const migrationsDir = join(process.cwd(), "prisma", "migrations");
const folders = readdirSync(migrationsDir)
  .filter((f) => !f.includes("."))
  .sort();

for (const folder of folders) {
  if (appliedNames.has(folder)) {
    console.log(`⏭  Skipping ${folder} (already applied)`);
    continue;
  }

  const sqlPath = join(migrationsDir, folder, "migration.sql");
  const sql = readFileSync(sqlPath, "utf-8");

  console.log(`▶  Applying ${folder}...`);
  // Aurora DSQL: each DDL must run in its own autocommit transaction
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    console.log(`   → ${stmt.slice(0, 60).replace(/\n/g, " ")}...`);
    await client.query(stmt);
  }

  await client.query(
    `INSERT INTO "_prisma_migrations" (id, checksum, migration_name, finished_at, applied_steps_count)
     VALUES (gen_random_uuid()::text, '', $1, now(), 1)`,
    [folder]
  );
  console.log(`✓  Applied ${folder}`);
}

await client.end();
console.log("✓ Migration complete");
