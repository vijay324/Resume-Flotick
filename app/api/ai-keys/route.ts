import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { encrypt, validateEncryptionSecret } from "@/lib/server/encryption";
import { createGeminiClient } from "@/lib/server/gemini-client";
import {
  storeApiKey,
  getApiKeyStatus,
  removeApiKey as removeStoredApiKey,
} from "@/lib/server/api-key-store";

// Validate request schema
const AddKeySchema = z.object({
  apiKey: z.string().min(10, "API key must be at least 10 characters"),
  deviceId: z.string().min(5, "Device ID is required"),
});

/**
 * POST /api/ai-keys - Add or update API key
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = AddKeySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { apiKey, deviceId } = validation.data;

    // Validate encryption secret
    try {
      validateEncryptionSecret(process.env.ENCRYPTION_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 500 }
      );
    }

    // Validate API key format (basic check)
    if (!apiKey.startsWith("AIza")) {
      return NextResponse.json(
        { 
          error: "Invalid API key format. Gemini API keys should start with 'AIza'"
        },
        { status: 400 }
      );
    }

    // Note: We skip the live API test here to avoid network/timeout issues
    // The key will be validated when actually used in AI features
    console.log("API key format validated for device:", deviceId);

    // Encrypt and store the API key
    const encrypted = encrypt(apiKey, process.env.ENCRYPTION_SECRET!);
    storeApiKey(deviceId, encrypted.encrypted, encrypted.iv, encrypted.salt, encrypted.tag);

    return NextResponse.json({
      success: true,
      message: "API key added successfully",
    });
  } catch (error) {
    console.error("Error adding API key:", error);
    return NextResponse.json(
      { error: "Failed to add API key" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai-keys - Check if API key exists for device
 */
export async function GET(request: NextRequest) {
  try {
    const deviceId = request.nextUrl.searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 });
    }

    const status = getApiKeyStatus(deviceId);
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error checking API key:", error);
    return NextResponse.json(
      { error: "Failed to check API key status" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ai-keys - Remove API key
 */
export async function DELETE(request: NextRequest) {
  try {
    const deviceId = request.nextUrl.searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 });
    }

    removeStoredApiKey(deviceId);

    return NextResponse.json({
      success: true,
      message: "API key removed successfully",
    });
  } catch (error) {
    console.error("Error removing API key:", error);
    return NextResponse.json(
      { error: "Failed to remove API key" },
      { status: 500 }
    );
  }
}
