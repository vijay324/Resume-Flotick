"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// A4 page dimensions in pixels at 96 DPI
// A4 = 210mm x 297mm
// At 96 DPI: 1mm ≈ 3.7795px
const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;
const MM_TO_PX = 3.7795; // Conversion factor at 96 DPI

// Page dimensions in pixels
export const PAGE_HEIGHT_PX = Math.floor(A4_HEIGHT_MM * MM_TO_PX); // ~1122px
export const PAGE_WIDTH_PX = Math.floor(A4_WIDTH_MM * MM_TO_PX);   // ~793px

// Content area with margins (40px padding on each side)
const MARGIN_PX = 50;
export const CONTENT_HEIGHT_PX = PAGE_HEIGHT_PX - (MARGIN_PX * 2); // ~1022px usable

interface UsePaginationResult {
  totalPages: number;
  contentRef: React.RefObject<HTMLDivElement | null>;
  measureContent: () => void;
}

/**
 * Custom hook to measure resume content and calculate page count.
 * Returns the total number of pages based on content height.
 */
export function usePagination(): UsePaginationResult {
  const [totalPages, setTotalPages] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  const measureContent = useCallback(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const pages = Math.ceil(contentHeight / CONTENT_HEIGHT_PX);
      setTotalPages(Math.max(1, pages));
    }
  }, []);

  useEffect(() => {
    measureContent();
    
    // Re-measure on resize
    const resizeObserver = new ResizeObserver(() => {
      measureContent();
    });
    
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [measureContent]);

  return { totalPages, contentRef, measureContent };
}

/**
 * Get the position and styling for page overflow indicator
 */
export function getPageBreakPosition(pageIndex: number): number {
  return (pageIndex + 1) * PAGE_HEIGHT_PX;
}
