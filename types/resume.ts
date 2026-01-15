export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  jobTitle?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
  location?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string; // or "Present"
  current: boolean;
  location?: string;
  description: string; // HTML or Markdown
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  score?: string; // GPA or Percentage
}

export interface SkillItem {
  id: string;
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  link?: string;
  technologies: string[];
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: "Native" | "Fluent" | "Professional" | "Intermediate" | "Basic";
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string; // YYYY-MM
  link?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string; // YYYY-MM
  description?: string;
}

export interface VolunteerItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location?: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
  awards: AwardItem[];
  volunteer: VolunteerItem[];
}

// Template types for resume layouts
export type TemplateType = "classic" | "professional" | "modern";

export interface TemplateInfo {
  id: TemplateType;
  name: string;
  description: string;
  layout: "single-column" | "two-column";
}
