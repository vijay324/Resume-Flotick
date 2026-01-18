import React from 'react';
import type { ResumeData, TemplateType } from '@/types/resume';
import { ProfessionalPdf } from './professional-pdf';
import { AtsPdf } from './ats-pdf';

interface Props {
  data: ResumeData;
  template: TemplateType;
}

// Main PDF Document Manager
export const PdfDocument = ({ data, template }: Props) => {
  switch (template) {
    case 'ats':
      return <AtsPdf data={data} />;
    case 'professional':
      return <ProfessionalPdf data={data} />;
    default:
      return <AtsPdf data={data} />;
  }
};
