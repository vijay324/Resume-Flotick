# Security Documentation

## Overview

This resume builder is a **fully client-side, open-source application** designed with privacy and security as core principles. All data processing happens in your browser—no backend servers, no databases, no tracking.

## Threat Model

### What We Protect Against

| Threat | Mitigation |
|--------|------------|
| **XSS Attacks** | CSP headers, input sanitization, HTML escaping |
| **Clickjacking** | X-Frame-Options: DENY |
| **MIME Sniffing** | X-Content-Type-Options: nosniff |
| **Data Exposure** | Client-side encryption with Web Crypto API |
| **API Key Theft** | Encrypted storage, never transmitted to external servers |
| **Referrer Leakage** | Strict-Origin-When-Cross-Origin policy |

### Known Limitations (Open Source Transparency)

> ⚠️ **Important**: As a fully client-side app, certain security guarantees cannot be made:

1. **Browser Dev Tools Access**: Users with access to browser developer tools can potentially view encrypted data by inspecting the decryption process.

2. **Client-Side Encryption**: While we encrypt data at rest, the encryption key is browser-derived. A sophisticated attacker with access to the same browser context could theoretically decrypt data.

3. **No Server-Side Validation**: All validation is client-side only. This is by design for privacy, but means we rely on browser security.

## Data Storage

### Resume Data
- **Location**: Browser IndexedDB (primary) / LocalStorage (fallback)
- **Encryption**: AES-256-GCM via Web Crypto API
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Persistence**: Survives browser restarts, cleared only when user clears site data

### API Keys
- **Location**: Browser LocalStorage (encrypted)
- **Encryption**: Same AES-256-GCM encryption as resume data
- **Scope**: Keys remain on-device, never sent to our servers
- **Usage**: Sent directly to Google's Gemini API from your browser

## Security Controls

### HTTP Security Headers

```
Content-Security-Policy: default-src 'self'; script-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Input Sanitization

All user inputs are sanitized before storage/display:
- HTML entities escaped
- XSS patterns detected and blocked
- URLs validated (http/https only)
- Email/phone formats validated

### Encryption Details

```
Algorithm: AES-256-GCM (Authenticated Encryption)
Key Derivation: PBKDF2-SHA256, 100,000 iterations
IV: 12 bytes, randomly generated per encryption
Salt: 16 bytes, stored with encrypted data
```

## Data Lifecycle

```
┌─────────────────────────────────────────────────────┐
│                    User's Browser                    │
│                                                      │
│  ┌──────────────┐    ┌──────────────────────────┐  │
│  │   User Input  │───▶│   Sanitize & Validate    │  │
│  └──────────────┘    └──────────────────────────┘  │
│                               │                      │
│                               ▼                      │
│                      ┌──────────────┐               │
│                      │   Encrypt    │               │
│                      └──────────────┘               │
│                               │                      │
│         ┌─────────────────────┴──────────────┐      │
│         ▼                                    ▼      │
│  ┌──────────────┐                   ┌────────────┐  │
│  │  IndexedDB   │                   │ LocalStorage│  │
│  │  (Primary)   │                   │ (Backup)    │  │
│  └──────────────┘                   └────────────┘  │
│                                                      │
│  Data never leaves this box unless you export it    │
└─────────────────────────────────────────────────────┘
```

## Clearing Your Data

You can clear all stored data at any time:

1. **In-App**: Settings → Clear My Data (requires typing "DELETE" to confirm)
2. **Browser**: Clear site data for this domain
3. **Manual**: DevTools → Application → Clear Storage

## API Key Security

When you add a Gemini API key:

1. ✅ Key is validated format-wise locally
2. ✅ Key is encrypted with AES-256-GCM
3. ✅ Encrypted key stored in browser only
4. ✅ When used, key goes directly to Google's API
5. ❌ Key is **never** sent to our servers
6. ❌ Key is **never** logged or transmitted elsewhere

### Recommendations

- Use an API key with appropriate quota limits
- Regularly rotate your API keys
- Revoke keys if you suspect compromise

## Responsible Disclosure

Found a security issue? Please report it to the repository maintainers via GitHub Issues with the "security" label, or contact the maintainers directly.

## Third-Party Services

| Service | Purpose | Data Sent |
|---------|---------|-----------|
| Google Gemini API | AI features | Resume content, API key (your key, directly from browser) |
| Google Fonts | Typography | Standard font requests |

No analytics, no tracking, no cookies beyond essential functionality.

---

*Last updated: January 2026*
