"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  ResumeData,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
  LanguageItem,
  CertificationItem,
  AwardItem,
  VolunteerItem,
} from "@/types/resume";
import {
  loadResume,
  debouncedSaveResume,
  clearAllResumeData,
  hasStoredResume,
} from "@/lib/client/resume-persistence";

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updateSection: <K extends keyof ResumeData>(
    section: K,
    data: ResumeData[K]
  ) => void;
  isLoading: boolean;
  clearAllData: () => Promise<void>;
  hasStoredData: boolean;
}

const initialResumeData: ResumeData = {
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
};

/**
 * Default sample data for new users
 */
const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    website: "johndoe.com",
    location: "New York, NY",
    summary:
      "Experienced Full Stack Developer with a passion for building scalable web applications. Proven track record of delivering high-quality code and leading development teams.",
  },
  experience: [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      startDate: "2020-01",
      endDate: "Present",
      current: true,
      location: "San Francisco, CA",
      description:
        "Led the development of a microservices-based architecture handling 1M+ daily requests.",
    },
  ],
  education: [
    {
      id: "1",
      institution: "State University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2015-09",
      endDate: "2019-05",
      current: false,
      score: "3.8 GPA",
    },
  ],
  skills: [
    { id: "1", name: "React", level: "Expert" },
    { id: "2", name: "Node.js", level: "Advanced" },
    { id: "3", name: "TypeScript", level: "Advanced" },
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description:
        "Built a fully functional e-commerce site with cart and payment integration.",
      technologies: ["Next.js", "Stripe", "PostgreSQL"],
      link: "github.com/johndoe/ecommerce",
    },
  ],
  languages: [
    { id: "1", name: "English", proficiency: "Native" },
    { id: "2", name: "Spanish", proficiency: "Intermediate" },
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022-05",
    },
  ],
  awards: [],
  volunteer: [],
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStoredData, setHasStoredData] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Load data on mount (encrypted from storage)
   */
  useEffect(() => {
    async function initializeData() {
      try {
        setIsLoading(true);
        const stored = await loadResume();
        if (stored) {
          setResumeData(stored);
          setHasStoredData(true);
        } else {
          // Use sample data for new users
          setResumeData(sampleResumeData);
          setHasStoredData(false);
        }
      } catch (error) {
        console.error("[ResumeContext] Failed to load resume:", error);
        // Fall back to sample data
        setResumeData(sampleResumeData);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    }

    initializeData();
  }, []);

  /**
   * Auto-save on data changes (encrypted, debounced)
   */
  useEffect(() => {
    if (!isInitialized) return;
    debouncedSaveResume(resumeData);
    setHasStoredData(true);
  }, [resumeData, isInitialized]);

  /**
   * Update a specific section
   */
  const updateSection = useCallback(
    <K extends keyof ResumeData>(section: K, data: ResumeData[K]) => {
      setResumeData((prev) => ({ ...prev, [section]: data }));
    },
    []
  );

  /**
   * Clear all stored data
   */
  const clearAllData = useCallback(async () => {
    await clearAllResumeData();
    setResumeData(initialResumeData);
    setHasStoredData(false);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        updateSection,
        isLoading,
        clearAllData,
        hasStoredData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
