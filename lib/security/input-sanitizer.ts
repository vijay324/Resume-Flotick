/**
 * Input Sanitization Utilities
 * Prevents XSS and injection attacks in user-generated content
 */

/**
 * HTML entity encoding map
 */
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(input: string): string {
  if (typeof input !== "string") return "";
  return input.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Remove all HTML tags from input
 */
export function stripHtml(input: string): string {
  if (typeof input !== "string") return "";
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  // RFC 5322 compliant regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate URL format (http/https only)
 */
export function isValidUrl(url: string): boolean {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitize URL - allows relative paths and validates absolute URLs
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== "string") return "";
  const trimmed = url.trim();

  // Allow relative URLs
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
    return encodeURI(trimmed);
  }

  // Allow protocol-relative URLs with validation
  if (trimmed.startsWith("//")) {
    try {
      new URL(`https:${trimmed}`);
      return trimmed;
    } catch {
      return "";
    }
  }

  // Validate absolute URLs
  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) {
      return "";
    }
    return parsed.href;
  } catch {
    // Try adding https:// for URLs without protocol
    if (!trimmed.includes("://") && trimmed.includes(".")) {
      return sanitizeUrl(`https://${trimmed}`);
    }
    return "";
  }
}

/**
 * Sanitize phone number - remove all non-phone characters
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== "string") return "";
  // Allow digits, spaces, hyphens, parentheses, and plus
  return phone.replace(/[^\d\s\-()+ ]/g, "").trim();
}

/**
 * Detect potential XSS patterns in input
 */
export function containsXssPattern(input: string): boolean {
  if (typeof input !== "string") return false;

  const xssPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onerror, etc.
    /data:text\/html/gi,
    /expression\s*\(/gi, // CSS expression
    /vbscript:/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Sanitize general text input
 * - Strips HTML tags
 * - Removes control characters
 * - Trims whitespace
 */
export function sanitizeText(input: string, maxLength?: number): string {
  if (typeof input !== "string") return "";

  let sanitized = stripHtml(input);
  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  sanitized = sanitized.trim();

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitize rich text (allows safe HTML)
 * Whitelist approach - only allows specific safe tags
 */
export function sanitizeRichText(input: string): string {
  if (typeof input !== "string") return "";

  // Remove script tags and event handlers
  let sanitized = input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove javascript: and data: URLs
  sanitized = sanitized.replace(/href\s*=\s*(["'])?javascript:.*?\1/gi, "");
  sanitized = sanitized.replace(/src\s*=\s*(["'])?data:.*?\1/gi, "");

  return sanitized;
}

/**
 * Type-safe sanitization for resume fields
 */
export interface SanitizedResumeFields {
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
  text: string;
}

export function sanitizeResumeField(
  value: string,
  fieldType: keyof SanitizedResumeFields
): string {
  switch (fieldType) {
    case "email":
      return sanitizeText(value);
    case "phone":
      return sanitizePhone(value);
    case "website":
    case "linkedin":
    case "github":
      return sanitizeUrl(value);
    case "text":
    default:
      return sanitizeText(value);
  }
}
