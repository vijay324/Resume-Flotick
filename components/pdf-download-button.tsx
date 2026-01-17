"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertCircle } from "lucide-react";
import type { ResumeData, TemplateType } from "@/types/resume";
import dynamic from "next/dynamic";
import { PdfDocument } from "./pdf/pdf-document";

// Dynamically import PDFDownloadLink to avoid SSR issues with @react-pdf/renderer
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button 
        size="sm" 
        className="h-9 gap-2 shadow-lg bg-gray-900 text-white rounded-full px-5 opacity-80 cursor-not-allowed"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="font-medium">Loading PDF...</span>
      </Button>
    ),
  }
);

interface PdfDownloadButtonProps {
  resumeData: ResumeData;
  templateType: TemplateType;
}

export function PdfDownloadButton({ resumeData, templateType }: PdfDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
       <Button 
          size="sm" 
          className="h-9 gap-2 shadow-lg hover:shadow-xl bg-gray-900 hover:bg-black text-white rounded-full px-5 transition-all hover:-translate-y-0.5"
          disabled
        >
           <Download className="h-3.5 w-3.5" /> 
           <span className="font-medium">Download PDF</span>
        </Button>
    );
  }

  if (error) {
    return (
      <Button 
        size="sm" 
        className="h-9 gap-2 shadow-lg bg-red-600 text-white rounded-full px-5 cursor-not-allowed"
        disabled
        title={error}
      >
        <AlertCircle className="h-3.5 w-3.5" />
        <span className="font-medium">PDF Error</span>
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<PdfDocument data={resumeData} template={templateType} />}
      fileName={`${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`}
      className="text-decoration-none"
    >
      {({ blob, url, loading, error: pdfError }) => {
        // Log errors for debugging
        if (pdfError) {
          console.error('PDF Generation Error:', pdfError);
          setError(pdfError.message || 'Failed to generate PDF');
        }

        return (
          <Button 
            size="sm" 
            className="h-9 gap-2 shadow-lg hover:shadow-xl bg-gray-900 hover:bg-black text-white rounded-full px-5 transition-all hover:-translate-y-0.5"
            disabled={loading}
          >
             {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
             <span className="font-medium">{loading ? "Preparing..." : "Download PDF"}</span>
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
}
