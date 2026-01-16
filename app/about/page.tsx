import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Briefcase, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Flotick Resume - AI Resume Builder by Flotick",
  description:
    "Learn about Flotick Resume, the free AI-powered resume builder. Discover how Flotick, an enterprise B2B work management platform, is helping professionals build better resumes.",
  alternates: {
    canonical: "https://resume.flotick.org/about",
  },
  openGraph: {
    title: "About Flotick Resume - AI Resume Builder by Flotick",
    description:
      "Flotick Resume is a free AI-powered resume builder developed by Flotick, an enterprise work management platform.",
    url: "https://resume.flotick.org/about",
    type: "website",
  },
};

export default function AboutPage() {
  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Flotick",
    url: "https://Flotick.com",
    logo: "https://Flotick.com/logo.png",
    description:
      "Flotick is an enterprise B2B work management platform that helps teams collaborate, manage projects, and streamline workflows. Flotick Resume is our free AI-powered resume builder.",
    sameAs: [
      "https://twitter.com/Flotick",
      "https://linkedin.com/company/Flotick",
    ],
    foundingDate: "2024",
    knowsAbout: [
      "Work Management",
      "Project Management",
      "Team Collaboration",
      "Enterprise Software",
      "AI Resume Builder",
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

    

      {/* Hero Section */}
      <section className="pt-26 bg-gradient-to-b from-blue-50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            About <span className="text-blue-600">Flotick Resume</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A free AI-powered resume builder from Flotick, designed to help
            professionals create job-winning resumes that pass ATS systems.
          </p>
        </div>
      </section>

      {/* What is Flotick Resume */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">What is Flotick Resume?</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>
              <strong className="text-foreground">Flotick Resume</strong> is a
              free, AI-powered resume builder that helps job seekers create
              professional, ATS-optimized resumes in minutes. Unlike traditional
              resume builders that simply provide templates, Flotick Resume uses
              advanced artificial intelligence to actively improve your resume
              content.
            </p>
            <p>
              Our AI technology can summarize your work experience, rewrite
              bullet points for maximum impact, analyze your LinkedIn profile
              for optimization suggestions, and tailor your resume for specific
              job descriptions. All of this is available completely free, with
              no sign-up required.
            </p>
            <p>
              Built with privacy in mind, Flotick Resume stores all your data
              locally on your device. Your personal information never leaves
              your browser, ensuring complete privacy and security.
            </p>
          </div>
        </div>
      </section>

      {/* About Flotick */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">About Flotick</h2>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>
              <strong className="text-foreground">Flotick</strong> is an
              enterprise B2B work management platform designed to help
              organizations streamline their workflows, manage projects, and
              improve team collaboration.
            </p>
            <p>
              Founded with the mission to make work more efficient, Flotick
              provides tools that help teams of all sizes accomplish more. From
              project tracking and task management to team communication and
              workflow automation, Flotick offers a comprehensive suite of
              enterprise-grade solutions.
            </p>
            <p>
              Flotick Resume is part of our commitment to helping professionals
              succeed at every stage of their career. By offering free,
              high-quality career tools, we aim to democratize access to
              professional resources that were previously available only to
              those who could afford expensive services.
            </p>
          </div>
          <div className="mt-8">
            <a
              href="https://Flotick.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              Learn more about Flotick <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">
            Why Choose Flotick Resume?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <Briefcase className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Writing</h3>
              <p className="text-muted-foreground">
                Our AI helps you write compelling content that highlights your
                achievements and skills in the most impactful way.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card">
              <Users className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">ATS-Optimized</h3>
              <p className="text-muted-foreground">
                Every template is designed to pass Applicant Tracking Systems,
                ensuring your resume reaches human recruiters.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card">
              <Globe className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Free</h3>
              <p className="text-muted-foreground">
                No hidden fees, no premium tiers, no subscriptions. Create
                unlimited resumes and download them for free.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card">
              <Building2 className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enterprise Quality</h3>
              <p className="text-muted-foreground">
                Built by Flotick with the same quality and attention to detail
                that enterprise clients expect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Resume?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of professionals who use Flotick Resume to create
            job-winning resumes. It&apos;s free, fast, and powered by AI.
          </p>
          <Link href="/builder">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-white hover:bg-white/90"
            >
              Start Building Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

    
    </main>
  );
}
