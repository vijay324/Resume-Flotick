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
import type { ResumeData } from "@/types/resume";
import {
  loadResume,
  debouncedSaveResume,
  deleteResume,
} from "@/lib/client/resume-persistence";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useRoleProfile } from "./role-profile-context";

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
    fullName: "Candidate Name",
    jobTitle: "Job Title",
    email: "candidate@example.org",
    phone: "+1 (555) 000-0000",
    linkedin: "linkedin.com/in/professional-candidate",
    github: "github.com/pro-candidate",
    website: "pro-candidate.me",
    location: "Metropolis, NY",
    summary:
      "Results-driven Senior Software Architect with 10+ years of experience architecting and delivering scalable enterprise applications. Specialized in modern web technologies and cloud-native solutions. Proven track record of leading high-performance teams and driving significant technical innovation. Committed to high-quality code, optimized performance, and continuous professional growth.",
  },
  experience: [
    {
      id: "exp-1",
      company: "Acme Dynamics",
      position: "Senior Software Architect",
      startDate: "2022-01",
      endDate: "Present",
      current: true,
      location: "Metropolis, NY",
      description:
        "• Spearheaded the development of a high-concurrency data platform serving millions of users daily.\n• Lead architectural decisions for cloud-native microservices, optimizing for scalability and reliability.\n• Established best practices for code quality, automated testing, and CI/CD workflows.\n• Mentored technical leads and senior engineers on system design and complex problem-solving.",
    },
    {
      id: "exp-2",
      company: "Global Synergy Corp",
      position: "Technical Lead",
      startDate: "2018-05",
      endDate: "2021-12",
      current: false,
      location: "Tech City, CA",
      description:
        "• Managed a multidisciplinary team to deliver a suite of enterprise productivity tools.\n• Reduced system latency by 50% through aggressive performance tuning and infrastructure optimization.\n• Collaborated with product owners to define technical roadmaps and deliver features on schedule.\n• Successfully migrated legacy systems to a modern distributed architecture without downtime.",
    },
    {
      id: "exp-3",
      company: "Innovative Systems LLC",
      position: "Senior Software Engineer",
      startDate: "2015-06",
      endDate: "2018-04",
      current: false,
      location: "Innovation Hub, WA",
      description:
        "• Developed core components of a SaaS platform used by thousands of small businesses.\n• Implemented robust API security models and data encryption protocols.\n• Optimized database performance, leading to a significant reduction in operational costs.\n• Contributed extensively to internal developer tools and shared component libraries.",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Excellence",
      degree: "Master of Science",
      field: "Computer Science",
      startDate: "2013-09",
      endDate: "2015-05",
      current: false,
      score: "Excellent Standing",
    },
    {
      id: "edu-2",
      institution: "Institute of Advanced Technology",
      degree: "Bachelor of Science",
      field: "Software Engineering",
      startDate: "2009-09",
      endDate: "2013-05",
      current: false,
      score: "Summa Cum Laude",
    },
  ],
  skills: [
    { id: "skill-1", name: "System Architecture" },
    { id: "skill-2", name: "Modern Web Frameworks" },
    { id: "skill-3", name: "Cloud Infrastructure (AWS/GCP)" },
    { id: "skill-4", name: "Distributed Systems" },
    { id: "skill-5", name: "CI/CD & DevOps" },
    { id: "skill-6", name: "TypeScript / JavaScript" },
    { id: "skill-7", name: "Python / Go" },
    { id: "skill-8", name: "Relational & NoSQL Databases" },
    { id: "skill-9", name: "Project Management" },
    { id: "skill-10", name: "Agile Methodologies" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Project Alpha - Real-time Data Suite",
      description:
        "A comprehensive real-time data processing and visualization suite designed for large-scale enterprise monitoring.",
      technologies: ["React", "Distributed Messaging", "Cloud Storage"],
      link: "project-alpha.example.com",
    },
    {
      id: "proj-2",
      name: "Project Beta - Intelligent Automation Proxy",
      description:
        "An intelligent proxy system that automates resource allocation and load balancing for high-traffic environments.",
      technologies: ["Node.js", "Containerized Services", "Edge Computing"],
      link: "project-beta.example.com",
    },
    {
      id: "proj-3",
      name: "Project Gamma - Universal Integration Layer",
      description:
        "A universal middleware layer providing seamless connectivity between disparate legacy and modern software systems.",
      technologies: ["Python", "API Gateway", "Data Transformation"],
      link: "project-gamma.example.com",
    },
  ],
  languages: [
    { id: "lang-1", name: "Primary Language", proficiency: "Native" },
    { id: "lang-2", name: "Secondary Language", proficiency: "Professional" },
    { id: "lang-3", name: "Third Language", proficiency: "Intermediate" },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Industry Professional Certification",
      issuer: "Global Standards Body",
      date: "2023-01",
      link: "verification.example.com/cert1",
    },
    {
      id: "cert-2",
      name: "Advanced Technical Specialist",
      issuer: "Institute of Technology",
      date: "2021-11",
      link: "verification.example.com/cert2",
    },
  ],
  awards: [
    {
      id: "award-1",
      title: "Technical Excellence Award",
      issuer: "Acme Dynamics",
      date: "2023-12",
      description: "Recognized for exceptional contributions to the core architecture of the enterprise data platform.",
    },
    {
      id: "award-2",
      title: "Award for Continuous Innovation",
      issuer: "Tech Industry Forum",
      date: "2022-10",
      description: "Awarded for the development of highly efficient distributed system components.",
    },
  ],
  volunteer: [
    {
      id: "vol-1",
      organization: "Community Tech Initiative",
      role: "Technical Advisor",
      startDate: "2020-01",
      endDate: "Present",
      current: true,
      location: "Metropolis, NY",
      description: "Providing pro-bono technical consulting and system administration for local non-profit organizations focused on education.",
    },
    {
      id: "vol-2",
      organization: "Open Knowledge Foundation",
      role: "Contributor",
      startDate: "2018-01",
      endDate: "Present",
      current: true,
      location: "Remote",
      description: "Maintaining and improving internal tools used to manage distributed datasets and educational resources.",
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
  const { activeProfile, isLoading: isProfilesLoading } = useRoleProfile();

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
   * Load data when active profile changes
   */
  useEffect(() => {
    // Wait for profiles to be loaded
    if (isProfilesLoading) return;
    
    // If no active profile (e.g., initial load or deleted), don't load data yet
    // RoleProfileContext should handle selecting a default, but handle safeguard here
    if (!activeProfile) {
        setIsLoading(false);
        return;
    }

    async function initializeData() {
      try {
        setIsLoading(true);
        // Reset history when switching profiles
        setPast([]);
        setFuture([]);
        pendingStateRef.current = null;

        const stored = await loadResume(activeProfile!.id);
        
        if (stored) {
          setResumeDataInternal(stored);
          lastCommittedStateRef.current = deepClone(stored);
          setHasStoredData(true);
        } else {
          // New profile or no data: use sample data or empty?
          // For new "empty" profiles, we might want actual empty data, 
          // but the requirements say "pre-filled with data from previously active"
          // which is handled by createProfile cloning. 
          // If we reach here and it's null, it implies a fresh start or failed load.
          // Let's use sample data for now to keep experience consistent.
          const freshData = activeProfile?.isDefault ? sampleResumeData : deepClone(initialResumeData);
          setResumeDataInternal(freshData);
          lastCommittedStateRef.current = deepClone(freshData);
          setHasStoredData(false);
        }
      } catch (error) {
        console.error("[ResumeContext] Failed to load resume:", error);
        setResumeDataInternal(initialResumeData);
        lastCommittedStateRef.current = deepClone(initialResumeData);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    }

    initializeData();
  }, [activeProfile, isProfilesLoading]);

  /**
   * Auto-save on data changes (encrypted, debounced)
   */
  useEffect(() => {
    if (!isInitialized || !activeProfile || isLoading) return;
    debouncedSaveResume(resumeData, activeProfile.id);
    setHasStoredData(true);
  }, [resumeData, isInitialized, activeProfile, isLoading]);

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
   * Clear all stored data for current profile
   */
  const clearAllData = useCallback(async () => {
    if (!activeProfile) return;
    
    // Clear only the current profile's data
    setResumeDataInternal(initialResumeData);
    lastCommittedStateRef.current = deepClone(initialResumeData);
    setHasStoredData(false);
    
    // Clear history on hard reset
    setPast([]);
    setFuture([]);
    pendingStateRef.current = null;
    
    // Force a save to "clear" the storage (save empty state)
    debouncedSaveResume(initialResumeData, activeProfile.id);
    
  }, [activeProfile]);

  // Register keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: undo,
    onRedo: redo,
    enabled: isInitialized && !isLoading && !isProfilesLoading,
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
        isLoading: isLoading || isProfilesLoading,
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
