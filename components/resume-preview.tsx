"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { useTemplate } from "@/context/template-context";
import { ClassicTemplate, ProfessionalTemplate, ModernTemplate } from "@/components/templates";
import { PaginatedResume } from "@/components/paginated-resume";

export function ResumePreview() {
  const { resumeData } = useResume();
  const { templateType } = useTemplate();

  // Render the appropriate template based on selection
  const renderTemplate = () => {
    switch (templateType) {
      case "professional":
        return <ProfessionalTemplate resumeData={resumeData} />;
      case "modern":
        return <ModernTemplate resumeData={resumeData} />;
      case "classic":
      default:
        return <ClassicTemplate resumeData={resumeData} />;
    }
  };

  return (
    <PaginatedResume>
      {renderTemplate()}
    </PaginatedResume>
  );
}
