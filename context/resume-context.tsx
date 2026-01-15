"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { ResumeData, ExperienceItem, EducationItem, SkillItem, ProjectItem, LanguageItem, CertificationItem, AwardItem, VolunteerItem } from "@/types/resume";

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updateSection: <K extends keyof ResumeData>(section: K, data: ResumeData[K]) => void;
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    website: "johndoe.com",
    location: "New York, NY",
    summary: "Experienced Full Stack Developer with a passion for building scalable web applications. Proven track record of delivering high-quality code and leading development teams.",
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
      description: "Led the development of a microservices-based architecture handling 1M+ daily requests.",
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
      description: "Built a fully functional e-commerce site with cart and payment integration.",
      technologies: ["Next.js", "Stripe", "PostgreSQL"],
      link: "github.com/johndoe/ecommerce",
    },
  ],
  languages: [
    { id: "1", name: "English", proficiency: "Native" },
    { id: "2", name: "Spanish", proficiency: "Intermediate" },
  ],
  certifications: [
    { id: "1", name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2022-05" },
  ],
  awards: [],
  volunteer: [],
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  // Load from local storage on mount (optional enhancement)
  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse resume data", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  }, [resumeData]);

  const updateSection = <K extends keyof ResumeData>(section: K, data: ResumeData[K]) => {
    setResumeData((prev) => ({ ...prev, [section]: data }));
  };

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, updateSection }}>
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
