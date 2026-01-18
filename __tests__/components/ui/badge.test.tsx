/**
 * @fileoverview Unit tests for components/ui/badge.tsx
 * Tests Badge component variants and styling
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  describe("rendering", () => {
    it("should render badge element", () => {
      render(<Badge>New</Badge>);

      expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("should render as div element", () => {
      render(<Badge>Badge</Badge>);

      const badge = screen.getByText("Badge");
      expect(badge.tagName).toBe("DIV");
    });

    it("should render children correctly", () => {
      render(<Badge>Active</Badge>);

      expect(screen.getByText("Active")).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("should apply default variant classes", () => {
      render(<Badge variant="default">Default</Badge>);

      const badge = screen.getByText("Default");
      expect(badge).toHaveClass("bg-indigo-600");
      expect(badge).toHaveClass("text-white");
    });

    it("should apply secondary variant classes", () => {
      render(<Badge variant="secondary">Secondary</Badge>);

      const badge = screen.getByText("Secondary");
      expect(badge).toHaveClass("bg-zinc-100");
      expect(badge).toHaveClass("text-zinc-900");
    });

    it("should apply destructive variant classes", () => {
      render(<Badge variant="destructive">Error</Badge>);

      const badge = screen.getByText("Error");
      expect(badge).toHaveClass("bg-red-500");
      expect(badge).toHaveClass("text-white");
    });

    it("should apply outline variant classes", () => {
      render(<Badge variant="outline">Outline</Badge>);

      const badge = screen.getByText("Outline");
      expect(badge).toHaveClass("text-zinc-900");
    });

    it("should use default variant when not specified", () => {
      render(<Badge>No Variant</Badge>);

      const badge = screen.getByText("No Variant");
      expect(badge).toHaveClass("bg-indigo-600");
    });
  });

  describe("styling", () => {
    it("should have base badge classes", () => {
      render(<Badge>Styled</Badge>);

      const badge = screen.getByText("Styled");
      expect(badge).toHaveClass("inline-flex");
      expect(badge).toHaveClass("items-center");
      expect(badge).toHaveClass("rounded-full");
      expect(badge).toHaveClass("text-xs");
      expect(badge).toHaveClass("font-semibold");
    });

    it("should have focus ring classes", () => {
      render(<Badge>Focusable</Badge>);

      const badge = screen.getByText("Focusable");
      expect(badge).toHaveClass("focus:outline-none");
      expect(badge).toHaveClass("focus:ring-2");
    });

    it("should have hover transition classes", () => {
      render(<Badge>Hover</Badge>);

      const badge = screen.getByText("Hover");
      expect(badge).toHaveClass("transition-colors");
    });
  });

  describe("custom className", () => {
    it("should merge custom className with defaults", () => {
      render(<Badge className="custom-badge">Custom</Badge>);

      const badge = screen.getByText("Custom");
      expect(badge).toHaveClass("custom-badge");
      expect(badge).toHaveClass("inline-flex"); // Default class
    });

    it("should allow className to override defaults", () => {
      render(<Badge className="px-4">Wide Badge</Badge>);

      const badge = screen.getByText("Wide Badge");
      expect(badge).toHaveClass("px-4");
    });
  });

  describe("HTML attributes", () => {
    it("should pass through aria attributes", () => {
      render(<Badge aria-label="Status indicator">Active</Badge>);

      const badge = screen.getByText("Active");
      expect(badge).toHaveAttribute("aria-label", "Status indicator");
    });

    it("should pass through data attributes", () => {
      render(<Badge data-testid="status-badge">Status</Badge>);

      expect(screen.getByTestId("status-badge")).toBeInTheDocument();
    });

    it("should pass through onClick handler", () => {
      const onClick = jest.fn();
      render(<Badge onClick={onClick}>Clickable</Badge>);

      const badge = screen.getByText("Clickable");
      badge.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("complex children", () => {
    it("should render with icon and text", () => {
      render(
        <Badge>
          <span data-testid="icon">✓</span>
          <span>Verified</span>
        </Badge>
      );

      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("Verified")).toBeInTheDocument();
    });
  });
});
