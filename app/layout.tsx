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
  metadataBase: new URL("https://resume.flotick.org"),
  title: {
    default: "Flotick Resume Builder - AI Powered Resume Creation",
    template: "%s | Flotick Resume Builder",
  },
  description: "Create a professional, ATS-friendly resume in minutes with Flotick's AI-powered resume builder. Free templates, real-time preview, and instant downloads.",
  keywords: ["resume builder", "ai resume builder", "free resume maker", "cv maker", "ats friendly resume", "flotick"],
  authors: [{ name: "Flotick" }],
  creator: "Flotick",
  publisher: "Flotick",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resume.flotick.org",
    title: "Flotick Resume Builder - Create Your Perfect Resume",
    description: "Build your professional resume in minutes with our AI-powered builder. ATS-friendly templates and real-time preview.",
    siteName: "Flotick Resume Builder",
    images: [
      {
        url: "/og-image.jpg", // I should ensure this exists or user knows to add it
        width: 1200,
        height: 630,
        alt: "Flotick Resume Builder Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flotick Resume Builder - AI Powered Resume Creation",
    description: "Create a professional, ATS-friendly resume in minutes with Flotick's AI-powered resume builder.",
    images: ["/og-image.jpg"],
    creator: "@flotick",
  },
  icons: {
    icon: "/favicon.ico",
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
