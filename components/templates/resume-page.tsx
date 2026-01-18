"use client";

import React from "react";

interface ResumePageProps {
  children: React.ReactNode;
  pageNumber?: number;
  showPageNumber?: boolean;
}

/**
 * A4-sized page wrapper component for resume pagination.
 * Displays content within exact A4 dimensions in preview,
 * and ensures proper page breaks when printing/downloading.
 */
export function ResumePage({ 
  children, 
  pageNumber = 1,
  showPageNumber = false 
}: ResumePageProps) {
  return (
    <div 
      className="resume-page bg-white relative"
      style={{
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
      }}
    >
      {children}
      
      {/* Page number indicator (preview only, hidden via CSS @media print) */}
      {showPageNumber && (
        <div className="page-number-indicator absolute bottom-2 right-4 text-[9pt] text-zinc-400">
          Page {pageNumber}
        </div>
      )}
    </div>
  );
}

/**
 * Visual separator between pages in preview mode.
 * Hidden when printing/downloading via CSS.
 */
export function PageBreakIndicator() {
  return <div className="page-separator" />;
}
