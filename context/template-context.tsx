"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { TemplateType, TemplateInfo } from "@/types/resume";

interface TemplateContextType {
  templateType: TemplateType;
  setTemplate: (template: TemplateType) => void;
  templates: TemplateInfo[];
}

// Available templates with metadata
export const TEMPLATES: TemplateInfo[] = [
  {
    id: "ats",
    name: "Professional ATS",
    description: "Industry-standard single-column. 100% ATS compatible. Recommended.",
    layout: "single-column",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout. Best for text-heavy resumes.",
    layout: "single-column",
  },
  {
    id: "professional",
    name: "Professional (Two-Column)",
    description: "Two-column with sidebar. Note: Some ATS may have parsing issues.",
    layout: "two-column",
  },
  {
    id: "modern",
    name: "Modern (Two-Column)",
    description: "Clean two-column design. Note: Some ATS may have parsing issues.",
    layout: "two-column",
  },
];

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [templateType, setTemplateType] = useState<TemplateType>("ats");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("resumeTemplate");
    if (saved && TEMPLATES.some(t => t.id === saved)) {
      setTemplateType(saved as TemplateType);
    }
  }, []);

  // Save to localStorage on change
  const setTemplate = (template: TemplateType) => {
    setTemplateType(template);
    localStorage.setItem("resumeTemplate", template);
  };

  return (
    <TemplateContext.Provider value={{ templateType, setTemplate, templates: TEMPLATES }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
}
