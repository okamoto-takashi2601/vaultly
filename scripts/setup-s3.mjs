import {
  S3Client,
  CreateBucketCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import { readFileSync, writeFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=\s]+)="?([^"]*)"?$/);
  if (match) env[match[1]] = match[2];
}

const REGION = env.AWS_REGION || "us-east-1";
const BUCKET_NAME = "laterloom-media-2026";
const credentials = {
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
};

const s3 = new S3Client({ region: REGION, credentials });

async function run() {
  console.log("=== Laterloom S3 Setup ===\n");

  // Check if bucket exists
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`✓ Bucket already exists: ${BUCKET_NAME}`);
  } catch {
    console.log(`Creating bucket: ${BUCKET_NAME}...`);
    await s3.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`✓ Bucket created`);
  }

  // Disable Block Public Access so we can set a public read policy
  await s3.send(new PutPublicAccessBlockCommand({
    Bucket: BUCKET_NAME,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: false,
      IgnorePublicAcls: false,
      BlockPublicPolicy: false,
      RestrictPublicBuckets: false,
    },
  }));
  console.log("✓ Block Public Access disabled");

  // CORS
  await s3.send(
    new PutBucketCorsCommand({
      Bucket: BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["*"],
            AllowedMethods: ["PUT", "GET"],
            AllowedOrigins: [
              "https://laterloom.vercel.app",
              "http://localhost:3000",
            ],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    }),
  );
  console.log("✓ CORS configured");

  // Public read bucket policy
  await s3.send(
    new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: "s3:GetObject",
            Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
          },
        ],
      }),
    }),
  );
  console.log("✓ Public read policy set");

  // Update .env.local
  let envText = readFileSync(".env.local", "utf-8");
  envText = envText.replace(
    /AWS_S3_BUCKET_NAME=""/,
    `AWS_S3_BUCKET_NAME="${BUCKET_NAME}"`,
  );
  writeFileSync(".env.local", envText);

  console.log(`\n✅ Done! Bucket: ${BUCKET_NAME}`);
  console.log(
    `   Media URL prefix: https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/`,
  );
}

run().catch((e) => {
  console.error("Failed:", e.message);
  process.exit(1);
});
