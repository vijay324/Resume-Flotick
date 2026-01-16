/**
 * @fileoverview Unit tests for lib/security/input-sanitizer.ts
 * Tests XSS prevention and input sanitization utilities
 */

import {
  escapeHtml,
  stripHtml,
  isValidEmail,
  isValidUrl,
  sanitizeUrl,
  sanitizePhone,
  containsXssPattern,
  sanitizeText,
  sanitizeRichText,
  sanitizeResumeField,
} from "@/lib/security/input-sanitizer";

describe("escapeHtml", () => {
  it("should escape ampersand", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("should escape less than", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("should escape greater than", () => {
    expect(escapeHtml("a > b")).toBe("a &gt; b");
  });

  it("should escape double quotes", () => {
    expect(escapeHtml('He said "hello"')).toBe("He said &quot;hello&quot;");
  });

  it("should escape single quotes", () => {
    expect(escapeHtml("It's fine")).toBe("It&#x27;s fine");
  });

  it("should escape forward slash", () => {
    expect(escapeHtml("path/to/file")).toBe("path&#x2F;to&#x2F;file");
  });

  it("should escape backtick", () => {
    expect(escapeHtml("`code`")).toBe("&#x60;code&#x60;");
  });

  it("should escape equals sign", () => {
    expect(escapeHtml("a=b")).toBe("a&#x3D;b");
  });

  it("should handle multiple special characters", () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;"
    );
  });

  it("should return empty string for non-string input", () => {
    expect(escapeHtml(123 as unknown as string)).toBe("");
    expect(escapeHtml(null as unknown as string)).toBe("");
    expect(escapeHtml(undefined as unknown as string)).toBe("");
  });

  it("should return unchanged string when no special characters", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });
});

describe("stripHtml", () => {
  it("should remove simple HTML tags", () => {
    expect(stripHtml("<p>Hello</p>")).toBe("Hello");
  });

  it("should remove nested tags", () => {
    expect(stripHtml("<div><span>Content</span></div>")).toBe("Content");
  });

  it("should remove self-closing tags", () => {
    expect(stripHtml("Line 1<br/>Line 2")).toBe("Line 1Line 2");
  });

  it("should remove tags with attributes", () => {
    expect(stripHtml('<a href="http://example.com">Link</a>')).toBe("Link");
  });

  it("should remove script tags", () => {
    expect(stripHtml("<script>alert('xss')</script>Safe")).toBe(
      "alert('xss')Safe"
    );
  });

  it("should return empty string for non-string input", () => {
    expect(stripHtml(null as unknown as string)).toBe("");
    expect(stripHtml(undefined as unknown as string)).toBe("");
  });

  it("should handle text without HTML", () => {
    expect(stripHtml("Plain text")).toBe("Plain text");
  });
});

describe("isValidEmail", () => {
  it("should validate correct email formats", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("user.name@example.com")).toBe(true);
    expect(isValidEmail("user+tag@example.com")).toBe(true);
    expect(isValidEmail("user@sub.example.com")).toBe(true);
  });

  it("should reject invalid email formats", () => {
    expect(isValidEmail("invalid")).toBe(false);
    expect(isValidEmail("invalid@")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("user@.com")).toBe(false);
    expect(isValidEmail("user example.com")).toBe(false);
  });

  it("should trim whitespace before validation", () => {
    expect(isValidEmail("  user@example.com  ")).toBe(true);
  });

  it("should return false for non-string input", () => {
    expect(isValidEmail(null as unknown as string)).toBe(false);
    expect(isValidEmail(undefined as unknown as string)).toBe(false);
    expect(isValidEmail(123 as unknown as string)).toBe(false);
  });
});

describe("isValidUrl", () => {
  it("should validate http URLs", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
    expect(isValidUrl("http://www.example.com/path")).toBe(true);
  });

  it("should validate https URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("https://example.com/path?query=1")).toBe(true);
  });

  it("should reject non-http/https protocols", () => {
    expect(isValidUrl("ftp://example.com")).toBe(false);
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("data:text/html,<script>")).toBe(false);
  });

  it("should reject invalid URLs", () => {
    expect(isValidUrl("not a url")).toBe(false);
    expect(isValidUrl("example.com")).toBe(false); // No protocol
  });

  it("should return false for non-string input", () => {
    expect(isValidUrl(null as unknown as string)).toBe(false);
    expect(isValidUrl(undefined as unknown as string)).toBe(false);
  });
});

describe("sanitizeUrl", () => {
  it("should return valid http/https URLs unchanged", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com/");
    expect(sanitizeUrl("http://example.com/path")).toBe(
      "http://example.com/path"
    );
  });

  it("should allow relative URLs starting with /", () => {
    expect(sanitizeUrl("/path/to/page")).toBe("/path/to/page");
  });

  it("should allow anchor URLs starting with #", () => {
    expect(sanitizeUrl("#section")).toBe("#section");
  });

  it("should allow protocol-relative URLs", () => {
    expect(sanitizeUrl("//example.com/path")).toBe("//example.com/path");
  });

  it("should allow mailto URLs", () => {
    expect(sanitizeUrl("mailto:user@example.com")).toBe(
      "mailto:user@example.com"
    );
  });

  it("should add https:// to URLs without protocol", () => {
    expect(sanitizeUrl("example.com")).toBe("https://example.com/");
    expect(sanitizeUrl("www.example.com/path")).toBe(
      "https://www.example.com/path"
    );
  });

  it("should reject javascript: protocol", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
  });

  it("should reject data: protocol", () => {
    expect(sanitizeUrl("data:text/html,<script>")).toBe("");
  });

  it("should return empty string for non-string input", () => {
    expect(sanitizeUrl(null as unknown as string)).toBe("");
    expect(sanitizeUrl(undefined as unknown as string)).toBe("");
  });

  it("should return empty string for invalid URLs", () => {
    expect(sanitizeUrl("not a valid url at all")).toBe("");
  });
});

describe("sanitizePhone", () => {
  it("should keep valid phone characters", () => {
    expect(sanitizePhone("+1 (555) 123-4567")).toBe("+1 (555) 123-4567");
  });

  it("should remove invalid characters", () => {
    expect(sanitizePhone("+1-555-123-4567<script>")).toBe("+1-555-123-4567");
  });

  it("should handle international formats", () => {
    expect(sanitizePhone("+44 20 7946 0958")).toBe("+44 20 7946 0958");
  });

  it("should trim whitespace", () => {
    expect(sanitizePhone("  555-1234  ")).toBe("555-1234");
  });

  it("should return empty string for non-string input", () => {
    expect(sanitizePhone(null as unknown as string)).toBe("");
    expect(sanitizePhone(undefined as unknown as string)).toBe("");
  });
});

describe("containsXssPattern", () => {
  it("should detect script tags", () => {
    expect(containsXssPattern("<script>alert('xss')</script>")).toBe(true);
  });

  it("should detect javascript: protocol", () => {
    expect(containsXssPattern("<a href='javascript:alert(1)'>")).toBe(true);
  });

  it("should detect event handlers", () => {
    expect(containsXssPattern('<img onerror="alert(1)">')).toBe(true);
    expect(containsXssPattern('<div onclick="danger()">')).toBe(true);
    expect(containsXssPattern("<body onload=alert(1)>")).toBe(true);
  });

  it("should detect data:text/html", () => {
    expect(containsXssPattern('data:text/html,<script>alert(1)</script>')).toBe(
      true
    );
  });

  it("should detect CSS expression", () => {
    expect(containsXssPattern("expression(alert(1))")).toBe(true);
  });

  it("should detect vbscript", () => {
    expect(containsXssPattern("vbscript:msgbox(1)")).toBe(true);
  });

  it("should return false for safe content", () => {
    expect(containsXssPattern("Hello, world!")).toBe(false);
    expect(containsXssPattern("This is a <b>bold</b> statement")).toBe(false);
  });

  it("should return false for non-string input", () => {
    expect(containsXssPattern(null as unknown as string)).toBe(false);
    expect(containsXssPattern(undefined as unknown as string)).toBe(false);
  });
});

describe("sanitizeText", () => {
  it("should strip HTML tags", () => {
    expect(sanitizeText("<p>Hello</p>")).toBe("Hello");
  });

  it("should remove control characters", () => {
    expect(sanitizeText("Hello\x00World")).toBe("HelloWorld");
  });

  it("should preserve newlines and tabs", () => {
    expect(sanitizeText("Line 1\nLine 2\tTabbed")).toBe(
      "Line 1\nLine 2\tTabbed"
    );
  });

  it("should trim whitespace", () => {
    expect(sanitizeText("  Hello World  ")).toBe("Hello World");
  });

  it("should respect maxLength", () => {
    expect(sanitizeText("Hello World", 5)).toBe("Hello");
  });

  it("should return empty string for non-string input", () => {
    expect(sanitizeText(null as unknown as string)).toBe("");
    expect(sanitizeText(undefined as unknown as string)).toBe("");
  });
});

describe("sanitizeRichText", () => {
  it("should remove script tags", () => {
    expect(sanitizeRichText("<p>Safe</p><script>evil()</script>")).toBe(
      "<p>Safe</p>"
    );
  });

  it("should remove event handlers", () => {
    expect(sanitizeRichText('<div onclick="evil()">Content</div>')).toBe(
      "<div >Content</div>"
    );
  });

  it("should remove javascript: URLs", () => {
    expect(sanitizeRichText('<a href="javascript:alert(1)">Link</a>')).toBe(
      "<a >Link</a>"
    );
  });

  it("should remove data: src attributes", () => {
    expect(sanitizeRichText('<img src="data:text/html,evil">')).toBe("<img >");
  });

  it("should preserve safe HTML", () => {
    expect(sanitizeRichText("<p>Hello <strong>World</strong></p>")).toBe(
      "<p>Hello <strong>World</strong></p>"
    );
  });

  it("should return empty string for non-string input", () => {
    expect(sanitizeRichText(null as unknown as string)).toBe("");
    expect(sanitizeRichText(undefined as unknown as string)).toBe("");
  });
});

describe("sanitizeResumeField", () => {
  it("should route email to sanitizeText", () => {
    expect(sanitizeResumeField("<script>user@example.com", "email")).toBe(
      "user@example.com"
    );
  });

  it("should route phone to sanitizePhone", () => {
    expect(sanitizeResumeField("+1 (555) 123-4567", "phone")).toBe(
      "+1 (555) 123-4567"
    );
  });

  it("should route website to sanitizeUrl", () => {
    expect(sanitizeResumeField("example.com", "website")).toBe(
      "https://example.com/"
    );
  });

  it("should route linkedin to sanitizeUrl", () => {
    expect(sanitizeResumeField("linkedin.com/in/user", "linkedin")).toBe(
      "https://linkedin.com/in/user"
    );
  });

  it("should route github to sanitizeUrl", () => {
    expect(sanitizeResumeField("github.com/user", "github")).toBe(
      "https://github.com/user"
    );
  });

  it("should route text to sanitizeText", () => {
    expect(sanitizeResumeField("<b>Bold</b>", "text")).toBe("Bold");
  });
});
