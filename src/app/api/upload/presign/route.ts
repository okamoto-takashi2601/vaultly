import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!bucket) return NextResponse.json({ error: "S3 not configured" }, { status: 503 });

  const { filename, contentType } = await req.json();
  const ext = filename.split(".").pop() ?? "bin";
  const key = `uploads/${userId}/${Date.now()}.${ext}`;

  const s3 = new S3Client({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: 300 },
  );

  const region = process.env.AWS_REGION ?? "us-east-1";
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
