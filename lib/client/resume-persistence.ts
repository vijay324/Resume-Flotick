/**
 * Resume Persistence Layer
 * Encrypted IndexedDB storage with localStorage fallback
 *
 * Features:
 * - Auto-save with debouncing
 * - Schema versioning for migrations
 * - Corruption detection and recovery
 * - Offline-first design
 * - Role Profile support
 */

import type { ResumeData } from "@/types/resume";
import type { RoleProfile } from "@/types/role-profile";
import {
  encryptJSON,
  decryptJSON,
  isWebCryptoAvailable,
  clearEncryptionKeys,
} from "./secure-storage";

const DB_NAME = "ResumeBuilderDB";
const DB_VERSION = 2; // Incremented for Role Profiles
const STORE_NAME = "resume";
const RESUME_KEY_PREFIX = "resume_";
const PROFILES_KEY = "role_profiles";
const LEGACY_RESUME_KEY = "current_resume"; // For migration
const BACKUP_KEY_PREFIX = "resume_backup_";
const SCHEMA_VERSION_KEY = "resume_schema_version";
const CURRENT_SCHEMA_VERSION = 1;

// Debounce configuration
const AUTOSAVE_DEBOUNCE_MS = 500;

/**
 * Storage type preference
 */
type StorageType = "indexeddb" | "localstorage";

/**
 * Storage status for UI feedback
 */
export interface StorageStatus {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
  storageType: StorageType;
}

/**
 * Debounce timer for autosave
 */
let saveDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let currentStatus: StorageStatus = {
  isSaving: false,
  lastSaved: null,
  error: null,
  storageType: "localstorage",
};

/**
 * Status change listeners
 */
const statusListeners: Set<(status: StorageStatus) => void> = new Set();

/**
 * Subscribe to storage status changes
 */
export function subscribeToStorageStatus(
  listener: (status: StorageStatus) => void
): () => void {
  statusListeners.add(listener);
  listener(currentStatus);
  return () => statusListeners.delete(listener);
}

/**
 * Update and notify status
 */
function updateStatus(updates: Partial<StorageStatus>): void {
  currentStatus = { ...currentStatus, ...updates };
  for (const listener of statusListeners) {
    listener(currentStatus);
  }
}

/**
 * Check if IndexedDB is available
 */
function isIndexedDBAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return "indexedDB" in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Open IndexedDB connection
 */
async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Save data to IndexedDB
 */
async function saveToIndexedDB(key: string, data: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Load data from IndexedDB
 */
async function loadFromIndexedDB(key: string): Promise<string | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Delete data from IndexedDB
 */
async function deleteFromIndexedDB(key: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Clear all IndexedDB data
 */
async function clearIndexedDB(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Generate a generic ID
 */
function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15);
}

/**
 * Get all role profiles (Handles Migration)
 */
export async function getRoleProfiles(): Promise<RoleProfile[]> {
  try {
    let encryptedProfiles: string | null = null;

    // Try IndexedDB
    if (isIndexedDBAvailable()) {
      encryptedProfiles = await loadFromIndexedDB(PROFILES_KEY);
    }
    // Fallback localStorage
    if (!encryptedProfiles) {
      encryptedProfiles = localStorage.getItem(PROFILES_KEY);
    }

    if (encryptedProfiles) {
      return await decryptJSON<RoleProfile[]>(encryptedProfiles);
    }

    // --- MIGRATION LOGIC ---
    // No profiles found. Check for legacy resume data.
    console.log("[Resume Persistence] No profiles found. Checking for legacy data...");
    
    // Check if legacy data exists
    let legacyDataEncrypted: string | null = null;
    if (isIndexedDBAvailable()) {
      legacyDataEncrypted = await loadFromIndexedDB(LEGACY_RESUME_KEY);
    }
    if (!legacyDataEncrypted) {
      legacyDataEncrypted = localStorage.getItem(LEGACY_RESUME_KEY);
    }

    const defaultProfile: RoleProfile = {
      id: generateId(),
      name: "Default Profile",
      jobTitle: "",
      color: "#4f46e5", // Default indigo
      isDefault: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (legacyDataEncrypted) {
      console.log("[Resume Persistence] Migrating legacy data to default profile.");
      // Move legacy data to new profile key
      const newKey = RESUME_KEY_PREFIX + defaultProfile.id;
      
      if (isIndexedDBAvailable()) {
        await saveToIndexedDB(newKey, legacyDataEncrypted);
        // Optional: Delete legacy key or keep as backup? keeping for safety for now.
      } else {
        localStorage.setItem(newKey, legacyDataEncrypted);
      }
    }

    // Save the new default profile list
    await saveRoleProfiles([defaultProfile]);
    
    return [defaultProfile];

  } catch (error) {
    console.error("[Resume Persistence] Failed to get role profiles:", error);
    // Return a temp default array to allow app to function
    return [{
       id: "temp-default", 
       name: "Default", 
       color: "#4f46e5", 
       createdAt: Date.now(), 
       updatedAt: Date.now() 
    }];
  }
}

/**
 * Save role profiles list
 */
export async function saveRoleProfiles(profiles: RoleProfile[]): Promise<void> {
  try {
    const encrypted = await encryptJSON(profiles);
    
    if (isIndexedDBAvailable()) {
      await saveToIndexedDB(PROFILES_KEY, encrypted);
    } else {
      localStorage.setItem(PROFILES_KEY, encrypted);
    }
  } catch (error) {
    console.error("[Resume Persistence] Failed to save role profiles:", error);
    throw error;
  }
}

/**
 * Save resume for a specific profile
 */
export async function saveResume(data: ResumeData, profileId: string): Promise<void> {
  if (!profileId) {
    throw new Error("Profile ID is required to save resume");
  }

  updateStatus({ isSaving: true, error: null });

  const key = RESUME_KEY_PREFIX + profileId;
  const backupKey = BACKUP_KEY_PREFIX + profileId;

  try {
    // Encrypt the data
    const encryptedData = await encryptJSON(data);

    // Save schema version
    localStorage.setItem(
      SCHEMA_VERSION_KEY,
      String(CURRENT_SCHEMA_VERSION)
    );

    if (isIndexedDBAvailable()) {
      // Primary: IndexedDB
      await saveToIndexedDB(key, encryptedData);
      updateStatus({ storageType: "indexeddb" });
    } else {
      // Fallback: localStorage
      localStorage.setItem(key, encryptedData);
      updateStatus({ storageType: "localstorage" });
    }

    // Create backup in localStorage
    localStorage.setItem(backupKey, encryptedData);

    updateStatus({ isSaving: false, lastSaved: new Date() });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save resume";
    updateStatus({ isSaving: false, error: errorMessage });
    console.error("[Resume Persistence] Save error:", error);
    throw error;
  }
}

/**
 * Load resume for a specific profile
 */
export async function loadResume(profileId: string): Promise<ResumeData | null> {
  if (!profileId) return null;

  const key = RESUME_KEY_PREFIX + profileId;
  const backupKey = BACKUP_KEY_PREFIX + profileId;

  try {
    let encryptedData: string | null = null;

    // Try IndexedDB first
    if (isIndexedDBAvailable()) {
      encryptedData = await loadFromIndexedDB(key);
      if (encryptedData) {
        updateStatus({ storageType: "indexeddb" });
      }
    }

    // Fallback to localStorage
    if (!encryptedData) {
      encryptedData = localStorage.getItem(key);
      if (encryptedData) {
        updateStatus({ storageType: "localstorage" });
      }
    }

    // Try backup if primary failed
    if (!encryptedData) {
      encryptedData = localStorage.getItem(backupKey);
    }

    if (!encryptedData) {
      return null;
    }

    // Decrypt and return
    const data = await decryptJSON<ResumeData>(encryptedData);
    return data;
  } catch (error) {
    console.error("[Resume Persistence] Load error:", error);

    // Attempt recovery from backup
    try {
      const backup = localStorage.getItem(backupKey);
      if (backup) {
        console.log("[Resume Persistence] Attempting recovery from backup");
        return await decryptJSON<ResumeData>(backup);
      }
    } catch (backupError) {
      console.error("[Resume Persistence] Backup recovery failed:", backupError);
    }

    updateStatus({ error: "Failed to load resume data" });
    return null;
  }
}

/**
 * Delete resume data for a profile
 */
export async function deleteResume(profileId: string): Promise<void> {
    const key = RESUME_KEY_PREFIX + profileId;
    const backupKey = BACKUP_KEY_PREFIX + profileId;

    if (isIndexedDBAvailable()) {
        await deleteFromIndexedDB(key);
    }
    localStorage.removeItem(key);
    localStorage.removeItem(backupKey);
}

/**
 * Debounced save for autosave functionality
 */
export function debouncedSaveResume(data: ResumeData, profileId: string): void {
  if (!profileId) return;

  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
  }

  updateStatus({ isSaving: true });

  saveDebounceTimer = setTimeout(async () => {
    try {
      await saveResume(data, profileId);
    } catch (error) {
      console.error("[Resume Persistence] Autosave failed:", error);
    }
  }, AUTOSAVE_DEBOUNCE_MS);
}

/**
 * Clear all resume data (Wipes everything including profiles)
 */
export async function clearAllResumeData(): Promise<void> {
  try {
    // Clear IndexedDB
    if (isIndexedDBAvailable()) {
      await clearIndexedDB();
    }

    // Clear localStorage (remove all resume relative keys)
    // We iterate to find all keys starting with resume_
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith(RESUME_KEY_PREFIX) || key.startsWith(BACKUP_KEY_PREFIX) || key === PROFILES_KEY || key === LEGACY_RESUME_KEY)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    
    localStorage.removeItem(SCHEMA_VERSION_KEY);

    // Clear encryption keys
    clearEncryptionKeys();

    updateStatus({
      isSaving: false,
      lastSaved: null,
      error: null,
    });
  } catch (error) {
    console.error("[Resume Persistence] Clear error:", error);
    throw error;
  }
}

/**
 * Check if resume data exists (Legacy check - updated for profiles)
 */
export async function hasStoredResume(): Promise<boolean> {
  try {
     const profiles = await getRoleProfiles();
     return profiles.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get current storage status
 */
export function getStorageStatus(): StorageStatus {
  return { ...currentStatus };
}
