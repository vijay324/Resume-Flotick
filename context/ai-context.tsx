"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { AIUsageStats } from "@/types/ai";

interface AIContextType {
  hasApiKey: boolean;
  isApiKeyValid: boolean;
  aiEnabled: boolean;
  usageStats: AIUsageStats | null;
  deviceId: string;
  addApiKey: (key: string) => Promise<{ success: boolean; error?: string }>;
  removeApiKey: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  isLoading: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

/**
 * Generate a device ID for the user
 */
function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    // Generate a unique device ID
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}

export function AIProvider({ children }: { children: ReactNode }) {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [usageStats, setUsageStats] = useState<AIUsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceId] = useState(getDeviceId);

  /**
   * Check API key status on mount
   */
  useEffect(() => {
    refreshStatus();
  }, []);

  /**
   * Refresh API key status from server
   */
  const refreshStatus = async () => {
    if (!deviceId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai-keys?deviceId=${deviceId}`);
      const data = await response.json();

      setHasApiKey(data.hasKey || false);
      setIsApiKeyValid(data.isValid || false);

      // TODO: Fetch usage stats
      // For now, use default values
      setUsageStats({
        requestsToday: 0,
        limit: 50,
        remaining: 50,
        resetAt: new Date(),
      });
    } catch (error) {
      console.error("Error checking API key status:", error);
      setHasApiKey(false);
      setIsApiKeyValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add or update API key
   */
  const addApiKey = async (
    key: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!deviceId) {
      return { success: false, error: "Device ID not available" };
    }

    try {
      const response = await fetch("/api/ai-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key, deviceId }),
      });

      const data = await response.json();

      if (response.ok) {
        await refreshStatus();
        return { success: true };
      }

      return { success: false, error: data.error || "Failed to add API key" };
    } catch (error) {
      console.error("Error adding API key:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  /**
   * Remove API key
   */
  const removeApiKey = async () => {
    if (!deviceId) return;

    try {
      await fetch(`/api/ai-keys?deviceId=${deviceId}`, {
        method: "DELETE",
      });

      setHasApiKey(false);
      setIsApiKeyValid(false);
    } catch (error) {
      console.error("Error removing API key:", error);
    }
  };

  const aiEnabled = hasApiKey && isApiKeyValid;

  return (
    <AIContext.Provider
      value={{
        hasApiKey,
        isApiKeyValid,
        aiEnabled,
        usageStats,
        deviceId,
        addApiKey,
        removeApiKey,
        refreshStatus,
        isLoading,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
}
