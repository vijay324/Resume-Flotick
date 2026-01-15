import { ResumeData } from "@/types/resume";

export interface ATSResult {
  score: number;
  suggestions: Suggestion[];
}

export interface Suggestion {
  id: string;
  type: "success" | "warning" | "error";
  message: string;
}

export function analyzeResume(data: ResumeData): ATSResult {
  let score = 0;
  const suggestions: Suggestion[] = [];
  const maxScore = 100;

  // 1. Personal Info Checks (20 points)
  if (data.personalInfo.fullName) score += 5;
  else suggestions.push({ id: "name-missing", type: "error", message: "Full Name is missing." });

  if (data.personalInfo.email) score += 5;
  else suggestions.push({ id: "email-missing", type: "error", message: "Email is missing." });

  if (data.personalInfo.phone) score += 5;
  else suggestions.push({ id: "phone-missing", type: "error", message: "Phone number is missing." });

  if (data.personalInfo.linkedin) score += 5;
  else suggestions.push({ id: "linkedin-missing", type: "warning", message: "LinkedIn profile recommended." });

  // 2. Summary Check (10 points)
  if (data.personalInfo.summary && data.personalInfo.summary.length > 50) {
    score += 10;
  } else if (data.personalInfo.summary) {
    score += 5;
    suggestions.push({ id: "summary-short", type: "warning", message: "Professional Summary is too short. Aim for 2-3 sentences." });
  } else {
    suggestions.push({ id: "summary-missing", type: "warning", message: "Professional Summary is missing." });
  }

  // 3. Experience Check (30 points)
  if (data.experience.length > 0) {
    score += 10;
    // Check descriptions
    let hasGoodDescriptions = true;
    data.experience.forEach(exp => {
      if (!exp.description || exp.description.length < 50) hasGoodDescriptions = false;
    });

    if (hasGoodDescriptions) {
      score += 20;
    } else {
      score += 10;
      suggestions.push({ id: "exp-desc-short", type: "warning", message: "Some experience descriptions are too short. Use bullet points to describe achievements." });
    }
  } else {
    suggestions.push({ id: "exp-missing", type: "error", message: "Work Experience section is missing." });
  }

  // 4. Skills Check (20 points)
  if (data.skills.length >= 5) {
    score += 20;
  } else if (data.skills.length > 0) {
    score += 10;
    suggestions.push({ id: "skills-few", type: "warning", message: "Add more skills (aim for at least 5)." });
  } else {
    suggestions.push({ id: "skills-missing", type: "error", message: "Skills section is missing." });
  }

  // 5. Education Check (10 points)
  if (data.education.length > 0) {
    score += 10;
  } else {
    suggestions.push({ id: "edu-missing", type: "warning", message: "Education section is missing." });
  }

  // 6. Projects Check (10 points)
  if (data.projects.length > 0) {
     score += 10;
  } else {
     suggestions.push({ id: "proj-missing", type: "warning", message: "Adding projects can boost your ATS score." });
  }

  return { score, suggestions };
}
