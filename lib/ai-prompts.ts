import type { ResumeData } from "@/types/resume";

/**
 * Centralized AI prompt templates for consistent and effective AI interactions
 */

export function buildResumeAnalysisPrompt(resumeData: ResumeData): string {
  return `You are an expert resume reviewer and career coach. Analyze the following resume and provide detailed, actionable feedback.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Please provide your analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "strengths": [<list of 3-5 key strengths>],
  "weaknesses": [<list of 3-5 areas needing improvement>],
  "skillGaps": [<list of in-demand skills the candidate should consider adding>],
  "suggestions": [
    {
      "section": "<section name>",
      "suggestion": "<specific actionable suggestion>",
      "priority": "<high|medium|low>"
    }
  ]
}

Focus on:
1. ATS (Applicant Tracking System) compatibility
2. Impact and achievements vs. responsibilities
3. Quantifiable results and metrics
4. Keyword optimization for the candidate's field
5. Overall clarity and conciseness
6. Professional formatting and structure

Be specific, constructive, and actionable in your feedback.`;
}

export function buildContentRewritePrompt(
  text: string,
  tone: "professional" | "concise" | "detailed"
): string {
  const toneInstructions = {
    professional:
      "Rewrite this to sound more professional and polished while maintaining the same core information. Use action verbs and industry-standard terminology.",
    concise:
      "Rewrite this to be more concise and impactful. Remove redundancy and focus on the most important points. Aim to reduce length by 30-40% while preserving key information.",
    detailed:
      "Expand this text with more detail and context. Add specific examples, metrics, and elaboration while maintaining clarity and readability.",
  };

  return `${toneInstructions[tone]}

ORIGINAL TEXT:
${text}

REQUIREMENTS:
- Maintain factual accuracy
- Keep the same general meaning
- Use active voice
- Ensure ATS-friendly language
- Return ONLY the rewritten text, no explanations or meta-commentary

REWRITTEN TEXT:`;
}

export function buildSummarizePrompt(text: string, context?: string): string {
  const contextNote = context ? `\n\nContext: ${context}` : "";

  return `Summarize the following text into a clear, concise summary. Focus on the most important information and key takeaways.${contextNote}

TEXT TO SUMMARIZE:
${text}

REQUIREMENTS:
- Be concise but comprehensive
- Capture key points and main ideas
- Use professional language
- Return ONLY the summary, no meta-commentary

SUMMARY:`;
}

export function buildLinkedInAnalysisPrompt(profileText: string): string {
  return `You are a LinkedIn optimization expert and recruiter. Analyze the following LinkedIn profile and provide detailed recommendations for improvement.

LINKEDIN PROFILE:
${profileText}

Please provide your analysis in the following JSON format:
{
  "profileScore": <number 0-100>,
  "headlineSuggestions": [<3-5 improved headline options>],
  "summarySuggestions": [<2-3 key improvements for the About/Summary section>],
  "keywordOptimization": {
    "missing": [<important keywords missing from the profile>],
    "recommended": [<strategic keywords to add based on industry/role>]
  },
  "recruiterReadiness": {
    "score": <number 0-100>,
    "improvementAreas": [<specific areas to improve for recruiter visibility>]
  },
  "actionableRecommendations": [
    {
      "category": "<Headline|Summary|Experience|Skills|etc>",
      "recommendation": "<specific action to take>",
      "impact": "<high|medium|low>"
    }
  ]
}

Focus on:
1. Headline optimization for search visibility
2. About section compelling storytelling
3. Keyword density for recruiter searches
4. Profile completeness and professional branding
5. Achievement highlighting and metrics
6. Industry-specific best practices

Be specific, data-driven, and actionable.`;
}

export function buildImproveSectionPrompt(
  sectionName: string,
  content: string,
  resumeContext?: Partial<ResumeData>
): string {
  const contextNote = resumeContext
    ? `\n\nCONTEXT (Full Resume):\n${JSON.stringify(resumeContext, null, 2)}`
    : "";

  return `You are an expert resume writer. Improve the following "${sectionName}" section of a resume. Make it more impactful, ATS-friendly, and compelling to hiring managers.

CURRENT CONTENT:
${content}${contextNote}

REQUIREMENTS:
- Use strong action verbs
- Quantify achievements where possible
- Focus on impact and results, not just responsibilities
- Ensure ATS keyword optimization
- Keep it concise yet comprehensive
- Maintain professional tone
- Return ONLY the improved content, no explanations

IMPROVED CONTENT:`;
}

export function buildGenerateFromJobTitlePrompt(
  jobTitle: string,
  company?: string
): string {
  const companyNote = company ? ` at ${company}` : "";

  return `Generate a professional, impactful job description for a "${jobTitle}" position${companyNote}. 

REQUIREMENTS:
- Write 3-5 bullet points
- Use strong action verbs (Led, Developed, Implemented, etc.)
- Focus on achievements and impact, not just responsibilities
- Include metrics and quantifiable results where typical
- Make it ATS-friendly with relevant keywords
- Keep each point concise (1-2 lines max)
- Return ONLY the bullet points, no other text

BULLET POINTS:`;
}
