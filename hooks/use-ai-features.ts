"use client";

import { useState } from "react";
import { useAI } from "@/context/ai-context";
import { getApiKeyClient } from "@/lib/client/client-api-key-store";
import type {
  SummarizeResponse,
  RewriteResponse,
  ResumeAnalysis,
  LinkedInAnalysis,
} from "@/types/ai";
import type { ResumeData } from "@/types/resume";

/**
 * Helper to get the API key for requests
 */
async function getApiKey(): Promise<string | null> {
  const keyData = await getApiKeyClient();
  return keyData?.key || null;
}

/**
 * Custom hook for AI content summarization
 */
export function useSummarize() {
  const { deviceId, aiEnabled } = useAI();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = async (
    text: string,
    context?: string
  ): Promise<SummarizeResponse | null> => {
    if (!aiEnabled) {
      setError("AI features are not enabled. Please add your API key.");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        throw new Error("No API key found. Please add your Gemini API key first.");
      }

      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context, deviceId, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize content");
      }

      return data.data;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { summarize, isLoading, error };
}

/**
 * Custom hook for AI content rewriting
 */
export function useRewrite() {
  const { deviceId, aiEnabled } = useAI();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rewrite = async (
    text: string,
    tone: "professional" | "concise" | "detailed"
  ): Promise<RewriteResponse | null> => {
    if (!aiEnabled) {
      setError("AI features are not enabled. Please add your API key.");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        throw new Error("No API key found. Please add your Gemini API key first.");
      }

      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone, deviceId, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to rewrite content");
      }

      return data.data;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { rewrite, isLoading, error };
}

/**
 * Custom hook for AI resume analysis
 */
export function useResumeAnalysis() {
  const { deviceId, aiEnabled } = useAI();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeResume = async (
    resumeData: ResumeData
  ): Promise<ResumeAnalysis | null> => {
    if (!aiEnabled) {
      setError("AI features are not enabled. Please add your API key.");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        throw new Error("No API key found. Please add your Gemini API key first.");
      }

      const response = await fetch("/api/ai/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, deviceId, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      return data.data;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeResume, isLoading, error };
}

/**
 * Custom hook for LinkedIn profile analysis
 */
export function useLinkedInAnalysis() {
  const { deviceId, aiEnabled } = useAI();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeLinkedIn = async (
    profileText: string,
    profileUrl?: string
  ): Promise<LinkedInAnalysis | null> => {
    if (!aiEnabled) {
      setError("AI features are not enabled. Please add your API key.");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        throw new Error("No API key found. Please add your Gemini API key first.");
      }

      const response = await fetch("/api/ai/analyze-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileText, profileUrl, deviceId, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze LinkedIn profile");
      }

      return data.data;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeLinkedIn, isLoading, error };
}
