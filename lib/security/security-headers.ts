/**
 * Security Headers Configuration
 * Implements defense-in-depth headers for client-side protection
 */

/**
 * Content Security Policy for a client-side resume builder
 * - Allows inline styles for React/dynamic styling
 * - Allows Google Fonts for typography
 * - Restricts scripts to self and required CDNs
 * - Blocks all plugins and embeds
 */
export const contentSecurityPolicy = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Next.js requires these in dev
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "connect-src": [
    "'self'",
    "https://generativelanguage.googleapis.com", // Gemini API
  ],
  "frame-ancestors": ["'none'"],
  "form-action": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "upgrade-insecure-requests": [],
};

/**
 * Build CSP header string from policy object
 */
export function buildCSPHeader(
  policy: Record<string, string[]>,
  isDev = false
): string {
  const directives = Object.entries(policy)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(" ")}`;
    })
    .join("; ");

  return directives;
}

/**
 * All security headers to be applied
 */
export const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: buildCSPHeader(contentSecurityPolicy),
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

/**
 * Development-safe security headers (relaxed CSP for hot reload)
 */
export const devSecurityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];
