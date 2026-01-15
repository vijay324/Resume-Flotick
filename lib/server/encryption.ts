import crypto from "crypto";

/**
 * Server-side encryption utilities for API keys
 * Uses AES-256-GCM for authenticated encryption
 */

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Derives an encryption key from the master secret using PBKDF2
 */
function deriveKey(secret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(secret, salt, 100000, KEY_LENGTH, "sha512");
}

/**
 * Encrypts a plaintext string using AES-256-GCM
 * @param plaintext - The text to encrypt (e.g., API key)
 * @param masterSecret - The master encryption secret from environment
 * @returns Object containing encrypted data, IV, salt, and auth tag
 */
export function encrypt(
  plaintext: string,
  masterSecret: string
): {
  encrypted: string;
  iv: string;
  salt: string;
  tag: string;
} {
  // Generate random salt and IV
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  // Derive encryption key from master secret
  const key = deriveKey(masterSecret, salt);

  // Create cipher and encrypt
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Get authentication tag
  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    salt: salt.toString("hex"),
    tag: tag.toString("hex"),
  };
}

/**
 * Decrypts an encrypted string using AES-256-GCM
 * @param encrypted - The encrypted hex string
 * @param iv - The initialization vector (hex)
 * @param salt - The salt used for key derivation (hex)
 * @param tag - The authentication tag (hex)
 * @param masterSecret - The master encryption secret from environment
 * @returns The decrypted plaintext
 * @throws Error if decryption fails or authentication fails
 */
export function decrypt(
  encrypted: string,
  iv: string,
  salt: string,
  tag: string,
  masterSecret: string
): string {
  try {
    // Convert hex strings back to buffers
    const ivBuffer = Buffer.from(iv, "hex");
    const saltBuffer = Buffer.from(salt, "hex");
    const tagBuffer = Buffer.from(tag, "hex");

    // Derive the same encryption key
    const key = deriveKey(masterSecret, saltBuffer);

    // Create decipher and decrypt
    const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
    decipher.setAuthTag(tagBuffer);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    throw new Error("Decryption failed. The data may be corrupted or tampered with.");
  }
}

/**
 * Validates that an encryption secret is properly formatted
 */
export function validateEncryptionSecret(secret: string | undefined): void {
  if (!secret) {
    throw new Error(
      "ENCRYPTION_SECRET environment variable is not set. Please add it to your .env file."
    );
  }

  if (secret === "CHANGE_ME_TO_A_SECURE_RANDOM_STRING") {
    throw new Error(
      "Please change ENCRYPTION_SECRET in your .env file to a secure random string. " +
        "You can generate one with: openssl rand -base64 32"
    );
  }

  if (secret.length < 32) {
    throw new Error(
      "ENCRYPTION_SECRET must be at least 32 characters long for secure encryption."
    );
  }
}
