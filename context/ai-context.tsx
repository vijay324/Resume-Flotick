"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AIUsageStats } from "@/types/ai";
import {
  getSecureDeviceId,
  getApiKeyClient,
  storeApiKeyClient,
  removeApiKeyClient,
  hasApiKeyClient,
  testApiKey,
  markApiKeyTested,
  getMaskedApiKey,
  validateApiKeyFormat,
  type ApiKeyData,
} from "@/lib/client/client-api-key-store";

interface AIContextType {
  hasApiKey: boolean;
  isApiKeyValid: boolean;
  aiEnabled: boolean;
  usageStats: AIUsageStats | null;
  deviceId: string;
  maskedKey: string;
  addApiKey: (key: string) => Promise<{ success: boolean; error?: string }>;
  removeApiKey: () => Promise<void>;
  testCurrentKey: () => Promise<{ valid: boolean; error?: string }>;
  refreshStatus: () => Promise<void>;
  isLoading: boolean;
  consentGiven: boolean;
  setConsentGiven: (value: boolean) => void;
}

const CONSENT_STORAGE_KEY = "api_key_consent";

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [usageStats, setUsageStats] = useState<AIUsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceId, setDeviceId] = useState("");
  const [maskedKey, setMaskedKey] = useState("");
  const [consentGiven, setConsentGivenState] = useState(false);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    async function initialize() {
      setIsLoading(true);
      try {
        // Get secure device ID
        const id = getSecureDeviceId();
        setDeviceId(id);

        // Load consent
        const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
        setConsentGivenState(consent === "true");

        // Check for existing API key
        await refreshStatus();
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, []);

  /**
   * Refresh API key status from client storage
   */
  const refreshStatus = useCallback(async () => {
    try {
      const hasKey = hasApiKeyClient();
      setHasApiKey(hasKey);

      if (hasKey) {
        const keyData = await getApiKeyClient();
        if (keyData) {
          setIsApiKeyValid(keyData.isValid);
          setMaskedKey(getMaskedApiKey(keyData.key));
        } else {
          setIsApiKeyValid(false);
          setMaskedKey("");
        }
      } else {
        setIsApiKeyValid(false);
        setMaskedKey("");
      }

      // Set default usage stats (client-side doesn't track server usage)
      setUsageStats({
        requestsToday: 0,
        limit: 50,
        remaining: 50,
        resetAt: new Date(),
      });
    } catch (error) {
      console.error("[AI Context] Error refreshing status:", error);
      setHasApiKey(false);
      setIsApiKeyValid(false);
    }
  }, []);

  /**
   * Set consent with persistence
   */
  const setConsentGiven = useCallback((value: boolean) => {
    setConsentGivenState(value);
    localStorage.setItem(CONSENT_STORAGE_KEY, value ? "true" : "false");
  }, []);

  /**
   * Add or update API key (client-side encrypted)
   */
  const addApiKey = useCallback(
    async (key: string): Promise<{ success: boolean; error?: string }> => {
      try {
        // Validate format
        const validation = validateApiKeyFormat(key);
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }

        // Store encrypted key
        await storeApiKeyClient(key.trim());

        // Test the key
        const testResult = await testApiKey(key.trim());
        await markApiKeyTested(testResult.valid);

        await refreshStatus();

        if (!testResult.valid) {
          return {
            success: true,
            error: `Key stored but test failed: ${testResult.error}`,
          };
        }

        return { success: true };
      } catch (error) {
        console.error("[AI Context] Error adding API key:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to add key",
        };
      }
    },
    [refreshStatus]
  );

  /**
   * Remove API key
   */
  const removeApiKey = useCallback(async () => {
    try {
      removeApiKeyClient();
      await refreshStatus();
    } catch (error) {
      console.error("[AI Context] Error removing API key:", error);
    }
  }, [refreshStatus]);

  /**
   * Test current API key
   */
  const testCurrentKey = useCallback(async (): Promise<{
    valid: boolean;
    error?: string;
  }> => {
    try {
      const keyData = await getApiKeyClient();
      if (!keyData) {
        return { valid: false, error: "No API key found" };
      }

      const result = await testApiKey(keyData.key);
      await markApiKeyTested(result.valid);
      await refreshStatus();

      return result;
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Test failed",
      };
    }
  }, [refreshStatus]);

  const aiEnabled = hasApiKey && isApiKeyValid && consentGiven;

  return (
    <AIContext.Provider
      value={{
        hasApiKey,
        isApiKeyValid,
        aiEnabled,
        usageStats,
        deviceId,
        maskedKey,
        addApiKey,
        removeApiKey,
        testCurrentKey,
        refreshStatus,
        isLoading,
        consentGiven,
        setConsentGiven,
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
