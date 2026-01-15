/**
 * TypeScript types for AI features
 */

export interface ResumeAnalysis {
  overallScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  skillGaps: string[];
  suggestions: {
    section: string;
    suggestion: string;
    priority: "high" | "medium" | "low";
  }[];
  aiImprovedSections?: {
    [section: string]: string; // AI-rewritten versions
  };
}

export interface LinkedInAnalysis {
  profileScore: number; // 0-100
  headlineSuggestions: string[];
  summarySuggestions: string[];
  keywordOptimization: {
    missing: string[];
    recommended: string[];
  };
  recruiterReadiness: {
    score: number;
    improvementAreas: string[];
  };
  actionableRecommendations: {
    category: string;
    recommendation: string;
    impact: "high" | "medium" | "low";
  }[];
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  tokensUsed?: number;
}

export interface SummarizeRequest {
  text: string;
  context?: string;
}

export interface SummarizeResponse {
  summary: string;
  tokensUsed: number;
}

export interface RewriteRequest {
  text: string;
  tone: "professional" | "concise" | "detailed";
}

export interface RewriteResponse {
  rewritten: string;
  tokensUsed: number;
}

export interface AnalyzeResumeRequest {
  resumeData: any; // ResumeData from types/resume
}

export interface AnalyzeLinkedInRequest {
  profileText: string;
  profileUrl?: string;
}

export type AIFeature =
  | "summarize"
  | "rewrite"
  | "analyze-resume"
  | "analyze-linkedin"
  | "improve-section";

export interface AIUsageStats {
  requestsToday: number;
  limit: number;
  remaining: number;
  resetAt: Date;
}
