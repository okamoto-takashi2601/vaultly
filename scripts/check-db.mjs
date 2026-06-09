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

const { rows } = await client.query(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name
`);

console.log("Tables in DB:", rows.map(r => r.table_name));
await client.end();
