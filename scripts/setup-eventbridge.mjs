/**
 * Setup script: Creates IAM roles + Lambda relay function for EventBridge Scheduler
 * Run: node scripts/setup-eventbridge.mjs
 */
import { IAMClient, CreateRoleCommand, AttachRolePolicyCommand, PutRolePolicyCommand, GetRoleCommand } from "@aws-sdk/client-iam";
import { LambdaClient, CreateFunctionCommand, GetFunctionCommand, AddPermissionCommand } from "@aws-sdk/client-lambda";
import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";

// Load env vars from .env.local
const envContent = readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=\s]+)="?([^"]*)"?$/);
  if (match) env[match[1]] = match[2];
}

const REGION = env.AWS_REGION || "us-east-1";
const ACCESS_KEY = env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = env.AWS_SECRET_ACCESS_KEY;

if (!ACCESS_KEY || !SECRET_KEY) {
  console.error("Missing AWS credentials in .env.local");
  process.exit(1);
}

const credentials = { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY };
const iam = new IAMClient({ region: REGION, credentials });
const lambda = new LambdaClient({ region: REGION, credentials });

const LAMBDA_ROLE_NAME = "laterloom-lambda-role";
const SCHEDULER_ROLE_NAME = "laterloom-scheduler-role";
const LAMBDA_FUNCTION_NAME = "laterloom-relay";

// Inline Lambda code: receives EventBridge event, calls HTTP endpoint
const LAMBDA_CODE = `
export const handler = async (event) => {
  const { url, method = 'POST', headers = {} } = event;
  console.log('Calling', method, url);
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
  const text = await response.text();
  console.log('Response', response.status, text);
  return { statusCode: response.status, body: text };
};
`.trim();

// Create a zip buffer containing index.mjs
async function makeZip(code) {
  // Use Node.js built-in zlib to create zip
  const { createRequire } = await import("module");
  const require = createRequire(import.meta.url);
  // We'll use archiver if available, otherwise use a pre-built approach
  // Since we can't easily zip in pure Node without extra deps, write file and use child_process
  const { execSync } = await import("child_process");
  const { writeFileSync, mkdirSync, existsSync } = await import("fs");
  const { join } = await import("path");

  const tmpDir = ".tmp-lambda";
  if (!existsSync(tmpDir)) mkdirSync(tmpDir);
  writeFileSync(join(tmpDir, "index.mjs"), code);

  try {
    // Try using zip command (available on Mac/Linux/Git Bash on Windows)
    execSync(`cd ${tmpDir} && zip -r ../lambda.zip index.mjs`, { stdio: "inherit" });
  } catch {
    // On Windows without zip, use PowerShell
    execSync(
      `powershell -Command "Compress-Archive -Path ${tmpDir}\\index.mjs -DestinationPath lambda.zip -Force"`,
      { stdio: "inherit" }
    );
  }

  const { readFileSync } = await import("fs");
  return readFileSync("lambda.zip");
}

async function getOrCreateRole(roleName, trustPolicy, description) {
  try {
    const res = await iam.send(new GetRoleCommand({ RoleName: roleName }));
    console.log(`✓ Role already exists: ${roleName}`);
    return res.Role.Arn;
  } catch (e) {
    if (e.name !== "NoSuchEntityException") throw e;
  }

  console.log(`Creating role: ${roleName}...`);
  const res = await iam.send(
    new CreateRoleCommand({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(trustPolicy),
      Description: description,
    })
  );
  return res.Role.Arn;
}

async function run() {
  console.log("=== Laterloom EventBridge Setup ===\n");

  // 1. Lambda execution role
  const lambdaRoleArn = await getOrCreateRole(
    LAMBDA_ROLE_NAME,
    {
      Version: "2012-10-17",
      Statement: [{ Effect: "Allow", Principal: { Service: "lambda.amazonaws.com" }, Action: "sts:AssumeRole" }],
    },
    "Laterloom Lambda execution role"
  );

  // Attach basic execution policy
  try {
    await iam.send(
      new AttachRolePolicyCommand({
        RoleName: LAMBDA_ROLE_NAME,
        PolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
      })
    );
    console.log("✓ Attached AWSLambdaBasicExecutionRole");
  } catch (e) {
    if (!e.message?.includes("already attached")) throw e;
    console.log("✓ AWSLambdaBasicExecutionRole already attached");
  }

  // Wait for role to propagate
  console.log("Waiting 10s for IAM role propagation...");
  await new Promise((r) => setTimeout(r, 10000));

  // 2. Create Lambda function
  let lambdaArn;
  try {
    const existing = await lambda.send(new GetFunctionCommand({ FunctionName: LAMBDA_FUNCTION_NAME }));
    lambdaArn = existing.Configuration.FunctionArn;
    console.log(`✓ Lambda already exists: ${lambdaArn}`);
  } catch (e) {
    if (e.name !== "ResourceNotFoundException") throw e;

    console.log("Creating Lambda function...");
    const zipBuffer = await makeZip(LAMBDA_CODE);

    const res = await lambda.send(
      new CreateFunctionCommand({
        FunctionName: LAMBDA_FUNCTION_NAME,
        Runtime: "nodejs22.x",
        Role: lambdaRoleArn,
        Handler: "index.handler",
        Code: { ZipFile: zipBuffer },
        Timeout: 30,
        Description: "Laterloom: relays EventBridge unlock events to the Next.js API",
      })
    );
    lambdaArn = res.FunctionArn;
    console.log(`✓ Lambda created: ${lambdaArn}`);
  }

  // 3. EventBridge Scheduler role
  const schedulerRoleArn = await getOrCreateRole(
    SCHEDULER_ROLE_NAME,
    {
      Version: "2012-10-17",
      Statement: [{ Effect: "Allow", Principal: { Service: "scheduler.amazonaws.com" }, Action: "sts:AssumeRole" }],
    },
    "Laterloom EventBridge Scheduler role"
  );

  // Allow scheduler to invoke the Lambda
  await iam.send(
    new PutRolePolicyCommand({
      RoleName: SCHEDULER_ROLE_NAME,
      PolicyName: "invoke-laterloom-relay",
      PolicyDocument: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{ Effect: "Allow", Action: "lambda:InvokeFunction", Resource: lambdaArn }],
      }),
    })
  );
  console.log("✓ Scheduler role can invoke Lambda");

  // 4. Update .env.local
  console.log("\n=== Updating .env.local ===");
  let envText = readFileSync(".env.local", "utf-8");
  envText = envText.replace(
    /AWS_SCHEDULER_ROLE_ARN="[^"]*"/,
    `AWS_SCHEDULER_ROLE_ARN="${schedulerRoleArn}"`
  );
  envText = envText.replace(
    /AWS_SCHEDULER_TARGET_ARN="[^"]*"/,
    `AWS_SCHEDULER_TARGET_ARN="${lambdaArn}"`
  );
  writeFileSync(".env.local", envText);

  console.log(`\n✅ Done!`);
  console.log(`   AWS_SCHEDULER_ROLE_ARN = ${schedulerRoleArn}`);
  console.log(`   AWS_SCHEDULER_TARGET_ARN = ${lambdaArn}`);
  console.log(`\nRestart the dev server to apply changes.`);
}

run().catch((e) => {
  console.error("Setup failed:", e.message ?? e);
  process.exit(1);
});
