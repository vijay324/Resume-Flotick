/**
 * Client-Side API Key Storage
 * Encrypted storage for user-provided API keys using Web Crypto
 *
 * Security Model:
 * - Keys encrypted at rest in IndexedDB
 * - Uses same encryption primitives as resume persistence
 * - Keys never sent to server (fully client-side)
 * - Masked key preview for UI display
 */

import {
  encryptJSON,
  decryptJSON,
  isWebCryptoAvailable,
} from "./secure-storage";

const API_KEY_STORAGE_KEY = "encrypted_api_key";
const DEVICE_ID_STORAGE_KEY = "secure_device_id";

export interface ApiKeyData {
  key: string;
  provider: "gemini";
  addedAt: string;
  lastUsed?: string;
  lastTested?: string;
  isValid: boolean;
}

/**
 * Generate a cryptographically secure device ID
 */
export function generateSecureDeviceId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Get or create a secure device ID
 */
export function getSecureDeviceId(): string {
  if (typeof window === "undefined") return "";

  let deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (!deviceId) {
    deviceId = generateSecureDeviceId();
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  }
  return deviceId;
}

/**
 * Store API key (encrypted)
 */
export async function storeApiKeyClient(key: string): Promise<void> {
  const data: ApiKeyData = {
    key,
    provider: "gemini",
    addedAt: new Date().toISOString(),
    isValid: true,
  };

  const encrypted = await encryptJSON(data);
  localStorage.setItem(API_KEY_STORAGE_KEY, encrypted);
}

/**
 * Get API key (decrypted)
 */
export async function getApiKeyClient(): Promise<ApiKeyData | null> {
  const encrypted = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!encrypted) return null;

  try {
    return await decryptJSON<ApiKeyData>(encrypted);
  } catch (error) {
    console.error("[API Key Store] Failed to decrypt API key:", error);
    return null;
  }
}

/**
 * Check if API key exists
 */
export function hasApiKeyClient(): boolean {
  return localStorage.getItem(API_KEY_STORAGE_KEY) !== null;
}

/**
 * Remove API key
 */
export function removeApiKeyClient(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

/**
 * Get masked API key for display (e.g., "AIza...XXXX")
 */
export function getMaskedApiKey(key: string): string {
  if (!key || key.length < 10) return "••••••••";
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}

/**
 * Validate API key format (basic check)
 */
export function validateApiKeyFormat(key: string): {
  valid: boolean;
  error?: string;
} {
  if (!key || typeof key !== "string") {
    return { valid: false, error: "API key is required" };
  }

  const trimmed = key.trim();

  if (trimmed.length < 10) {
    return { valid: false, error: "API key is too short" };
  }

  if (!trimmed.startsWith("AIza")) {
    return {
      valid: false,
      error: "Invalid API key format. Gemini API keys start with 'AIza'",
    };
  }

  return { valid: true };
}

/**
 * Test API key by making a simple request to Gemini
 */
export async function testApiKey(key: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  try {
    // Make a minimal test request to the Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      return { valid: true };
    }

    if (response.status === 401 || response.status === 403) {
      return { valid: false, error: "Invalid or unauthorized API key" };
    }

    if (response.status === 429) {
      return { valid: false, error: "API quota exceeded. Try again later." };
    }

    return { valid: false, error: `API error: ${response.status}` };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Update API key last used timestamp
 */
export async function updateApiKeyLastUsed(): Promise<void> {
  const data = await getApiKeyClient();
  if (!data) return;

  data.lastUsed = new Date().toISOString();
  const encrypted = await encryptJSON(data);
  localStorage.setItem(API_KEY_STORAGE_KEY, encrypted);
}

/**
 * Mark API key as tested
 */
export async function markApiKeyTested(isValid: boolean): Promise<void> {
  const data = await getApiKeyClient();
  if (!data) return;

  data.lastTested = new Date().toISOString();
  data.isValid = isValid;
  const encrypted = await encryptJSON(data);
  localStorage.setItem(API_KEY_STORAGE_KEY, encrypted);
}

/**
 * Clear all API key related data
 */
export function clearApiKeyData(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  localStorage.removeItem(DEVICE_ID_STORAGE_KEY);
}

/**
 * Check if Web Crypto is available for secure storage
 */
export function isSecureStorageAvailable(): boolean {
  return isWebCryptoAvailable();
}
