import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getOrCreateUser } from "@/lib/db/users";
import { getPrisma } from "@/lib/prisma";
import { AI_LOCALE, isValidLanguage } from "@/lib/i18n";

const FREE_AI_LIMIT = 3;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const usageCount = user.aiUsageCount ?? 0;
  if (user.plan === "FREE" && usageCount >= FREE_AI_LIMIT) {
    return NextResponse.json(
      { error: "limit_reached", used: usageCount, limit: FREE_AI_LIMIT },
      { status: 403 }
    );
  }

  const { prompt, currentBody } = await req.json();
  if (!prompt) return NextResponse.json({ error: "No prompt" }, { status: 400 });

  const userLang = isValidLanguage(user.language) ? user.language : "en";
  const localeName = AI_LOCALE[userLang];

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { maxOutputTokens: 300 },
  });

  const input = `You are helping someone write a heartfelt time capsule message sealed for months or years.

Reflection prompt: "${prompt}"
${currentBody ? `Their current draft:\n"${currentBody}"` : "No draft yet."}

Write a personal, emotional response (1-2 short paragraphs, max 150 words) in first person. Be specific and vivid. Don't include the question itself.
IMPORTANT: Write the entire response in ${localeName}. Do not use any other language.`;

  try {
    const result = await model.generateContent(input);
    const text = result.response.text();

    // Increment usage counter
    const prisma = await getPrisma();
    await prisma.user.update({
      where: { id: user.id },
      data: { aiUsageCount: (usageCount + 1) },
    });

    return NextResponse.json({ text, used: usageCount + 1, limit: FREE_AI_LIMIT });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 429) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }
    throw err;
  }
}
