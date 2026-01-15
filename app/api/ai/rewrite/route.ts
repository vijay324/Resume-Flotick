import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAIService } from "@/lib/server/ai-service";
import { checkRateLimit } from "@/lib/server/rate-limiter";
import { getDecryptedApiKey } from "@/lib/server/api-key-store";

const RewriteSchema = z.object({
  text: z.string().min(1, "Text is required"),
  tone: z.enum(["professional", "concise", "detailed"]),
  deviceId: z.string().min(5, "Device ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = RewriteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { text, tone, deviceId } = validation.data;

    // Check rate limit
    const rateLimitError = await checkRateLimit(deviceId);
    if (rateLimitError) {
      return NextResponse.json({ error: rateLimitError }, { status: 429 });
    }

    // Get API key
    const apiKey = getDecryptedApiKey(deviceId);
    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key found. Please add your Gemini API key first." },
        { status: 401 }
      );
    }

    // Use AI service
    const aiService = createAIService(apiKey);
    const result = await aiService.rewriteContent(text, tone);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error rewriting content:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to rewrite content" },
      { status: 500 }
    );
  }
}
