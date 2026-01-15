"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

// History configuration
const MAX_HISTORY = 50;
const HISTORY_DEBOUNCE_MS = 300;

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
  // History/Undo-Redo features
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
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
 * Default sample data for new users - Professional Demo Resume
 */
const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: "Alexander Mitchell",
    jobTitle: "Senior Full Stack Engineer",
    email: "alex.mitchell@techmail.io",
    phone: "+1 (555) 123-4567",
    linkedin: "linkedin.com/in/alexmitchell",
    github: "github.com/alexmitchell-dev",
    website: "alexmitchell.dev",
    location: "San Francisco, CA",
    summary:
      "Results-driven Senior Full Stack Engineer with 8+ years of experience architecting and delivering scalable web applications for Fortune 500 companies. Specialized in React, Node.js, and cloud-native solutions. Led cross-functional teams of 12+ engineers, driving $2M+ in annual revenue through innovative product features. Passionate about clean code, performance optimization, and mentoring emerging developers.",
  },
  experience: [
    {
      id: "exp-1",
      company: "TechVista Solutions",
      position: "Senior Full Stack Engineer",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      location: "San Francisco, CA",
      description:
        "• Led development of a real-time analytics dashboard processing 50M+ events daily, improving client decision-making speed by 40%\n• Architected microservices migration reducing deployment time by 65% and system downtime by 80%\n• Mentored 6 junior developers through code reviews and pair programming sessions\n• Implemented CI/CD pipelines with GitHub Actions, reducing release cycles from 2 weeks to 2 days",
    },
    {
      id: "exp-2",
      company: "InnovateTech Inc.",
      position: "Full Stack Developer",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      location: "Austin, TX",
      description:
        "• Built and maintained RESTful APIs serving 100K+ daily active users with 99.9% uptime\n• Developed a customer portal that increased user engagement by 55% and reduced support tickets by 30%\n• Optimized database queries resulting in 70% improvement in application response time\n• Collaborated with UX team to implement accessible, WCAG 2.1 AA compliant interfaces",
    },
    {
      id: "exp-3",
      company: "StartupLabs",
      position: "Junior Software Developer",
      startDate: "2017-01",
      endDate: "2019-05",
      current: false,
      location: "Seattle, WA",
      description:
        "• Contributed to the development of a SaaS platform used by 5,000+ small businesses\n• Implemented automated testing suite achieving 85% code coverage\n• Participated in Agile ceremonies and delivered features across 20+ sprint cycles\n• Received 'Rising Star' award for exceptional performance in first year",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Stanford University",
      degree: "Master of Science",
      field: "Computer Science",
      startDate: "2015-09",
      endDate: "2017-06",
      current: false,
      score: "3.9 GPA",
    },
    {
      id: "edu-2",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science & Engineering",
      startDate: "2011-09",
      endDate: "2015-05",
      current: false,
      score: "3.7 GPA, Magna Cum Laude",
    },
  ],
  skills: [
    { id: "skill-1", name: "React / Next.js", level: "Expert" },
    { id: "skill-2", name: "TypeScript", level: "Expert" },
    { id: "skill-3", name: "Node.js", level: "Expert" },
    { id: "skill-4", name: "Python", level: "Advanced" },
    { id: "skill-5", name: "PostgreSQL / MongoDB", level: "Advanced" },
    { id: "skill-6", name: "AWS / GCP", level: "Advanced" },
    { id: "skill-7", name: "Docker / Kubernetes", level: "Intermediate" },
    { id: "skill-8", name: "GraphQL", level: "Advanced" },
    { id: "skill-9", name: "Redis", level: "Intermediate" },
    { id: "skill-10", name: "CI/CD Pipelines", level: "Advanced" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "CloudSync - Real-time Collaboration Platform",
      description:
        "Built a Google Docs-like real-time collaboration platform supporting 10,000+ concurrent users with WebSocket-based synchronization, conflict resolution, and offline support.",
      technologies: ["Next.js", "Socket.io", "Redis", "PostgreSQL", "AWS"],
      link: "github.com/alexmitchell-dev/cloudsync",
    },
    {
      id: "proj-2",
      name: "AI-Powered Code Review Assistant",
      description:
        "Developed an open-source VS Code extension leveraging GPT-4 API to provide intelligent code suggestions, security vulnerability detection, and automated documentation generation. 5,000+ downloads.",
      technologies: ["TypeScript", "OpenAI API", "VS Code Extension API"],
      link: "github.com/alexmitchell-dev/ai-code-review",
    },
    {
      id: "proj-3",
      name: "FinTrack - Personal Finance Dashboard",
      description:
        "Created a comprehensive personal finance management app with bank integration, spending analytics, budget forecasting, and investment portfolio tracking.",
      technologies: ["React Native", "Node.js", "Plaid API", "Chart.js"],
      link: "github.com/alexmitchell-dev/fintrack",
    },
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "Native" },
    { id: "lang-2", name: "Spanish", proficiency: "Professional" },
    { id: "lang-3", name: "German", proficiency: "Intermediate" },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect - Professional",
      issuer: "Amazon Web Services",
      date: "2023-08",
      link: "aws.amazon.com/verification/cert123",
    },
    {
      id: "cert-2",
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      date: "2022-11",
      link: "cloud.google.com/certification",
    },
    {
      id: "cert-3",
      name: "Certified Kubernetes Application Developer (CKAD)",
      issuer: "Cloud Native Computing Foundation",
      date: "2022-03",
    },
  ],
  awards: [
    {
      id: "award-1",
      title: "Innovation Excellence Award",
      issuer: "TechVista Solutions",
      date: "2023-12",
      description: "Recognized for developing the real-time analytics platform that became the company's flagship product",
    },
    {
      id: "award-2",
      title: "Best Open Source Contribution",
      issuer: "DevConf 2022",
      date: "2022-09",
      description: "Awarded for the AI Code Review Assistant project at the annual developer conference",
    },
  ],
  volunteer: [
    {
      id: "vol-1",
      organization: "Code.org",
      role: "Volunteer Instructor",
      startDate: "2021-01",
      endDate: "Present",
      current: true,
      location: "San Francisco, CA",
      description: "Teaching coding fundamentals to underrepresented high school students through weekly workshops and summer bootcamps. Mentored 50+ students, with 15 pursuing CS degrees.",
    },
    {
      id: "vol-2",
      organization: "Open Source Foundation",
      role: "Core Maintainer",
      startDate: "2020-06",
      endDate: "Present",
      current: true,
      location: "Remote",
      description: "Maintaining popular open-source libraries with 10K+ GitHub stars. Reviewing PRs, triaging issues, and coordinating releases with global contributors.",
    },
  ],
};

/**
 * Deep clone utility for immutable state snapshots
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  // Core state
  const [resumeData, setResumeDataInternal] = useState<ResumeData>(initialResumeData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStoredData, setHasStoredData] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // History stacks
  const [past, setPast] = useState<ResumeData[]>([]);
  const [future, setFuture] = useState<ResumeData[]>([]);

  // Refs for debouncing history
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCommittedStateRef = useRef<ResumeData>(initialResumeData);
  const pendingStateRef = useRef<ResumeData | null>(null);

  /**
   * Load data on mount (encrypted from storage)
   */
  useEffect(() => {
    async function initializeData() {
      try {
        setIsLoading(true);
        const stored = await loadResume();
        if (stored) {
          setResumeDataInternal(stored);
          lastCommittedStateRef.current = deepClone(stored);
          setHasStoredData(true);
        } else {
          // Use sample data for new users
          setResumeDataInternal(sampleResumeData);
          lastCommittedStateRef.current = deepClone(sampleResumeData);
          setHasStoredData(false);
        }
      } catch (error) {
        console.error("[ResumeContext] Failed to load resume:", error);
        // Fall back to sample data
        setResumeDataInternal(sampleResumeData);
        lastCommittedStateRef.current = deepClone(sampleResumeData);
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
   * Commit pending state to history after debounce
   */
  const commitToHistory = useCallback((newState: ResumeData) => {
    const stateSnapshot = deepClone(newState);

    setPast((prevPast) => {
      // Add last committed state to past
      const newPast = [...prevPast, deepClone(lastCommittedStateRef.current)];

      // Enforce max history limit
      if (newPast.length > MAX_HISTORY) {
        return newPast.slice(-MAX_HISTORY);
      }
      return newPast;
    });

    // Clear future on new action (standard undo/redo behavior)
    setFuture([]);

    // Update last committed state
    lastCommittedStateRef.current = stateSnapshot;
  }, []);

  /**
   * Set resume data with history tracking
   */
  const setResumeData: React.Dispatch<React.SetStateAction<ResumeData>> = useCallback(
    (newState) => {
      setResumeDataInternal((prevState) => {
        const resolvedState =
          typeof newState === "function" ? newState(prevState) : newState;

        const stateSnapshot = deepClone(resolvedState);
        pendingStateRef.current = stateSnapshot;

        // Clear existing debounce timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Set new debounce timer for history commit
        debounceTimerRef.current = setTimeout(() => {
          if (pendingStateRef.current !== null) {
            commitToHistory(pendingStateRef.current);
            pendingStateRef.current = null;
          }
        }, HISTORY_DEBOUNCE_MS);

        return stateSnapshot;
      });
    },
    [commitToHistory]
  );

  /**
   * Update a specific section with history tracking
   */
  const updateSection = useCallback(
    <K extends keyof ResumeData>(section: K, data: ResumeData[K]) => {
      setResumeData((prev) => ({ ...prev, [section]: data }));
    },
    [setResumeData]
  );

  /**
   * Undo to previous state
   */
  const undo = useCallback(() => {
    // Cancel any pending debounced commit
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;

      const newPast = [...prevPast];
      const previousState = newPast.pop()!;

      // Move current state to future
      setFuture((prevFuture) => [
        deepClone(lastCommittedStateRef.current),
        ...prevFuture,
      ]);

      // Restore previous state
      const restoredState = deepClone(previousState);
      setResumeDataInternal(restoredState);
      lastCommittedStateRef.current = restoredState;
      pendingStateRef.current = null;

      return newPast;
    });
  }, []);

  /**
   * Redo to next state
   */
  const redo = useCallback(() => {
    // Cancel any pending debounced commit
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;

      const newFuture = [...prevFuture];
      const nextState = newFuture.shift()!;

      // Move current state to past
      setPast((prevPast) => [
        ...prevPast,
        deepClone(lastCommittedStateRef.current),
      ]);

      // Restore next state
      const restoredState = deepClone(nextState);
      setResumeDataInternal(restoredState);
      lastCommittedStateRef.current = restoredState;
      pendingStateRef.current = null;

      return newFuture;
    });
  }, []);

  /**
   * Clear all history (keeps current state)
   */
  const clearHistory = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setPast([]);
    setFuture([]);
    pendingStateRef.current = null;
    lastCommittedStateRef.current = deepClone(resumeData);
  }, [resumeData]);

  /**
   * Clear all stored data and reset history
   */
  const clearAllData = useCallback(async () => {
    await clearAllResumeData();
    setResumeDataInternal(initialResumeData);
    lastCommittedStateRef.current = deepClone(initialResumeData);
    setHasStoredData(false);
    // Clear history on hard reset
    setPast([]);
    setFuture([]);
    pendingStateRef.current = null;
  }, []);

  // Register keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: undo,
    onRedo: redo,
    enabled: isInitialized && !isLoading,
  });

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Computed values
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        updateSection,
        isLoading,
        clearAllData,
        hasStoredData,
        undo,
        redo,
        canUndo,
        canRedo,
        clearHistory,
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
