import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { AIProvider } from "@/context/ai-context";
import { ResumeProvider } from "@/context/resume-context";
import { RoleProfileProvider } from "@/context/role-profile-context";
import { SiteLayout } from "@/components/site-layout";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resume.flotick.org"),
  title: {
    default: "Flotick Resume - AI-Powered Resume Builder | Create Professional Resumes",
    template: "%s | Flotick Resume - AI Resume Builder",
  },
  description: "Create professional, ATS-optimized resumes with Flotick Resume, the AI-powered resume builder from Flotick. Build job-winning resumes in minutes with intelligent content suggestions, real-time preview, and instant PDF export. 100% free, no sign-up required.",
  keywords: [
    "Flotick Resume",
    "Flotick resume builder", 
    "AI resume builder",
    "AI resume builder Flotick",
    "resume builder",
    "free resume maker",
    "professional resume builder",
    "ATS-friendly resume",
    "ATS resume builder",
    "CV maker",
    "resume creator",
    "job resume builder",
    "Flotick",
    "Flotik", 
    "Flotik resume",
    "enterprise resume builder",
    "AI CV builder",
    "resume generator",
    "online resume builder",
    "resume optimization",
    "resume writer AI"
  ],
  authors: [{ name: "Flotick", url: "https://Flotick.com" }],
  creator: "Flotick",
  publisher: "Flotick",
  applicationName: "Flotick Resume",
  category: "Business",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resume.flotick.org",
    title: "Flotick Resume - AI-Powered Resume Builder",
    description: "Build job-winning resumes in minutes with Flotick's free AI resume builder. ATS-friendly templates, expert content suggestions, and instant PDF download.",
    siteName: "Flotick Resume",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Flotick Resume - AI-Powered Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flotick Resume - AI-Powered Resume Builder",
    description: "Create professional, ATS-optimized resumes with Flotick's AI-powered resume builder. Free, fast, and intelligent.",
    images: ["/og-image.jpg"],
    creator: "@Flotick",
    site: "@Flotick",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://resume.flotick.org",
  },
  other: {
    "google-site-verification": "", // Add verification code when available
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} antialiased`}
      >
        <AIProvider>
          <RoleProfileProvider>
            <ResumeProvider>
              <SiteLayout>{children}</SiteLayout>
              <Analytics />
            </ResumeProvider>
          </RoleProfileProvider>
        </AIProvider>
      </body>
    </html>
  );
}
