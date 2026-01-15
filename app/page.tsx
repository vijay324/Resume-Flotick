import { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingSocialProof } from "@/components/landing/social-proof";
import { LandingFeatures } from "@/components/landing/features";
import { LandingCTA } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Free AI Resume Builder - Create a Professional Resume Online",
  description: "Build a job-winning resume in minutes with Flotick's free AI resume builder. features professional templates, AI content suggestions, and instant PDF download.",
  alternates: {
    canonical: "https://resume.flotick.org",
  },
};

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Flotick Resume Builder",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "description": "AI-powered resume builder helping users create professional resumes with ease.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
    },
  };

  return (
    <main className="min-h-screen bg-background selection:bg-blue-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingNavbar />
      <LandingHero />
      <LandingSocialProof />
      <LandingFeatures />
      <LandingCTA />
      <LandingFooter />
    </main>
  );
}
