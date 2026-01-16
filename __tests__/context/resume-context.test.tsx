/**
 * @fileoverview Unit tests for context/resume-context.tsx
 * Tests ResumeContext provider and useResume hook
 */

import React from "react";
import { render, screen, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";

// Mock dependencies
jest.mock("../../lib/client/resume-persistence", () => ({
  loadResume: jest.fn().mockResolvedValue(null),
  debouncedSaveResume: jest.fn(),
  clearAllResumeData: jest.fn().mockResolvedValue(undefined),
  hasStoredResume: jest.fn().mockResolvedValue(false),
}));

jest.mock("@/hooks/use-keyboard-shortcuts", () => ({
  useKeyboardShortcuts: jest.fn(),
}));

import { ResumeProvider, useResume } from "@/context/resume-context";

// Simple wrapper for renderHook
const createWrapper = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <ResumeProvider>{children}</ResumeProvider>;
  };
};

describe("ResumeProvider", () => {
  it("should render children", async () => {
    await act(async () => {
      render(
        <ResumeProvider>
          <div data-testid="child">Content</div>
        </ResumeProvider>
      );
    });

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

describe("useResume hook", () => {
  it("should throw error when used outside provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useResume());
    }).toThrow("useResume must be used within a ResumeProvider");

    spy.mockRestore();
  });

  it("should provide resume data when inside provider", async () => {
    const { result } = renderHook(() => useResume(), {
      wrapper: createWrapper(),
    });

    // Wait for async initialization
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(result.current).toBeDefined();
    expect(result.current.resumeData).toBeDefined();
  });

  it("should have setResumeData function", async () => {
    const { result } = renderHook(() => useResume(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(typeof result.current.setResumeData).toBe("function");
  });

  it("should have updateSection function", async () => {
    const { result } = renderHook(() => useResume(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(typeof result.current.updateSection).toBe("function");
  });

  it("should have undo function", async () => {
    const { result } = renderHook(() => useResume(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(typeof result.current.undo).toBe("function");
  });

  it("should have redo function", async () => {
    const { result } = renderHook(() => useResume(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(typeof result.current.redo).toBe("function");
  });

  it("should have clearHistory function", async () => {
    const { result } = renderHook(() => useResume(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(typeof result.current.clearHistory).toBe("function");
  });

  it("should have clearAllData function", async () => {
    const { result } = renderHook(() => useResume(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(typeof result.current.clearAllData).toBe("function");
  });

  it("should have canUndo state", async () => {
    const { result } = renderHook(() => useResume(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(typeof result.current.canUndo).toBe("boolean");
  });

  it("should have canRedo state", async () => {
    const { result } = renderHook(() => useResume(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(typeof result.current.canRedo).toBe("boolean");
  });
});
