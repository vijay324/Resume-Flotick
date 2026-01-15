import { Metadata } from "next";
import { ResumeBuilder } from "@/components/resume-builder";
import { TemplateProvider } from "@/context/template-context";

export const metadata: Metadata = {
  title: "Create Your Resume",
  description: "Use our AI-powered tools to build a professional resume in minutes. Choose from ATS-friendly templates and customize your content effortlessly.",
};

export default function BuilderPage() {
  return (
    <TemplateProvider>
      <ResumeBuilder />
    </TemplateProvider>
  );
}
