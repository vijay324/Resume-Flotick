import { Metadata } from "next";
import { LandingHero } from "@/components/landing/hero";
import { LandingSocialProof } from "@/components/landing/social-proof";
import { LandingFeatures } from "@/components/landing/features";
import { LandingCTA } from "@/components/landing/cta-section";
import { LandingFAQ } from "@/components/landing/faq-section";
import { LandingValueProposition } from "@/components/landing/value-proposition";

export const metadata: Metadata = {
  title: "Flotick Resume - Free AI Resume Builder | Create Professional Resumes Online",
  description: "Flotick Resume is a free AI-powered resume builder that helps you create professional, ATS-optimized resumes in minutes. Features intelligent content suggestions, real-time preview, and instant PDF export. Built by Flotick, the enterprise work management platform.",
  alternates: {
    canonical: "https://resume.Flotick.com",
  },
  openGraph: {
    title: "Flotick Resume - Free AI-Powered Resume Builder",
    description: "Create professional, ATS-optimized resumes with Flotick Resume. Free AI-powered resume builder with instant PDF export.",
    url: "https://resume.Flotick.com",
    type: "website",
  },
};

export default function LandingPage() {
  // Organization schema for Flotick parent company
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Flotick",
    "url": "https://Flotick.com",
    "logo": "https://Flotick.com/logo.png",
    "description": "Flotick is an enterprise B2B work management platform that helps teams collaborate, manage projects, and streamline workflows.",
    "sameAs": [
      "https://twitter.com/Flotick",
      "https://linkedin.com/company/Flotick"
    ],
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://Flotick.com/contact"
    }
  };

  // SoftwareApplication schema for Flotick Resume
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Flotick Resume",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Resume Builder",
    "operatingSystem": "Web",
    "url": "https://resume.Flotick.com",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "description": "Flotick Resume is an AI-powered resume builder that helps job seekers create professional, ATS-optimized resumes. Features include AI content suggestions, real-time preview, multiple templates, and instant PDF export.",
    "featureList": [
      "AI-powered content suggestions",
      "ATS-friendly templates",
      "Real-time preview",
      "Instant PDF export",
      "LinkedIn profile analysis",
      "Multiple professional templates",
      "No sign-up required",
      "100% free"
    ],
    "creator": {
      "@type": "Organization",
      "name": "Flotick",
      "url": "https://Flotick.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "screenshot": "https://resume.Flotick.com/og-image.jpg"
  };

  // Product schema for commercial positioning
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Flotick Resume Builder",
    "description": "AI-powered resume builder from Flotick. Create professional resumes that pass ATS systems and impress recruiters.",
    "brand": {
      "@type": "Brand",
      "name": "Flotick"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "category": "Software > Business Software > Resume Builders"
  };

  // FAQ schema for common questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Flotick Resume?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Flotick Resume is a free AI-powered resume builder developed by Flotick. It helps job seekers create professional, ATS-optimized resumes in minutes using artificial intelligence to suggest content, improve wording, and ensure your resume passes automated screening systems."
        }
      },
      {
        "@type": "Question",
        "name": "Is Flotick Resume really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Flotick Resume is 100% free to use. There are no hidden fees, premium tiers, or subscription requirements. You can create unlimited resumes and download them as PDFs without any cost."
        }
      },
      {
        "@type": "Question",
        "name": "How does Flotick Resume use AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Flotick Resume uses advanced AI to help you write compelling content for your resume. It can summarize your experience, rewrite bullet points for impact, analyze your LinkedIn profile for suggestions, and optimize your resume for specific job descriptions to improve ATS compatibility."
        }
      },
      {
        "@type": "Question",
        "name": "What is Flotick?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Flotick is an enterprise B2B work management platform that helps organizations streamline their workflows, manage projects, and improve team collaboration. Flotick Resume is one of the free tools offered by Flotick to help professionals advance their careers."
        }
      },
      {
        "@type": "Question",
        "name": "Are Flotick Resume templates ATS-friendly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all Flotick Resume templates are designed to be ATS-friendly. They use clean formatting, standard fonts, and proper heading structures that Applicant Tracking Systems can easily parse and read."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to sign up to use Flotick Resume?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, you don't need to create an account or sign up. Flotick Resume works directly in your browser, and your data is stored locally on your device for privacy. You can start building your resume immediately."
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-background selection:bg-blue-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LandingHero />
      <LandingSocialProof />
      <LandingFeatures />
      <LandingValueProposition />
      <LandingFAQ />
      <LandingCTA />
    </main>
  );
}
