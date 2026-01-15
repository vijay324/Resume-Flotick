import { decrypt, validateEncryptionSecret } from "./encryption";
import * as fs from "fs";
import * as path from "path";

// File-based storage for persistence across server restarts
const STORAGE_DIR = path.join(process.cwd(), ".api-keys");
const STORAGE_FILE = path.join(STORAGE_DIR, "keys.json");

interface KeyData {
  encrypted: string;
  iv: string;
  salt: string;
  tag: string;
  isValid: boolean;
  lastTested?: string;
}

// Ensure storage directory exists
function ensureStorageDir(): void {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

// Load keys from file
function loadKeys(): Record<string, KeyData> {
  try {
    ensureStorageDir();
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("[API Key Store] Error loading keys:", error);
  }
  return {};
}

// Save keys to file
function saveKeys(keys: Record<string, KeyData>): void {
  try {
    ensureStorageDir();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(keys, null, 2));
  } catch (error) {
    console.error("[API Key Store] Error saving keys:", error);
  }
}

/**
 * Store encrypted API key for a device
 */
export function storeApiKey(
  deviceId: string,
  encrypted: string,
  iv: string,
  salt: string,
  tag: string
): void {
  const keys = loadKeys();
  keys[deviceId] = {
    encrypted,
    iv,
    salt,
    tag,
    isValid: true,
    lastTested: new Date().toISOString(),
  };
  saveKeys(keys);
  console.log(`[API Key Store] Stored key for device: ${deviceId}`);
}

/**
 * Get decrypted API key for a device
 */
export function getDecryptedApiKey(deviceId: string): string | null {
  console.log(`[API Key Store] Retrieving key for device: ${deviceId}`);
  
  const keys = loadKeys();
  const keyData = keys[deviceId];

  if (!keyData) {
    console.error(`[API Key Store] No key found for device: ${deviceId}`);
    console.log(`[API Key Store] Available devices: ${Object.keys(keys).join(", ") || "none"}`);
    return null;
  }

  try {
    validateEncryptionSecret(process.env.ENCRYPTION_SECRET);
    const decrypted = decrypt(
      keyData.encrypted,
      keyData.iv,
      keyData.salt,
      keyData.tag,
      process.env.ENCRYPTION_SECRET!
    );
    console.log(`[API Key Store] Successfully decrypted key for device: ${deviceId}`);
    return decrypted;
  } catch (error) {
    console.error(`[API Key Store] Error decrypting API key:`, error);
    return null;
  }
}

/**
 * Check if an API key exists for a device
 */
export function hasApiKey(deviceId: string): boolean {
  const keys = loadKeys();
  return deviceId in keys;
}

/**
 * Get API key status for a device
 */
export function getApiKeyStatus(deviceId: string): {
  hasKey: boolean;
  isValid: boolean;
  lastTested?: Date;
} {
  const keys = loadKeys();
  const keyData = keys[deviceId];

  if (!keyData) {
    return { hasKey: false, isValid: false };
  }

  return {
    hasKey: true,
    isValid: keyData.isValid,
    lastTested: keyData.lastTested ? new Date(keyData.lastTested) : undefined,
  };
}

/**
 * Remove API key for a device
 */
export function removeApiKey(deviceId: string): void {
  const keys = loadKeys();
  delete keys[deviceId];
  saveKeys(keys);
  console.log(`[API Key Store] Removed key for device: ${deviceId}`);
}
