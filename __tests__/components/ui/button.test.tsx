/**
 * @fileoverview Unit tests for components/ui/button.tsx
 * Tests Button component variants, sizes, states, and interactions
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  describe("rendering", () => {
    it("should render children correctly", () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole("button")).toHaveTextContent("Click me");
    });

    it("should have correct displayName", () => {
      expect(Button.displayName).toBe("Button");
    });
  });

  describe("variants", () => {
    it("should apply default variant classes", () => {
      render(<Button variant="default">Default</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary");
    });

    it("should apply outline variant classes", () => {
      render(<Button variant="outline">Outline</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("border");
    });

    it("should apply ghost variant classes", () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-accent");
    });

    it("should apply destructive variant classes", () => {
      render(<Button variant="destructive">Delete</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-destructive");
    });

    it("should use default variant when not specified", () => {
      render(<Button>No variant</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary");
    });
  });

  describe("sizes", () => {
    it("should apply default size classes", () => {
      render(<Button size="default">Default Size</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("px-4");
    });

    it("should apply small size classes", () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-9");
      expect(button).toHaveClass("px-3");
    });

    it("should apply large size classes", () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11");
      expect(button).toHaveClass("px-8");
    });

    it("should apply icon size classes", () => {
      render(<Button size="icon">🔧</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("w-10");
    });

    it("should use default size when not specified", () => {
      render(<Button>No size</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
    });
  });

  describe("states", () => {
    it("should apply disabled state", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:opacity-50");
    });

    it("should not fire click when disabled", () => {
      const onClick = jest.fn();
      render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      );

      fireEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("events", () => {
    it("should call onClick when clicked", () => {
      const onClick = jest.fn();
      render(<Button onClick={onClick}>Click me</Button>);

      fireEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should pass event to onClick handler", () => {
      const onClick = jest.fn();
      render(<Button onClick={onClick}>Click me</Button>);

      fireEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("custom className", () => {
    it("should merge custom className with default classes", () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
      expect(button).toHaveClass("inline-flex"); // Default class still present
    });

    it("should allow custom className to override defaults", () => {
      render(<Button className="px-10">Wide padding</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-10");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to button element", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>With Ref</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.tagName).toBe("BUTTON");
    });
  });

  describe("HTML attributes", () => {
    it("should pass through type attribute", () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should pass through aria attributes", () => {
      render(<Button aria-label="Close dialog">X</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Close dialog");
    });

    it("should pass through data attributes", () => {
      render(<Button data-testid="custom-button">Test</Button>);

      expect(screen.getByTestId("custom-button")).toBeInTheDocument();
    });
  });
});
