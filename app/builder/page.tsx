import { Metadata } from "next";
import { ResumeBuilder } from "@/components/resume-builder";
import { TemplateProvider } from "@/context/template-context";

export const metadata: Metadata = {
  title: "Build Your Resume - Free AI-Powered Resume Builder",
  description: "Create your professional resume with Flotik Resume's AI-powered builder. Features intelligent content suggestions, ATS-optimized templates, real-time preview, and instant PDF export. 100% free, no sign-up required.",
  alternates: {
    canonical: "https://resume.flotik.com/builder",
  },
  openGraph: {
    title: "Build Your Resume - Flotik Resume AI Builder",
    description: "Create professional, ATS-optimized resumes with AI-powered content suggestions. Free instant PDF export.",
    url: "https://resume.flotik.com/builder",
    type: "website",
  },
};

export default function BuilderPage() {
  // WebApplication schema for the builder tool
  const builderSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Flotik Resume Builder",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "url": "https://resume.flotik.com/builder",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI-powered content generation",
      "ATS-friendly templates",
      "Real-time preview",
      "Instant PDF export",
      "No sign-up required"
    ],
    "creator": {
      "@type": "Organization",
      "name": "Flotik"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(builderSchema) }}
      />
      <TemplateProvider>
        <ResumeBuilder />
      </TemplateProvider>
    </>
  );
}

