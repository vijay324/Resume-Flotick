"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { useTemplate } from "@/context/template-context";
import { ProfessionalTemplate, AtsTemplate } from "@/components/templates";
import { PaginatedResume } from "@/components/paginated-resume";

export function ResumePreview() {
  const { resumeData } = useResume();
  const { templateType } = useTemplate();

  // Render the appropriate template based on selection
  const renderTemplate = () => {
    switch (templateType) {
      case "professional":
        return <ProfessionalTemplate resumeData={resumeData} />;
      case "ats":
      default:
        return <AtsTemplate resumeData={resumeData} />;
    }
  };

  return (
    <PaginatedResume>
      {renderTemplate()}
    </PaginatedResume>
  );
}
