"use client";

import React, { useRef, useState, useEffect } from "react";
import { PAGE_HEIGHT_PX } from "@/hooks/use-pagination";

interface PaginatedResumeProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that displays resume content with visual page breaks.
 * This creates a WYSIWYG preview where content is shown across multiple
 * A4-sized pages with visible separators between them.
 */
export function PaginatedResume({ children }: PaginatedResumeProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const calculatePages = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        const pages = Math.ceil(height / PAGE_HEIGHT_PX);
        setPageCount(Math.max(1, pages));
      }
    };

    // Calculate initially
    calculatePages();

    // Re-calculate on window resize
    const handleResize = () => calculatePages();
    window.addEventListener("resize", handleResize);

    // Use ResizeObserver for content changes
    const resizeObserver = new ResizeObserver(calculatePages);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    // Use MutationObserver for DOM changes
    const mutationObserver = new MutationObserver(calculatePages);
    if (contentRef.current) {
      mutationObserver.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Generate page break indicators (hidden in print via CSS)
  const pageBreaks = [];
  for (let i = 1; i < pageCount; i++) {
    pageBreaks.push(
      <div
        key={`page-break-${i}`}
        className="page-break-indicator absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[210mm]"
        style={{ top: `${i * PAGE_HEIGHT_PX}px` }}
      >
        {/* Page break line */}
        <div className="relative h-8 flex items-center justify-center">
          {/* Dashed line */}
          <div 
            className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-blue-400/60"
            style={{ transform: "translateY(-50%)" }}
          />
          {/* Page indicator badge */}
          <div className="relative z-10 bg-blue-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full shadow-lg">
            Page {i} / {pageCount}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-pages-container relative w-[210mm] min-w-[210mm] mx-auto">
      {/* Page backgrounds - show multiple A4 sheets (hidden in print) */}
      <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none page-break-indicator flex flex-col items-center">
        {Array.from({ length: pageCount }).map((_, i) => (
          <div
            key={`page-bg-${i}`}
            className="absolute bg-white w-[210mm]"
            style={{
              top: `${i * PAGE_HEIGHT_PX + (i > 0 ? i * 32 : 0)}px`,
              height: `${PAGE_HEIGHT_PX}px`,
              boxShadow: i > 0 ? "0 -8px 24px -8px rgba(0,0,0,0.15)" : "none",
            }}
          />
        ))}
      </div>

      {/* Content container */}
      <div 
        ref={contentRef}
        className="relative z-10 w-[210mm] min-w-[210mm]"
        style={{
          // Add gap between pages for visual separation (removed in print)
          paddingBottom: pageCount > 1 ? `${(pageCount - 1) * 32}px` : 0,
        }}
      >
        {children}
      </div>

      {/* Page break indicators (hidden in print via CSS) */}
      {pageBreaks}

      {/* Page count indicator at bottom (hidden in print via CSS) */}
      {pageCount > 1 && (
        <div className="page-count-indicator sticky bottom-4 left-0 right-0 flex justify-center z-30 pointer-events-none">
          <div className="bg-zinc-900/80 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-full shadow-xl">
            {pageCount} page{pageCount > 1 ? "s" : ""} • A4 Format
          </div>
        </div>
      )}
    </div>
  );
}
