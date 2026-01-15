/**
 * Client-Side Secure Storage
 * Uses Web Crypto API for encrypting data at rest in the browser
 *
 * Security Model:
 * - Keys derived from browser context (domain + random salt)
 * - AES-GCM for authenticated encryption
 * - Salt stored alongside encrypted data
 * - Protection against casual inspection, not sophisticated attacks
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const STORAGE_KEY_NAME = "resume_builder_encryption_key";

/**
 * Check if Web Crypto API is available
 */
export function isWebCryptoAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    window.crypto !== undefined &&
    window.crypto.subtle !== undefined
  );
}

/**
 * Generate a random salt for key derivation
 */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Generate a random IV for AES-GCM
 */
export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Derive an encryption key from a passphrase and salt
 * Uses PBKDF2 with 100,000 iterations
 */
export async function deriveKey(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  // Import the passphrase as key material
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  // Derive the actual encryption key
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Get or create the browser context key
 * This creates a unique key per browser/domain combination
 */
export async function getOrCreateContextKey(): Promise<{
  key: CryptoKey;
  salt: Uint8Array;
}> {
  // Try to load existing salt from localStorage
  const existingSalt = localStorage.getItem(`${STORAGE_KEY_NAME}_salt`);

  let salt: Uint8Array;
  if (existingSalt) {
    salt = base64ToBytes(existingSalt);
  } else {
    salt = generateSalt();
    localStorage.setItem(`${STORAGE_KEY_NAME}_salt`, bytesToBase64(salt));
  }

  // Derive key from domain + random component stored in localStorage
  let contextSecret = localStorage.getItem(`${STORAGE_KEY_NAME}_secret`);
  if (!contextSecret) {
    // Generate a random secret for this browser context
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    contextSecret = bytesToBase64(randomBytes);
    localStorage.setItem(`${STORAGE_KEY_NAME}_secret`, contextSecret);
  }

  // Combine with origin for domain binding
  const passphrase = `${window.location.origin}:${contextSecret}`;
  const key = await deriveKey(passphrase, salt);

  return { key, salt };
}

/**
 * Encrypt data using AES-GCM
 */
export async function encryptData(
  data: string,
  key: CryptoKey
): Promise<{ encrypted: string; iv: string }> {
  const iv = generateIV();
  const encodedData = new TextEncoder().encode(data);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: iv.buffer as ArrayBuffer },
    key,
    encodedData
  );

  return {
    encrypted: bytesToBase64(new Uint8Array(encryptedBuffer)),
    iv: bytesToBase64(iv),
  };
}

/**
 * Decrypt data using AES-GCM
 */
export async function decryptData(
  encrypted: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  const encryptedBytes = base64ToBytes(encrypted);
  const ivBytes = base64ToBytes(iv);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: ivBytes.buffer as ArrayBuffer },
    key,
    encryptedBytes.buffer as ArrayBuffer
  );

  return new TextDecoder().decode(decryptedBuffer);
}

/**
 * Convert Uint8Array to base64 string
 */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to Uint8Array
 */
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Convenience wrapper for encrypting JSON data
 */
export async function encryptJSON<T>(data: T): Promise<string> {
  if (!isWebCryptoAvailable()) {
    // Fallback: store as plain JSON (for older browsers)
    console.warn("Web Crypto not available, storing unencrypted");
    return JSON.stringify({ unencrypted: true, data });
  }

  const { key } = await getOrCreateContextKey();
  const jsonString = JSON.stringify(data);
  const { encrypted, iv } = await encryptData(jsonString, key);

  return JSON.stringify({ encrypted, iv, version: 1 });
}

/**
 * Convenience wrapper for decrypting JSON data
 */
export async function decryptJSON<T>(encryptedString: string): Promise<T> {
  const parsed = JSON.parse(encryptedString);

  // Handle unencrypted fallback
  if (parsed.unencrypted) {
    return parsed.data as T;
  }

  if (!isWebCryptoAvailable()) {
    throw new Error("Cannot decrypt: Web Crypto not available");
  }

  const { key } = await getOrCreateContextKey();
  const decrypted = await decryptData(parsed.encrypted, parsed.iv, key);
  return JSON.parse(decrypted) as T;
}

/**
 * Clear all encryption-related data from storage
 */
export function clearEncryptionKeys(): void {
  localStorage.removeItem(`${STORAGE_KEY_NAME}_salt`);
  localStorage.removeItem(`${STORAGE_KEY_NAME}_secret`);
}
