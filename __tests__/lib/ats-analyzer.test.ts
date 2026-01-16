/**
 * @fileoverview Unit tests for lib/ats-analyzer.ts
 * Tests ATS (Applicant Tracking System) resume scoring algorithm
 */

import { analyzeResume, ATSResult, Suggestion } from "@/lib/ats-analyzer";
import type { ResumeData } from "@/types/resume";

// Factory function for creating test resume data
const createEmptyResume = (): ResumeData => ({
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    website: "",
    location: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
  certifications: [],
  awards: [],
  volunteer: [],
});

const createCompleteResume = (): ResumeData => ({
  personalInfo: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 555-123-4567",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    website: "johndoe.dev",
    location: "San Francisco, CA",
    summary:
      "Experienced software engineer with 8+ years of experience building scalable web applications. Passionate about clean code and mentoring developers.",
  },
  experience: [
    {
      id: "exp-1",
      company: "Tech Corp",
      position: "Senior Engineer",
      startDate: "2020-01",
      endDate: "Present",
      current: true,
      location: "San Francisco, CA",
      description:
        "• Led development of microservices architecture serving 1M+ users\n• Mentored 5 junior developers through code reviews and pair programming\n• Implemented CI/CD pipelines reducing deployment time by 60%",
    },
    {
      id: "exp-2",
      company: "Startup Inc",
      position: "Software Engineer",
      startDate: "2017-06",
      endDate: "2019-12",
      current: false,
      location: "Austin, TX",
      description:
        "• Built RESTful APIs handling 100K+ daily requests\n• Developed frontend features using React and TypeScript\n• Participated in agile ceremonies and sprint planning",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "MIT",
      degree: "Master of Science",
      field: "Computer Science",
      startDate: "2015-09",
      endDate: "2017-05",
      current: false,
      score: "3.9 GPA",
    },
  ],
  skills: [
    { id: "skill-1", name: "JavaScript", level: "Expert" },
    { id: "skill-2", name: "TypeScript", level: "Expert" },
    { id: "skill-3", name: "React", level: "Expert" },
    { id: "skill-4", name: "Node.js", level: "Advanced" },
    { id: "skill-5", name: "Python", level: "Advanced" },
    { id: "skill-6", name: "AWS", level: "Intermediate" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Open Source CLI Tool",
      description:
        "Built a popular CLI tool with 5K+ GitHub stars for automating development workflows.",
      technologies: ["Node.js", "TypeScript"],
      link: "github.com/johndoe/cli-tool",
    },
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "Native" },
    { id: "lang-2", name: "Spanish", proficiency: "Professional" },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Solutions Architect",
      issuer: "Amazon",
      date: "2023-01",
    },
  ],
  awards: [
    {
      id: "award-1",
      title: "Employee of the Year",
      issuer: "Tech Corp",
      date: "2022-12",
      description: "Recognized for exceptional performance",
    },
  ],
  volunteer: [
    {
      id: "vol-1",
      organization: "Code.org",
      role: "Mentor",
      startDate: "2021-01",
      endDate: "Present",
      current: true,
      location: "Remote",
      description: "Teaching coding to underrepresented students",
    },
  ],
});

describe("analyzeResume", () => {
  describe("complete resume", () => {
    it("should return high score for complete resume", () => {
      const resume = createCompleteResume();
      const result = analyzeResume(resume);

      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it("should return no error suggestions for complete resume", () => {
      const resume = createCompleteResume();
      const result = analyzeResume(resume);

      const errorSuggestions = result.suggestions.filter(
        (s) => s.type === "error"
      );
      expect(errorSuggestions).toHaveLength(0);
    });

    it("should return ATSResult with score and suggestions", () => {
      const resume = createCompleteResume();
      const result = analyzeResume(resume);

      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("suggestions");
      expect(typeof result.score).toBe("number");
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });

  describe("empty resume", () => {
    it("should return score of 0 for empty resume", () => {
      const resume = createEmptyResume();
      const result = analyzeResume(resume);

      expect(result.score).toBe(0);
    });

    it("should return error suggestions for missing required fields", () => {
      const resume = createEmptyResume();
      const result = analyzeResume(resume);

      expect(result.suggestions.length).toBeGreaterThan(0);

      const errorIds = result.suggestions
        .filter((s) => s.type === "error")
        .map((s) => s.id);

      expect(errorIds).toContain("name-missing");
      expect(errorIds).toContain("email-missing");
      expect(errorIds).toContain("phone-missing");
      expect(errorIds).toContain("exp-missing");
      expect(errorIds).toContain("skills-missing");
    });

    it("should return warning suggestions for missing optional fields", () => {
      const resume = createEmptyResume();
      const result = analyzeResume(resume);

      const warningIds = result.suggestions
        .filter((s) => s.type === "warning")
        .map((s) => s.id);

      expect(warningIds).toContain("linkedin-missing");
      expect(warningIds).toContain("summary-missing");
      expect(warningIds).toContain("edu-missing");
      expect(warningIds).toContain("proj-missing");
    });
  });

  describe("personal info scoring", () => {
    it("should add 5 points for fullName", () => {
      const resume = createEmptyResume();
      resume.personalInfo.fullName = "John Doe";

      const result = analyzeResume(resume);
      expect(result.score).toBe(5);
    });

    it("should add 5 points for email", () => {
      const resume = createEmptyResume();
      resume.personalInfo.email = "john@example.com";

      const result = analyzeResume(resume);
      expect(result.score).toBe(5);
    });

    it("should add 5 points for phone", () => {
      const resume = createEmptyResume();
      resume.personalInfo.phone = "+1 555-123-4567";

      const result = analyzeResume(resume);
      expect(result.score).toBe(5);
    });

    it("should add 5 points for linkedin", () => {
      const resume = createEmptyResume();
      resume.personalInfo.linkedin = "linkedin.com/in/johndoe";

      const result = analyzeResume(resume);
      expect(result.score).toBe(5);
    });

    it("should add 20 points for complete personal info", () => {
      const resume = createEmptyResume();
      resume.personalInfo.fullName = "John Doe";
      resume.personalInfo.email = "john@example.com";
      resume.personalInfo.phone = "+1 555-123-4567";
      resume.personalInfo.linkedin = "linkedin.com/in/johndoe";

      const result = analyzeResume(resume);
      expect(result.score).toBe(20);
    });
  });

  describe("summary scoring", () => {
    it("should add 10 points for summary > 50 characters", () => {
      const resume = createEmptyResume();
      resume.personalInfo.summary =
        "Experienced software engineer with expertise in building scalable applications.";

      const result = analyzeResume(resume);
      expect(result.score).toBe(10);
    });

    it("should add 5 points for short summary (< 50 chars) with warning", () => {
      const resume = createEmptyResume();
      resume.personalInfo.summary = "Senior developer.";

      const result = analyzeResume(resume);
      expect(result.score).toBe(5);

      const shortSummaryWarning = result.suggestions.find(
        (s) => s.id === "summary-short"
      );
      expect(shortSummaryWarning).toBeDefined();
      expect(shortSummaryWarning?.type).toBe("warning");
    });

    it("should add 0 points for missing summary with warning", () => {
      const resume = createEmptyResume();

      const result = analyzeResume(resume);

      const summaryWarning = result.suggestions.find(
        (s) => s.id === "summary-missing"
      );
      expect(summaryWarning).toBeDefined();
      expect(summaryWarning?.type).toBe("warning");
    });
  });

  describe("experience scoring", () => {
    it("should add 30 points for experience with good descriptions", () => {
      const resume = createEmptyResume();
      resume.experience = [
        {
          id: "exp-1",
          company: "Tech Corp",
          position: "Senior Engineer",
          startDate: "2020-01",
          endDate: "Present",
          current: true,
          description:
            "Led development of microservices architecture serving 1M+ users. Mentored junior developers.",
        },
      ];

      const result = analyzeResume(resume);
      expect(result.score).toBe(30);
    });

    it("should add 20 points for experience with short descriptions", () => {
      const resume = createEmptyResume();
      resume.experience = [
        {
          id: "exp-1",
          company: "Tech Corp",
          position: "Developer",
          startDate: "2020-01",
          endDate: "Present",
          current: true,
          description: "Wrote code.", // Short description
        },
      ];

      const result = analyzeResume(resume);
      expect(result.score).toBe(20);

      const descWarning = result.suggestions.find(
        (s) => s.id === "exp-desc-short"
      );
      expect(descWarning).toBeDefined();
      expect(descWarning?.type).toBe("warning");
    });

    it("should return error for missing experience", () => {
      const resume = createEmptyResume();

      const result = analyzeResume(resume);

      const expError = result.suggestions.find((s) => s.id === "exp-missing");
      expect(expError).toBeDefined();
      expect(expError?.type).toBe("error");
    });
  });

  describe("skills scoring", () => {
    it("should add 20 points for 5+ skills", () => {
      const resume = createEmptyResume();
      resume.skills = [
        { id: "skill-1", name: "JavaScript" },
        { id: "skill-2", name: "TypeScript" },
        { id: "skill-3", name: "React" },
        { id: "skill-4", name: "Node.js" },
        { id: "skill-5", name: "Python" },
      ];

      const result = analyzeResume(resume);
      expect(result.score).toBe(20);
    });

    it("should add 10 points for 1-4 skills with warning", () => {
      const resume = createEmptyResume();
      resume.skills = [
        { id: "skill-1", name: "JavaScript" },
        { id: "skill-2", name: "React" },
      ];

      const result = analyzeResume(resume);
      expect(result.score).toBe(10);

      const fewSkillsWarning = result.suggestions.find(
        (s) => s.id === "skills-few"
      );
      expect(fewSkillsWarning).toBeDefined();
      expect(fewSkillsWarning?.type).toBe("warning");
    });

    it("should return error for no skills", () => {
      const resume = createEmptyResume();

      const result = analyzeResume(resume);

      const skillsError = result.suggestions.find(
        (s) => s.id === "skills-missing"
      );
      expect(skillsError).toBeDefined();
      expect(skillsError?.type).toBe("error");
    });
  });

  describe("education scoring", () => {
    it("should add 10 points for education", () => {
      const resume = createEmptyResume();
      resume.education = [
        {
          id: "edu-1",
          institution: "MIT",
          degree: "Bachelor",
          field: "Computer Science",
          startDate: "2015-09",
          endDate: "2019-05",
          current: false,
        },
      ];

      const result = analyzeResume(resume);
      expect(result.score).toBe(10);
    });

    it("should return warning for missing education", () => {
      const resume = createEmptyResume();

      const result = analyzeResume(resume);

      const eduWarning = result.suggestions.find((s) => s.id === "edu-missing");
      expect(eduWarning).toBeDefined();
      expect(eduWarning?.type).toBe("warning");
    });
  });

  describe("projects scoring", () => {
    it("should add 10 points for projects", () => {
      const resume = createEmptyResume();
      resume.projects = [
        {
          id: "proj-1",
          name: "Open Source Tool",
          description: "A useful tool",
          technologies: ["TypeScript"],
        },
      ];

      const result = analyzeResume(resume);
      expect(result.score).toBe(10);
    });

    it("should return warning for missing projects", () => {
      const resume = createEmptyResume();

      const result = analyzeResume(resume);

      const projWarning = result.suggestions.find(
        (s) => s.id === "proj-missing"
      );
      expect(projWarning).toBeDefined();
      expect(projWarning?.type).toBe("warning");
    });
  });

  describe("suggestion structure", () => {
    it("should return suggestions with correct structure", () => {
      const resume = createEmptyResume();
      const result = analyzeResume(resume);

      result.suggestions.forEach((suggestion: Suggestion) => {
        expect(suggestion).toHaveProperty("id");
        expect(suggestion).toHaveProperty("type");
        expect(suggestion).toHaveProperty("message");
        expect(typeof suggestion.id).toBe("string");
        expect(["success", "warning", "error"]).toContain(suggestion.type);
        expect(typeof suggestion.message).toBe("string");
      });
    });

    it("should have unique suggestion ids", () => {
      const resume = createEmptyResume();
      const result = analyzeResume(resume);

      const ids = result.suggestions.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
