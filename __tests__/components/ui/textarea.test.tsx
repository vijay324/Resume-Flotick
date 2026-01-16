/**
 * @fileoverview Unit tests for components/ui/textarea.tsx
 * Tests Textarea component states and interactions
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Textarea } from "@/components/ui/textarea";

describe("Textarea", () => {
  describe("rendering", () => {
    it("should render textarea element", () => {
      render(<Textarea />);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should have correct displayName", () => {
      expect(Textarea.displayName).toBe("Textarea");
    });

    it("should have minimum height class", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("min-h-[80px]");
    });
  });

  describe("placeholder", () => {
    it("should display placeholder text", () => {
      render(<Textarea placeholder="Enter description" />);

      expect(
        screen.getByPlaceholderText("Enter description")
      ).toBeInTheDocument();
    });
  });

  describe("value and onChange", () => {
    it("should display controlled value", () => {
      render(<Textarea value="Hello World" readOnly />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("Hello World");
    });

    it("should call onChange when value changes", () => {
      const onChange = jest.fn();
      render(<Textarea onChange={onChange} />);

      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "new text" } });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("should handle multiline text", () => {
      const multilineText = "Line 1\nLine 2\nLine 3";
      render(<Textarea value={multilineText} readOnly />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(multilineText);
    });
  });

  describe("rows", () => {
    it("should accept rows attribute", () => {
      render(<Textarea rows={10} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "10");
    });
  });

  describe("disabled state", () => {
    it("should apply disabled attribute", () => {
      render(<Textarea disabled />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeDisabled();
    });

    it("should have disabled styling", () => {
      render(<Textarea disabled />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("disabled:opacity-50");
    });
  });

  describe("custom className", () => {
    it("should merge custom className with defaults", () => {
      render(<Textarea className="custom-textarea" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("custom-textarea");
      expect(textarea).toHaveClass("flex"); // Default class
    });

    it("should allow className to override defaults", () => {
      render(<Textarea className="min-h-[200px]" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("min-h-[200px]");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to textarea element", () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
      expect(ref.current?.tagName).toBe("TEXTAREA");
    });

    it("should allow focus via ref", () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);

      ref.current?.focus();
      expect(document.activeElement).toBe(ref.current);
    });
  });

  describe("HTML attributes", () => {
    it("should pass through required attribute", () => {
      render(<Textarea required />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeRequired();
    });

    it("should pass through maxLength attribute", () => {
      render(<Textarea maxLength={500} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("maxLength", "500");
    });

    it("should pass through aria attributes", () => {
      render(<Textarea aria-label="Description" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-label", "Description");
    });

    it("should pass through data attributes", () => {
      render(<Textarea data-testid="description-input" />);

      expect(screen.getByTestId("description-input")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should be focusable", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      textarea.focus();

      expect(document.activeElement).toBe(textarea);
    });
  });
});
