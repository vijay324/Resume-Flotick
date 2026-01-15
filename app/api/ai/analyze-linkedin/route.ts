import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAIService } from "@/lib/server/ai-service";
import { checkRateLimit } from "@/lib/server/rate-limiter";
import { getDecryptedApiKey } from "@/lib/server/api-key-store";

const AnalyzeLinkedInSchema = z.object({
  profileText: z.string().min(10, "Profile text is required (minimum 10 characters)"),
  profileUrl: z.string().url().optional(),
  deviceId: z.string().min(5, "Device ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = AnalyzeLinkedInSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { profileText, deviceId } = validation.data;

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
    const result = await aiService.analyzeLinkedInProfile(profileText);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error analyzing LinkedIn profile:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to analyze LinkedIn profile" },
      { status: 500 }
    );
  }
}
