import React from 'react';
import type { ResumeData, TemplateType } from '@/types/resume';
import { ProfessionalPdf } from './professional-pdf';
import { ClassicPdf } from './classic-pdf';
import { ModernPdf } from './modern-pdf';

interface Props {
  data: ResumeData;
  template: TemplateType;
}

export const PdfDocument = ({ data, template }: Props) => {
  switch (template) {
    case 'professional':
      return <ProfessionalPdf data={data} />;
    case 'modern':
      return <ModernPdf data={data} />;
    case 'classic':
      return <ClassicPdf data={data} />;
    default:
      return <ProfessionalPdf data={data} />;
  }
};
