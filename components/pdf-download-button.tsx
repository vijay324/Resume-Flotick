"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertCircle } from "lucide-react";
import type { ResumeData, TemplateType } from "@/types/resume";
import { PdfDocument } from "./pdf/pdf-document";

interface PdfDownloadButtonProps {
  resumeData: ResumeData;
  templateType: TemplateType;
}

/**
 * Detects if the user is on a mobile device
 */
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
         ('ontouchstart' in window) || 
         (navigator.maxTouchPoints > 0);
}

/**
 * Detects if the user is on iOS (iPhone, iPad, iPod)
 */
function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

/**
 * Downloads PDF with mobile-compatible fallback
 */
async function downloadPdfBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const isIOS = isIOSDevice();

  try {
    // Strategy 1: Try anchor element download (works on desktop and most Android browsers)
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // For iOS Safari, the download attribute is ignored, so we need to open in new tab
    // This allows the user to use the native iOS share/download functionality
    if (isIOS) {
      // Small delay to allow anchor click to potentially work first
      setTimeout(() => {
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          // Fallback if popup was blocked
          window.location.href = url;
        }
      }, 100);
      
      // Cleanup after longer delay for iOS
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } else {
      // Cleanup blob URL after download for non-iOS devices
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  } catch (error) {
    console.error('Download error:', error);
    URL.revokeObjectURL(url);
    throw error;
  }
}

export function PdfDownloadButton({ resumeData, templateType }: PdfDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      // Dynamically import pdf function
      const { pdf } = await import('@react-pdf/renderer');
      
      // Generate PDF document
      const document = <PdfDocument data={resumeData} template={templateType} />;
      const blob = await pdf(document).toBlob();
      
      // Generate filename
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      
      // Download with mobile-compatible strategy
      await downloadPdfBlob(blob, filename);
      
      setLoading(false);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF';
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (!isClient) {
    return (
       <Button 
          size="sm" 
          className="h-9 gap-2 shadow-lg hover:shadow-xl bg-zinc-900 hover:bg-black text-white rounded-full px-5 transition-all hover:-translate-y-0.5"
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
        className="h-9 gap-2 shadow-lg bg-red-600 hover:bg-red-700 text-white rounded-full px-5"
        onClick={handleDownload}
        title={error}
      >
        <AlertCircle className="h-3.5 w-3.5" />
        <span className="font-medium">Retry Download</span>
      </Button>
    );
  }

  return (
    <Button 
      size="sm" 
      className="h-9 gap-2 shadow-lg hover:shadow-xl bg-zinc-900 hover:bg-black text-white rounded-full px-5 transition-all hover:-translate-y-0.5"
      disabled={loading}
      onClick={handleDownload}
    >
       {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
       <span className="font-medium">{loading ? "Preparing..." : "Download PDF"}</span>
    </Button>
  );
}
