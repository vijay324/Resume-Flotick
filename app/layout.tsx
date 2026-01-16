import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AIProvider } from "@/context/ai-context";
import { ResumeProvider } from "@/context/resume-context";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resume.Flotick.com"),
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
    "enterprise resume builder",
    "AI CV builder",
    "resume generator",
    "online resume builder"
  ],
  authors: [{ name: "Flotick", url: "https://Flotick.com" }],
  creator: "Flotick",
  publisher: "Flotick",
  applicationName: "Flotick Resume",
  category: "Business",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resume.Flotick.com",
    title: "Flotick Resume - AI-Powered Resume Builder",
    description: "Build professional, ATS-optimized resumes with Flotick's AI-powered resume builder. Free templates, intelligent content suggestions, and instant PDF downloads.",
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
    canonical: "https://resume.Flotick.com",
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
          <ResumeProvider>{children}</ResumeProvider>
        </AIProvider>
      </body>
    </html>
  );
}
