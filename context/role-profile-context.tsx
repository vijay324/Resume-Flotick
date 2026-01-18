"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import type { RoleProfile } from "@/types/role-profile";
import type { ResumeData } from "@/types/resume";
import {
  getRoleProfiles,
  saveRoleProfiles,
  saveResume,
  loadResume,
  deleteResume,
} from "@/lib/client/resume-persistence";

interface RoleProfileContextType {
  profiles: RoleProfile[];
  activeProfile: RoleProfile | null;
  isLoading: boolean;
  createProfile: (name: string, jobTitle?: string, baseProfileId?: string) => Promise<void>;
  switchProfile: (profileId: string) => void;
  updateProfile: (profileId: string, updates: Partial<RoleProfile>) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
}

const RoleProfileContext = createContext<RoleProfileContextType | undefined>(
  undefined
);

export function RoleProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<RoleProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profiles on mount
  useEffect(() => {
    async function initProfiles() {
      try {
        const loadedProfiles = await getRoleProfiles();
        setProfiles(loadedProfiles);
        
        // Restore last active profile from localStorage or default to first
        const savedActiveId = localStorage.getItem("active_role_profile_id");
        const profileToActivate = 
            loadedProfiles.find(p => p.id === savedActiveId) || 
            loadedProfiles.find(p => p.isDefault) || 
            loadedProfiles[0];
            
        if (profileToActivate) {
            setActiveProfileId(profileToActivate.id);
            localStorage.setItem("active_role_profile_id", profileToActivate.id);
        }
      } catch (error) {
        console.error("Failed to initialize role profiles:", error);
      } finally {
        setIsLoading(false);
      }
    }
    initProfiles();
  }, []);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || null;

  const saveProfilesState = async (newProfiles: RoleProfile[]) => {
      setProfiles(newProfiles);
      await saveRoleProfiles(newProfiles);
  };

  const switchProfile = useCallback((profileId: string) => {
      setActiveProfileId(profileId);
      localStorage.setItem("active_role_profile_id", profileId);
  }, []);

  const createProfile = async (name: string, jobTitle?: string, baseProfileId?: string) => {
    const newProfile: RoleProfile = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      name,
      jobTitle,
      color: generateRandomColor(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDefault: false,
    };

    // Cloning logic
    if (baseProfileId) {
        try {
            const baseData = await loadResume(baseProfileId);
            if (baseData) {
                // Update personal info job title if provided
                const newData: ResumeData = {
                    ...baseData,
                    personalInfo: {
                        ...baseData.personalInfo,
                        jobTitle: jobTitle || baseData.personalInfo.jobTitle,
                    }
                };
                await saveResume(newData, newProfile.id);
            }
        } catch (e) {
            console.error("Failed to clone resume data:", e);
        }
    }

    const newProfiles = [...profiles, newProfile];
    await saveProfilesState(newProfiles);
    switchProfile(newProfile.id); // Auto-switch to new profile
  };

  const updateProfile = async (profileId: string, updates: Partial<RoleProfile>) => {
      const newProfiles = profiles.map(p => 
        p.id === profileId ? { ...p, ...updates, updatedAt: Date.now() } : p
      );
      await saveProfilesState(newProfiles);
  };

  const deleteProfile = async (profileId: string) => {
      const profileIdx = profiles.findIndex(p => p.id === profileId);
      if (profileIdx === -1) return;
      
      const profile = profiles[profileIdx];
      // Prevent deleting the only profile
      if (profiles.length <= 1) {
          throw new Error("Cannot delete the last profile");
      }

      await deleteResume(profileId);
      
      const newProfiles = profiles.filter(p => p.id !== profileId);
      await saveProfilesState(newProfiles);

      // If we deleted the active profile, switch to another one
      if (activeProfileId === profileId) {
          const nextProfile = newProfiles[0];
          switchProfile(nextProfile.id);
      }
  };

  return (
    <RoleProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        isLoading,
        createProfile,
        switchProfile,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </RoleProfileContext.Provider>
  );
}

export function useRoleProfile() {
  const context = useContext(RoleProfileContext);
  if (context === undefined) {
    throw new Error("useRoleProfile must be used within a RoleProfileProvider");
  }
  return context;
}

// Helpers
function generateRandomColor(): string {
    const colors = [
        "#ef4444", // red-500
        "#f97316", // orange-500
        "#f59e0b", // amber-500
        "#10b981", // emerald-500
        "#06b6d4", // cyan-500
        "#3b82f6", // blue-500
        "#6366f1", // indigo-500
        "#8b5cf6", // violet-500
        "#d946ef", // fuchsia-500
        "#ec4899", // pink-500
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
