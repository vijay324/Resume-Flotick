import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAIService } from "@/lib/server/ai-service";
import { checkRateLimit } from "@/lib/server/rate-limiter";

const OptimizeJobSchema = z.object({
  resumeData: z.any(),
  jobDescription: z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    company: z.string().optional(),
    description: z.string().min(10, "Job description is too short"),
    requiredSkills: z.array(z.string()),
    responsibilities: z.string().optional(),
  }),
  deviceId: z.string().min(5, "Device ID is required"),
  apiKey: z.string().min(10, "API key is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = OptimizeJobSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { resumeData, jobDescription, deviceId, apiKey } = validation.data;

    // Check rate limit
    const rateLimitError = await checkRateLimit(deviceId);
    if (rateLimitError) {
      return NextResponse.json({ error: rateLimitError }, { status: 429 });
    }

    // Validate API key format
    if (!apiKey.startsWith("AIza")) {
      return NextResponse.json(
        { error: "Invalid API key format. Gemini API keys should start with 'AIza'" },
        { status: 401 }
      );
    }

    // Use AI service with provided API key
    const aiService = createAIService(apiKey);
    const result = await aiService.optimizeResumeForJob(resumeData, jobDescription);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error optimizing resume:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to optimize resume" },
      { status: 500 }
    );
  }
}
