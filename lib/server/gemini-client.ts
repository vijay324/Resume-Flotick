import { GoogleGenerativeAI,  GenerativeModel } from "@google/generative-ai";

/**
 * Server-side Gemini API client wrapper
 * Provides centralized error handling, retry logic, and logging
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
  private client: GoogleGenerativeAI;
  private model: GenerativeModel;
  private maxRetries: number;
  private timeout: number;

  constructor(config: GeminiConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.model = this.client.getGenerativeModel({
      model: config.model || "gemini-pro",
    });
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
        const result = await Promise.race([
          this.model.generateContent(prompt),
          this.createTimeout(),
        ]);

        if (!result || typeof result === "string") {
          throw new Error("Request timed out");
        }

        const response = await result.response;
        const text = response.text();

        // Estimate tokens (rough approximation: ~4 chars per token)
        const tokensUsed = Math.ceil((prompt.length + text.length) / 4);

        return {
          text,
          tokensUsed,
        };
      } catch (error) {
        lastError = error as Error;

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
      console.error("API key test failed:", error);
      return false;
    }
  }

  /**
   * Check if error is an authentication error
   */
  private isAuthError(error: any): boolean {
    const message = error?.message?.toLowerCase() || "";
    return (
      message.includes("api key") ||
      message.includes("authentication") ||
      message.includes("unauthorized") ||
      message.includes("403") ||
      message.includes("401")
    );
  }

  /**
   * Check if error is a quota error
   */
  private isQuotaError(error: any): boolean {
    const message = error?.message?.toLowerCase() || "";
    return (
      message.includes("quota") ||
      message.includes("rate limit") ||
      message.includes("429")
    );
  }

  /**
   * Create a timeout promise
   */
  private createTimeout(): Promise<string> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), this.timeout);
    });
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
