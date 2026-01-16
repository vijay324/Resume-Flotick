/**
 * @fileoverview Unit tests for components/ui/label.tsx
 * Tests Label component rendering and attributes
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label", () => {
  describe("rendering", () => {
    it("should render label element", () => {
      render(<Label>Email</Label>);

      expect(screen.getByText("Email").tagName).toBe("LABEL");
    });

    it("should have correct displayName", () => {
      expect(Label.displayName).toBe("Label");
    });

    it("should render children correctly", () => {
      render(<Label>First Name</Label>);

      expect(screen.getByText("First Name")).toBeInTheDocument();
    });
  });

  describe("htmlFor attribute", () => {
    it("should set htmlFor attribute", () => {
      render(<Label htmlFor="email-input">Email</Label>);

      const label = screen.getByText("Email");
      expect(label).toHaveAttribute("for", "email-input");
    });

    it("should associate with input via htmlFor", () => {
      render(
        <>
          <Label htmlFor="test-input">Test Label</Label>
          <input id="test-input" type="text" />
        </>
      );

      const label = screen.getByText("Test Label");
      const input = screen.getByRole("textbox");

      expect(label).toHaveAttribute("for", "test-input");
      expect(input).toHaveAttribute("id", "test-input");
    });
  });

  describe("styling", () => {
    it("should have default text styling", () => {
      render(<Label>Styled Label</Label>);

      const label = screen.getByText("Styled Label");
      expect(label).toHaveClass("text-sm");
      expect(label).toHaveClass("font-medium");
    });

    it("should have peer-disabled styling", () => {
      render(<Label>Label</Label>);

      const label = screen.getByText("Label");
      expect(label).toHaveClass("peer-disabled:cursor-not-allowed");
      expect(label).toHaveClass("peer-disabled:opacity-70");
    });
  });

  describe("custom className", () => {
    it("should merge custom className with defaults", () => {
      render(<Label className="custom-label">Custom</Label>);

      const label = screen.getByText("Custom");
      expect(label).toHaveClass("custom-label");
      expect(label).toHaveClass("text-sm"); // Default class
    });

    it("should allow className to override defaults", () => {
      render(<Label className="text-lg">Large Label</Label>);

      const label = screen.getByText("Large Label");
      expect(label).toHaveClass("text-lg");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to label element", () => {
      const ref = React.createRef<HTMLLabelElement>();
      render(<Label ref={ref}>With Ref</Label>);

      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
      expect(ref.current?.tagName).toBe("LABEL");
    });
  });

  describe("HTML attributes", () => {
    it("should pass through aria attributes", () => {
      render(<Label aria-hidden="true">Hidden Label</Label>);

      const label = screen.getByText("Hidden Label");
      expect(label).toHaveAttribute("aria-hidden", "true");
    });

    it("should pass through data attributes", () => {
      render(<Label data-testid="form-label">Test</Label>);

      expect(screen.getByTestId("form-label")).toBeInTheDocument();
    });
  });

  describe("complex children", () => {
    it("should render complex children", () => {
      render(
        <Label>
          Email <span className="text-red-500">*</span>
        </Label>
      );

      expect(screen.getByText("*")).toBeInTheDocument();
      expect(screen.getByText("*")).toHaveClass("text-red-500");
    });
  });
});
