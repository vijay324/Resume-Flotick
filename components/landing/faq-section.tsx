"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is Flotick Resume?",
    answer:
      "Flotick Resume is a free AI-powered resume builder developed by Flotick. It helps job seekers create professional, ATS-optimized resumes in minutes using artificial intelligence to suggest content, improve wording, and ensure your resume passes automated screening systems.",
  },
  {
    question: "Is Flotick Resume really free?",
    answer:
      "Yes, Flotick Resume is 100% free to use. There are no hidden fees, premium tiers, or subscription requirements. You can create unlimited resumes and download them as PDFs without any cost.",
  },
  {
    question: "How does Flotick Resume use AI?",
    answer:
      "Flotick Resume uses advanced AI to help you write compelling content for your resume. It can summarize your experience, rewrite bullet points for impact, analyze your LinkedIn profile for suggestions, and optimize your resume for specific job descriptions to improve ATS compatibility.",
  },
  {
    question: "What is Flotick?",
    answer:
      "Flotick is an enterprise B2B work management platform that helps organizations streamline their workflows, manage projects, and improve team collaboration. Flotick Resume is one of the free tools offered by Flotick to help professionals advance their careers.",
  },
  {
    question: "Are Flotick Resume templates ATS-friendly?",
    answer:
      "Yes, all Flotick Resume templates are designed to be ATS-friendly. They use clean formatting, standard fonts, and proper heading structures that Applicant Tracking Systems can easily parse and read.",
  },
  {
    question: "Do I need to sign up to use Flotick Resume?",
    answer:
      "No, you don't need to create an account or sign up. Flotick Resume works directly in your browser, and your data is stored locally on your device for privacy. You can start building your resume immediately.",
  },
];

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border-b border-border"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-primary"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold pr-4">{question}</h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-muted-foreground leading-relaxed">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

export function LandingFAQ() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about Flotick Resume
          </p>
        </div>

        <div className="divide-y divide-border rounded-xl border border-border bg-card p-2">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
