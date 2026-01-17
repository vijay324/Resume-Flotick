import React from 'react';
import type { ResumeData, TemplateType } from '@/types/resume';
import { ProfessionalPdf } from './professional-pdf';
import { ClassicPdf } from './classic-pdf';
import { ModernPdf } from './modern-pdf';
import { AtsPdf } from './ats-pdf';

interface Props {
  data: ResumeData;
  template: TemplateType;
}

export const PdfDocument = ({ data, template }: Props) => {
  switch (template) {
    case 'ats':
      return <AtsPdf data={data} />;
    case 'professional':
      return <ProfessionalPdf data={data} />;
    case 'modern':
      return <ModernPdf data={data} />;
    case 'classic':
      return <ClassicPdf data={data} />;
    default:
      return <AtsPdf data={data} />;
  }
};
