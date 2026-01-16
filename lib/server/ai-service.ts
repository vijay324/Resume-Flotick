import type { ResumeData } from "@/types/resume";
import type {
  ResumeAnalysis,
  LinkedInAnalysis,
  SummarizeResponse,
  RewriteResponse,
  JobDescriptionInput,
  OptimizedResumeResult,
  SectionOptimization,
  ContentLength,
} from "@/types/ai";
import { createGeminiClient, type GeminiClient } from "./gemini-client";
import {
  buildResumeAnalysisPrompt,
  buildContentRewritePrompt,
  buildSummarizePrompt,
  buildLinkedInAnalysisPrompt,
  buildImproveSectionPrompt,
  buildGenerateFromJobTitlePrompt,
  buildJobDescriptionOptimizationPrompt,
} from "@/lib/ai-prompts";
import { humanizeText } from "@/lib/text-humanizer";

/**
 * Central AI service layer
 * Provides high-level AI features using the Gemini client
 */

export class AIService {
  private client: GeminiClient;

  constructor(apiKey: string) {
    this.client = createGeminiClient(apiKey);
  }

  /**
   * Summarize content
   */
  async summarizeContent(
    text: string,
    context?: string
  ): Promise<SummarizeResponse> {
    const prompt = buildSummarizePrompt(text, context);
    const response = await this.client.generateContent(prompt);

    return {
      summary: humanizeText(response.text.trim()),
      tokensUsed: response.tokensUsed || 0,
    };
  }

  /**
   * Rewrite content with a specific tone
   */
  async rewriteContent(
    text: string,
    tone: string,
    length: ContentLength = "medium"
  ): Promise<RewriteResponse> {
    const prompt = buildContentRewritePrompt(text, tone, length);
    const response = await this.client.generateContent(prompt);

    return {
      rewritten: humanizeText(response.text.trim()),
      tokensUsed: response.tokensUsed || 0,
    };
  }

  /**
   * Analyze a resume and provide feedback
   */
  async analyzeResume(resumeData: ResumeData): Promise<ResumeAnalysis> {
    const prompt = buildResumeAnalysisPrompt(resumeData);
    const response = await this.client.generateContent(prompt);

    try {
      // Try to parse JSON response
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return analysis as ResumeAnalysis;
      }

      // Fallback: create a basic analysis from the text
      return this.parseTextAnalysis(response.text);
    } catch (error) {
      console.error("Error parsing resume analysis:", error);
      return this.parseTextAnalysis(response.text);
    }
  }

  /**
   * Analyze a LinkedIn profile
   */
  async analyzeLinkedInProfile(
    profileText: string
  ): Promise<LinkedInAnalysis> {
    const prompt = buildLinkedInAnalysisPrompt(profileText);
    const response = await this.client.generateContent(prompt);

    try {
      // Try to parse JSON response
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return analysis as LinkedInAnalysis;
      }

      // Fallback
      return this.parseTextLinkedInAnalysis(response.text);
    } catch (error) {
      console.error("Error parsing LinkedIn analysis:", error);
      return this.parseTextLinkedInAnalysis(response.text);
    }
  }

  /**
   * Improve a specific resume section
   */
  async improveSection(
    sectionName: string,
    content: string,
    resumeContext?: Partial<ResumeData>
  ): Promise<{ improved: string; tokensUsed: number }> {
    const prompt = buildImproveSectionPrompt(sectionName, content, resumeContext);
    const response = await this.client.generateContent(prompt);

    return {
      improved: humanizeText(response.text.trim()),
      tokensUsed: response.tokensUsed || 0,
    };
  }

  /**
   * Optimize resume for a specific job
   */
  async optimizeResumeForJob(
    resumeData: ResumeData,
    jobDescription: JobDescriptionInput
  ): Promise<OptimizedResumeResult> {
    const prompt = buildJobDescriptionOptimizationPrompt(
      resumeData,
      jobDescription
    );
    const response = await this.client.generateContent(prompt);

    try {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        // Add metadata to result
        return {
          jobTitle: jobDescription.jobTitle,
          company: jobDescription.company,
          ...result,
          sections: result.sections.map((s: SectionOptimization) => ({
            ...s,
            applied: false,
          })),
        };
      }
      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error parsing optimization response:", error);
      throw error;
    }
  }

  /**
   * Generate job description from job title
   */
  async generateFromJobTitle(
    jobTitle: string,
    company?: string
  ): Promise<{ description: string; tokensUsed: number }> {
    const prompt = buildGenerateFromJobTitlePrompt(jobTitle, company);
    const response = await this.client.generateContent(prompt);

    return {
      description: humanizeText(response.text.trim()),
      tokensUsed: response.tokensUsed || 0,
    };
  }

  /**
   * Test if the API key is valid
   */
  async testApiKey(): Promise<boolean> {
    return this.client.testApiKey();
  }

  /**
   * Parse text analysis when JSON parsing fails
   */
  private parseTextAnalysis(text: string): ResumeAnalysis {
    return {
      overallScore: 70,
      strengths: ["Analysis provided by AI"],
      weaknesses: ["Unable to parse detailed metrics"],
      skillGaps: [],
      suggestions: [
        {
          section: "general",
          suggestion: text.substring(0, 200),
          priority: "medium",
        },
      ],
    };
  }

  /**
   * Parse LinkedIn text analysis when JSON parsing fails
   */
  private parseTextLinkedInAnalysis(text: string): LinkedInAnalysis {
    return {
      profileScore: 70,
      headlineSuggestions: ["See detailed feedback below"],
      summarySuggestions: ["Review the analysis"],
      keywordOptimization: {
        missing: [],
        recommended: [],
      },
      recruiterReadiness: {
        score: 70,
        improvementAreas: [text.substring(0, 200)],
      },
      actionableRecommendations: [
        {
          category: "General",
          recommendation: text,
          impact: "medium",
        },
      ],
    };
  }
}

/**
 * Create an AI service instance
 */
export function createAIService(apiKey: string): AIService {
  return new AIService(apiKey);
}
