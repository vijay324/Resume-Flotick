import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Rate limiting - simple in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 submissions per hour per IP

// Feature feedback schema
const featureFeedbackSchema = z.object({
  rating: z.enum(["very-useful", "useful", "neutral", "not-useful", "not-used", ""]),
  comment: z.string().max(2000).optional(),
});

// Main feedback schema
const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  overallRating: z.number().min(1).max(5),
  features: z.object({
    "resume-builder": featureFeedbackSchema,
    "ai-optimization": featureFeedbackSchema,
    "linkedin-analyzer": featureFeedbackSchema,
    "job-description": featureFeedbackSchema,
    "overall-ai": featureFeedbackSchema,
  }),
  improvements: z.string().max(5000).optional(),
  issues: z.string().max(5000).optional(),
});

// Helper to get client IP
function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  return "unknown";
}

// Rate limit check
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count };
}

// Sanitize string input
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

// Feature name mapping
const FEATURE_NAMES: Record<string, string> = {
  "resume-builder": "Resume Builder",
  "ai-optimization": "AI Resume Optimization",
  "linkedin-analyzer": "LinkedIn Profile Analyzer",
  "job-description": "Job Description Optimization (DCI)",
  "overall-ai": "Overall AI Experience",
};

// Rating label mapping
const RATING_LABELS: Record<string, string> = {
  "very-useful": "⭐ Very Useful",
  "useful": "👍 Useful",
  "neutral": "😐 Neutral",
  "not-useful": "👎 Not Useful",
  "not-used": "⚪ Not Used",
};

// Generate star icons for rating
function getStarRating(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateCheck = checkRateLimit(clientIP);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { message: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const result = feedbackSchema.safeParse(body);

    if (!result.success) {
      console.error("Validation error:", result.error.flatten());
      return NextResponse.json(
        { message: "Invalid feedback data", errors: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, overallRating, features, improvements, issues } = result.data;

    // Check email configuration
    const emailUser = process.env.GMAIL_USER;
    const emailPass = process.env.GMAIL_APP_PASSWORD;
    const supportEmail = process.env.SUPPORT_EMAIL || "support@flotick.com";
    const companyName = process.env.COMPANY_NAME || "Flotick Resume";

    if (!emailUser || !emailPass) {
      console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Generate timestamp
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "long",
    });

    // Build feature feedback text for plain text version
    let featureFeedbackText = "";
    for (const [featureId, feedback] of Object.entries(features)) {
        const featureName = FEATURE_NAMES[featureId] || featureId;
        const ratingLabel = feedback.rating ? RATING_LABELS[feedback.rating] : "Not rated";
        const comment = feedback.comment ? sanitizeInput(feedback.comment) : "No comment";
        featureFeedbackText += `\n${featureName}\n  Rating: ${ratingLabel}\n  Comment: ${comment}\n`;
    }

    // Build email content
    const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Feedback</title>
        <!-- Force Light Mode -->
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <style>
          /* Force light mode styles */
          :root {
            color-scheme: light;
          }
          body {
            background-color: #f5f5f5 !important;
            color: #171717 !important;
          }
        </style>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #171717; margin: 0; padding: 0; background-color: #f5f5f5;">
        
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Minimal Header -->
          <div style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #f0f0f0;">
            <p style="margin: 0; font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">New Feedback Received</p>
            <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 600; color: #171717;">${companyName}</h1>
          </div>
          
          <div style="padding: 32px;">
            
            <!-- User Info (if provided) -->
            ${(name || email) ? `
              <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #f5f5f5;">
                <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #404040;">User Details</p>
                <div style="font-size: 14px; color: #171717;">
                  ${name ? `<strong>${sanitizeInput(name)}</strong>` : "Anonymous User"}
                  ${email ? `<br><span style="color: #525252;">${sanitizeInput(email)}</span>` : ""}
                </div>
              </div>
            ` : ""}

            <!-- Key Metrics -->
            <div style="display: flex; gap: 24px; margin-bottom: 32px;">
              <div style="flex: 1;">
                <p style="margin: 0; font-size: 13px; color: #737373;">Overall Rating</p>
                <div style="margin-top: 4px; display: flex; align-items: baseline; gap: 8px;">
                  <span style="font-size: 20px; font-weight: 600; color: #171717;">${overallRating}.0</span>
                  <span style="color: #f59e0b; font-size: 18px;">${"★".repeat(overallRating)}${"☆".repeat(5 - overallRating)}</span>
                </div>
              </div>
              <div style="flex: 1;">
                <p style="margin: 0; font-size: 13px; color: #737373;">Submitted</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 500; color: #171717;">${new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            <!-- Suggestion / Bug Report -->
            ${improvements ? `
            <div style="margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #404040;">💡 Suggestion</p>
              <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; font-size: 14px; color: #404040;">
                ${sanitizeInput(improvements || "")}
              </div>
            </div>` : ""}

            ${issues ? `
            <div style="margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #dc2626;">🐛 Bug Report</p>
              <div style="background-color: #fef2f2; padding: 16px; border-radius: 6px; font-size: 14px; color: #991b1b;">
                ${sanitizeInput(issues || "")}
              </div>
            </div>` : ""}

            <!-- Feature Breakdown Table -->
            <div>
              <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #404040;">Feature Ratings</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                ${Object.entries(features).map(([key, f]) => {
                  const label = RATING_LABELS[f.rating] || "—";
                  const name = FEATURE_NAMES[key] || key;
                  const hasComment = f.comment && f.comment.trim().length > 0;
                  
                  return `
                    <tr style="border-bottom: 1px solid #f5f5f5;">
                      <td style="padding: 12px 0; color: #404040; width: 40%; vertical-align: top;">${name}</td>
                      <td style="padding: 12px 0; text-align: right; vertical-align: top;">
                        <span style="display: inline-block; padding: 2px 8px; border-radius: 99px; background-color: #f3f4f6; color: #4b5563; font-size: 12px; font-weight: 500;">${label}</span>
                        ${hasComment ? `<div style="margin-top: 8px; text-align: left; font-size: 13px; color: #525252; background: #fafafa; padding: 8px; border-radius: 4px;">"${sanitizeInput(f.comment || "")}"</div>` : ""}
                      </td>
                    </tr>
                  `;
                }).join("")}
              </table>
            </div>

            <!-- Footer -->
            <div style="margin-top: 32px; border-top: 1px solid #f0f0f0; padding-top: 24px;">
              <p style="margin: 0; font-size: 11px; color: #a3a3a3; text-align: center;">
                Sent via ${companyName} Feedback API • IP: ${clientIP}
              </p>
            </div>
            
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
NEW FEEDBACK RECEIVED - ${companyName}
================================================

📅 Submitted: ${formattedDate}
1: ISO: ${timestamp}
🌐 IP: ${clientIP}
${(name || email) ? `\nUSER DETAILS\n------------\nName: ${name || "N/A"}\nEmail: ${email || "N/A"}\n` : ""}
⭐ OVERALL RATING
-----------------
${getStarRating(overallRating)} (${overallRating}/5)

📊 FEATURE-WISE FEEDBACK
------------------------
${featureFeedbackText}

💬 ADDITIONAL FEEDBACK
----------------------

What can we improve?
${improvements || "No response provided"}

Issues or Suggestions:
${issues || "No response provided"}

------------------------------------------------
This feedback was submitted via the ${companyName} feedback form.
    `;

    // Send email
    const mailOptions = {
      from: emailUser,
      to: supportEmail,
      subject: `Feedback of ${companyName} - ${overallRating}⭐ Rating`,
      text: emailText,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Feedback sent successfully" });
  } catch (error) {
    console.error("Error sending feedback:", error);
    return NextResponse.json(
      { message: "Failed to send feedback" },
      { status: 500 }
    );
  }
}
