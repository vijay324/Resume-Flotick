/**
 * @fileoverview Unit tests for hooks/use-pagination.ts
 * Tests resume pagination and page calculation logic
 */

import { renderHook, act } from "@testing-library/react";
import {
  usePagination,
  getPageBreakPosition,
  PAGE_HEIGHT_PX,
  CONTENT_HEIGHT_PX,
} from "@/hooks/use-pagination";

describe("usePagination", () => {
  describe("initialization", () => {
    it("should initialize with totalPages as 1", () => {
      const { result } = renderHook(() => usePagination());

      expect(result.current.totalPages).toBe(1);
    });

    it("should return a contentRef", () => {
      const { result } = renderHook(() => usePagination());

      expect(result.current.contentRef).toBeDefined();
      expect(result.current.contentRef.current).toBeNull();
    });

    it("should return a measureContent function", () => {
      const { result } = renderHook(() => usePagination());

      expect(typeof result.current.measureContent).toBe("function");
    });
  });

  describe("page calculation", () => {
    it("should calculate pages based on content height", () => {
      const { result } = renderHook(() => usePagination());

      // Mock the contentRef with a scrollHeight
      Object.defineProperty(result.current.contentRef, "current", {
        value: {
          scrollHeight: CONTENT_HEIGHT_PX * 2.5, // 2.5 pages worth of content
        },
        writable: true,
      });

      act(() => {
        result.current.measureContent();
      });

      expect(result.current.totalPages).toBe(3);
    });

    it("should return at least 1 page", () => {
      const { result } = renderHook(() => usePagination());

      // Mock empty content
      Object.defineProperty(result.current.contentRef, "current", {
        value: {
          scrollHeight: 0,
        },
        writable: true,
      });

      act(() => {
        result.current.measureContent();
      });

      expect(result.current.totalPages).toBe(1);
    });

    it("should handle single page content", () => {
      const { result } = renderHook(() => usePagination());

      Object.defineProperty(result.current.contentRef, "current", {
        value: {
          scrollHeight: CONTENT_HEIGHT_PX * 0.5, // Half a page
        },
        writable: true,
      });

      act(() => {
        result.current.measureContent();
      });

      expect(result.current.totalPages).toBe(1);
    });

    it("should round up partial pages", () => {
      const { result } = renderHook(() => usePagination());

      Object.defineProperty(result.current.contentRef, "current", {
        value: {
          scrollHeight: CONTENT_HEIGHT_PX * 1.1, // Just over 1 page
        },
        writable: true,
      });

      act(() => {
        result.current.measureContent();
      });

      expect(result.current.totalPages).toBe(2);
    });

    it("should handle exactly N pages", () => {
      const { result } = renderHook(() => usePagination());

      Object.defineProperty(result.current.contentRef, "current", {
        value: {
          scrollHeight: CONTENT_HEIGHT_PX * 3, // Exactly 3 pages
        },
        writable: true,
      });

      act(() => {
        result.current.measureContent();
      });

      expect(result.current.totalPages).toBe(3);
    });

    it("should do nothing when contentRef is null", () => {
      const { result } = renderHook(() => usePagination());

      // contentRef.current is null by default
      const initialPages = result.current.totalPages;

      act(() => {
        result.current.measureContent();
      });

      expect(result.current.totalPages).toBe(initialPages);
    });
  });
});

describe("getPageBreakPosition", () => {
  it("should return correct position for first page break", () => {
    const position = getPageBreakPosition(0);
    expect(position).toBe(PAGE_HEIGHT_PX);
  });

  it("should return correct position for second page break", () => {
    const position = getPageBreakPosition(1);
    expect(position).toBe(PAGE_HEIGHT_PX * 2);
  });

  it("should return correct position for third page break", () => {
    const position = getPageBreakPosition(2);
    expect(position).toBe(PAGE_HEIGHT_PX * 3);
  });

  it("should scale linearly with page index", () => {
    const position1 = getPageBreakPosition(0);
    const position2 = getPageBreakPosition(1);
    const position3 = getPageBreakPosition(2);

    expect(position2 - position1).toBe(PAGE_HEIGHT_PX);
    expect(position3 - position2).toBe(PAGE_HEIGHT_PX);
  });
});

describe("page dimension constants", () => {
  it("should have valid PAGE_HEIGHT_PX", () => {
    expect(PAGE_HEIGHT_PX).toBeGreaterThan(0);
    // A4 at 96 DPI should be around 1122px
    expect(PAGE_HEIGHT_PX).toBeGreaterThan(1000);
    expect(PAGE_HEIGHT_PX).toBeLessThan(1200);
  });

  it("should have valid CONTENT_HEIGHT_PX", () => {
    expect(CONTENT_HEIGHT_PX).toBeGreaterThan(0);
    expect(CONTENT_HEIGHT_PX).toBeLessThan(PAGE_HEIGHT_PX);
  });

  it("should have reasonable margin between page and content height", () => {
    const margin = PAGE_HEIGHT_PX - CONTENT_HEIGHT_PX;
    // Margin should be reasonable (50px padding on each side = 100px total)
    expect(margin).toBeGreaterThanOrEqual(80);
    expect(margin).toBeLessThanOrEqual(150);
  });
});
