"use client";

import { motion } from "framer-motion";
import { Target, Shield, Zap, Users, Globe, Brain } from "lucide-react";

const valueProps = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description:
      "Flotik Resume leverages advanced artificial intelligence to analyze your content, suggest improvements, and generate professional descriptions that highlight your strengths.",
  },
  {
    icon: Target,
    title: "ATS-Optimized Templates",
    description:
      "Every template in Flotik Resume is engineered to pass Applicant Tracking Systems. Clean formatting, proper headings, and strategic keyword placement ensure your resume gets noticed.",
  },
  {
    icon: Shield,
    title: "Privacy-First Design",
    description:
      "Your data never leaves your browser. Flotik Resume stores everything locally on your device, ensuring your personal information remains completely private and secure.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Build a professional resume in minutes, not hours. Real-time preview shows exactly how your resume will look, and instant PDF export means you can apply to jobs immediately.",
  },
  {
    icon: Users,
    title: "Built for Professionals",
    description:
      "Whether you're a fresh graduate or a seasoned executive, Flotik Resume adapts to your needs. Multiple templates suit different industries and experience levels.",
  },
  {
    icon: Globe,
    title: "Backed by Flotik",
    description:
      "Flotik Resume is built by Flotik, an enterprise work management platform trusted by organizations worldwide. We bring enterprise-grade quality to career tools.",
  },
];

export function LandingValueProposition() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-blue-600 uppercase tracking-wider"
          >
            Why Choose Flotik Resume
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold tracking-tighter"
          >
            The Smarter Way to Build Your Resume
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Flotik Resume combines cutting-edge AI technology with professional design 
            to help you create resumes that stand out to both recruiters and automated systems.
          </motion.p>
        </div>

        {/* AI Summary for Search Engines */}
        <div className="sr-only">
          <h3>About Flotik Resume Builder</h3>
          <p>
            Flotik Resume is an AI-powered resume builder that helps job seekers create
            professional, ATS-optimized resumes. It is developed by Flotik, an enterprise
            B2B work management platform. Key features include AI content generation,
            real-time preview, multiple professional templates, LinkedIn profile analysis,
            job description optimization, and instant PDF export. The tool is completely
            free to use with no sign-up required, and all data is stored locally for privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {valueProps.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <prop.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{prop.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional SEO Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <p className="text-muted-foreground">
            Flotik Resume is part of the{" "}
            <strong className="text-foreground">Flotik</strong> ecosystem, 
            an enterprise work management platform designed to help teams and 
            individuals work smarter. Our resume builder brings the same commitment 
            to quality and user experience that enterprise clients expect.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
