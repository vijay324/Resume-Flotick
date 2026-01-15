/**
 * Resume Persistence Layer
 * Encrypted IndexedDB storage with localStorage fallback
 *
 * Features:
 * - Auto-save with debouncing
 * - Schema versioning for migrations
 * - Corruption detection and recovery
 * - Offline-first design
 */

import type { ResumeData } from "@/types/resume";
import {
  encryptJSON,
  decryptJSON,
  isWebCryptoAvailable,
  clearEncryptionKeys,
} from "./secure-storage";

const DB_NAME = "ResumeBuilderDB";
const DB_VERSION = 1;
const STORE_NAME = "resume";
const RESUME_KEY = "current_resume";
const BACKUP_KEY = "resume_backup";
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
 * Save resume with encryption
 */
export async function saveResume(data: ResumeData): Promise<void> {
  updateStatus({ isSaving: true, error: null });

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
      await saveToIndexedDB(RESUME_KEY, encryptedData);
      updateStatus({ storageType: "indexeddb" });
    } else {
      // Fallback: localStorage
      localStorage.setItem(RESUME_KEY, encryptedData);
      updateStatus({ storageType: "localstorage" });
    }

    // Create backup in localStorage
    localStorage.setItem(BACKUP_KEY, encryptedData);

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
 * Load resume with decryption
 */
export async function loadResume(): Promise<ResumeData | null> {
  try {
    let encryptedData: string | null = null;

    // Try IndexedDB first
    if (isIndexedDBAvailable()) {
      encryptedData = await loadFromIndexedDB(RESUME_KEY);
      if (encryptedData) {
        updateStatus({ storageType: "indexeddb" });
      }
    }

    // Fallback to localStorage
    if (!encryptedData) {
      encryptedData = localStorage.getItem(RESUME_KEY);
      if (encryptedData) {
        updateStatus({ storageType: "localstorage" });
      }
    }

    // Try backup if primary failed
    if (!encryptedData) {
      encryptedData = localStorage.getItem(BACKUP_KEY);
    }

    if (!encryptedData) {
      return null;
    }

    // Check and handle schema migrations
    const savedVersion = parseInt(
      localStorage.getItem(SCHEMA_VERSION_KEY) || "1",
      10
    );
    if (savedVersion < CURRENT_SCHEMA_VERSION) {
      // Future: handle migrations here
      console.log(
        `[Resume Persistence] Migrating from schema v${savedVersion} to v${CURRENT_SCHEMA_VERSION}`
      );
    }

    // Decrypt and return
    const data = await decryptJSON<ResumeData>(encryptedData);
    return data;
  } catch (error) {
    console.error("[Resume Persistence] Load error:", error);

    // Attempt recovery from backup
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
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
 * Debounced save for autosave functionality
 */
export function debouncedSaveResume(data: ResumeData): void {
  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
  }

  updateStatus({ isSaving: true });

  saveDebounceTimer = setTimeout(async () => {
    try {
      await saveResume(data);
    } catch (error) {
      console.error("[Resume Persistence] Autosave failed:", error);
    }
  }, AUTOSAVE_DEBOUNCE_MS);
}

/**
 * Clear all resume data
 */
export async function clearAllResumeData(): Promise<void> {
  try {
    // Clear IndexedDB
    if (isIndexedDBAvailable()) {
      await clearIndexedDB();
    }

    // Clear localStorage
    localStorage.removeItem(RESUME_KEY);
    localStorage.removeItem(BACKUP_KEY);
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
 * Check if resume data exists
 */
export async function hasStoredResume(): Promise<boolean> {
  try {
    if (isIndexedDBAvailable()) {
      const data = await loadFromIndexedDB(RESUME_KEY);
      if (data) return true;
    }
    return localStorage.getItem(RESUME_KEY) !== null;
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
