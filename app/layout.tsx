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
  title: "AI-Powered Resume Builder",
  description: "Build your perfect resume with AI assistance",
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
