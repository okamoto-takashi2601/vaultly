import { DsqlSigner } from "@aws-sdk/dsql-signer";
import pkg from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });
const { Client } = pkg;

const signer = new DsqlSigner({
  hostname: process.env.DSQL_ENDPOINT,
  region: process.env.AWS_REGION ?? "us-east-1",
});
const token = await signer.getDbConnectAdminAuthToken();

const client = new Client({
  host: process.env.DSQL_ENDPOINT,
  port: 5432,
  database: "postgres",
  user: "admin",
  password: token,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

const { rows } = await client.query(
  `SELECT migration_name FROM "_prisma_migrations" ORDER BY started_at`
);
console.log("Current migrations:", rows.map((r) => r.migration_name));

await client.query(`DELETE FROM "_prisma_migrations"`);
console.log("✓ Cleared migration tracking table — re-run `npm run migrate`");

await client.end();
