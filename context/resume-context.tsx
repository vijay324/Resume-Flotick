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
