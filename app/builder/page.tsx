import { ResumeBuilder } from "@/components/resume-builder";
import { TemplateProvider } from "@/context/template-context";

export default function BuilderPage() {
  return (
    <TemplateProvider>
      <ResumeBuilder />
    </TemplateProvider>
  );
}
