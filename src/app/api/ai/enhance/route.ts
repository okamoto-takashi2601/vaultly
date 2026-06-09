import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  const { prompt, currentBody } = await req.json();
  if (!prompt) return NextResponse.json({ error: "No prompt" }, { status: 400 });

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const input = `You are helping someone write a heartfelt time capsule message sealed for months or years.

Reflection prompt: "${prompt}"
${currentBody ? `Their current draft:\n"${currentBody}"` : "No draft yet."}

Write a personal, emotional response (2-3 paragraphs) in first person. Be specific and vivid, not generic. Capture this moment in time. Don't include the question itself.`;

  const result = await model.generateContent(input);
  const text = result.response.text();

  return NextResponse.json({ text });
}
