import { GoogleGenAI } from "@google/genai";

/**
 * Server-side Gemini API client wrapper
 * Uses the new @google/genai SDK for Gemini 2.0+ models
 */

export interface GeminiConfig {
  apiKey: string;
  model?: string;
  maxRetries?: number;
  timeout?: number;
}

export interface GeminiResponse {
  text: string;
  tokensUsed?: number;
}

export class GeminiClient {
  private client: GoogleGenAI;
  private modelName: string;
  private maxRetries: number;
  private timeout: number;

  constructor(config: GeminiConfig) {
    this.client = new GoogleGenAI({ apiKey: config.apiKey });
    this.modelName = config.model || "gemini-2.5-flash";
    this.maxRetries = config.maxRetries || 3;
    this.timeout = config.timeout || 30000; // 30 seconds
  }

  /**
   * Generate content from a prompt with retry logic
   */
  async generateContent(prompt: string): Promise<GeminiResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        console.log(`[GeminiClient] Attempt ${attempt + 1} with model: ${this.modelName}`);
        
        const response = await this.client.models.generateContent({
          model: this.modelName,
          contents: prompt,
        });

        const text = response.text || "";
        
        // Estimate tokens (rough approximation: ~4 chars per token)
        const tokensUsed = Math.ceil((prompt.length + text.length) / 4);

        console.log(`[GeminiClient] Success! Generated ${text.length} characters`);
        
        return {
          text,
          tokensUsed,
        };
      } catch (error) {
        lastError = error as Error;
        console.error(`[GeminiClient] Attempt ${attempt + 1} failed:`, lastError.message);

        // Don't retry on authentication errors
        if (this.isAuthError(error)) {
          throw new Error(
            "Invalid API key. Please check your Gemini API key and try again."
          );
        }

        // Don't retry on quota errors
        if (this.isQuotaError(error)) {
          throw new Error(
            "API quota exceeded. Please check your Gemini API usage limits."
          );
        }

        // Don't retry on model not found errors
        if (this.isModelNotFoundError(error)) {
          throw new Error(
            `Model "${this.modelName}" not available. Error: ${lastError.message}`
          );
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.maxRetries - 1) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw new Error(
      `Failed to generate content after ${this.maxRetries} attempts: ${lastError?.message}`
    );
  }

  /**
   * Test if the API key is valid with a minimal request
   */
  async testApiKey(): Promise<boolean> {
    try {
      const result = await this.generateContent("Say 'Hello'");
      return result.text.length > 0;
    } catch (error) {
      console.error("[GeminiClient] API key test failed:", error);
      return false;
    }
  }

  /**
   * Check if error is an authentication error
   */
  private isAuthError(error: unknown): boolean {
    const message = this.getErrorMessage(error);
    return (
      message.includes("api key") ||
      message.includes("api_key") ||
      message.includes("authentication") ||
      message.includes("unauthorized") ||
      message.includes("403") ||
      message.includes("401")
    );
  }

  /**
   * Check if error is a quota error
   */
  private isQuotaError(error: unknown): boolean {
    const message = this.getErrorMessage(error);
    return (
      message.includes("quota") ||
      message.includes("rate limit") ||
      message.includes("resource exhausted") ||
      message.includes("429")
    );
  }

  /**
   * Check if error is a model not found error
   */
  private isModelNotFoundError(error: unknown): boolean {
    const message = this.getErrorMessage(error);
    return (
      message.includes("not found") ||
      message.includes("404") ||
      message.includes("not supported") ||
      message.includes("invalid model")
    );
  }

  /**
   * Get error message string from any error type
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message.toLowerCase();
    }
    return String(error).toLowerCase();
  }

  /**
   * Delay helper for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Create a Gemini client instance
 */
export function createGeminiClient(apiKey: string): GeminiClient {
  return new GeminiClient({ apiKey });
}
