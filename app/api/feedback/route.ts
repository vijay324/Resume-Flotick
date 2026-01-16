import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Rate limiting - simple in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 submissions per hour per IP

// Feature feedback schema
const featureFeedbackSchema = z.object({
  rating: z.enum(["very-useful", "useful", "neutral", "not-useful", ""]),
  comment: z.string().max(2000).optional(),
});

// Main feedback schema
const feedbackSchema = z.object({
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
      return NextResponse.json(
        { message: "Invalid feedback data", errors: result.error.flatten() },
        { status: 400 }
      );
    }

    const { overallRating, features, improvements, issues } = result.data;

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

    // Build feature feedback HTML
    let featureFeedbackHTML = "";
    let featureFeedbackText = "";

    for (const [featureId, feedback] of Object.entries(features)) {
      const featureName = FEATURE_NAMES[featureId] || featureId;
      const ratingLabel = feedback.rating ? RATING_LABELS[feedback.rating] : "Not rated";
      const comment = feedback.comment ? sanitizeInput(feedback.comment) : "No comment";

      featureFeedbackHTML += `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px; font-weight: 600; vertical-align: top; width: 200px;">${featureName}</td>
          <td style="padding: 12px; vertical-align: top;">
            <div style="margin-bottom: 4px;"><strong>Rating:</strong> ${ratingLabel}</div>
            <div style="color: #666;"><strong>Comment:</strong> ${comment}</div>
          </td>
        </tr>
      `;

      featureFeedbackText += `\n${featureName}\n  Rating: ${ratingLabel}\n  Comment: ${comment}\n`;
    }

    // Build email content
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
        
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📬 New Feedback Received</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">${companyName} Builder</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
          
          <!-- Timestamp -->
          <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>📅 Submitted:</strong> ${formattedDate}<br>
              <strong>🕐 ISO:</strong> ${timestamp}<br>
              <strong>🌐 IP:</strong> ${clientIP}
            </p>
          </div>
          
          <!-- Overall Rating -->
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #1e293b;">⭐ Overall Rating</h2>
            <div style="font-size: 24px; color: #f59e0b;">${getStarRating(overallRating)}</div>
            <p style="margin: 8px 0 0 0; color: #64748b;">${overallRating} out of 5 stars</p>
          </div>
          
          <!-- Feature Feedback -->
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #1e293b;">📊 Feature-wise Feedback</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${featureFeedbackHTML}
            </table>
          </div>
          
          <!-- Additional Feedback -->
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #1e293b;">💬 Additional Feedback</h2>
            
            <div style="margin-bottom: 16px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">What can we improve?</h3>
              <p style="margin: 0; padding: 12px; background: #f8fafc; border-radius: 6px; border-left: 3px solid #3b82f6;">
                ${improvements ? sanitizeInput(improvements) : "<em style='color: #94a3b8;'>No response provided</em>"}
              </p>
            </div>
            
            <div>
              <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Issues or Suggestions</h3>
              <p style="margin: 0; padding: 12px; background: #f8fafc; border-radius: 6px; border-left: 3px solid #8b5cf6;">
                ${issues ? sanitizeInput(issues) : "<em style='color: #94a3b8;'>No response provided</em>"}
              </p>
            </div>
          </div>
          
          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin: 16px 0 0 0;">
            This feedback was submitted via the ${companyName} feedback form.
          </p>
        </div>
      </body>
      </html>
    `;

    const emailText = `
NEW FEEDBACK RECEIVED - ${companyName}
================================================

📅 Submitted: ${formattedDate}
🕐 ISO: ${timestamp}
🌐 IP: ${clientIP}

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
