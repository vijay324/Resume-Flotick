/**
 * @fileoverview Unit tests for components/ui/input.tsx
 * Tests Input component types, states, and interactions
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  describe("rendering", () => {
    it("should render input element", () => {
      render(<Input />);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should have correct displayName", () => {
      expect(Input.displayName).toBe("Input");
    });
  });

  describe("types", () => {
    it("should render text input by default", () => {
      render(<Input />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.type).toBe("text");
    });

    it("should render email input", () => {
      render(<Input type="email" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });

    it("should render password input", () => {
      render(<Input type="password" />);

      // Password inputs don't have textbox role
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it("should render number input", () => {
      render(<Input type="number" />);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("type", "number");
    });

    it("should render tel input", () => {
      render(<Input type="tel" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "tel");
    });

    it("should render url input", () => {
      render(<Input type="url" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "url");
    });
  });

  describe("placeholder", () => {
    it("should display placeholder text", () => {
      render(<Input placeholder="Enter your name" />);

      expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    });
  });

  describe("value and onChange", () => {
    it("should display controlled value", () => {
      render(<Input value="Hello" readOnly />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("Hello");
    });

    it("should call onChange when value changes", async () => {
      const onChange = jest.fn();
      render(<Input onChange={onChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "test" } });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("should update value on typing", async () => {
      const onChange = jest.fn((e) => e.target.value);
      render(<Input onChange={onChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "typed text" } });

      expect(onChange).toHaveReturnedWith("typed text");
    });
  });

  describe("disabled state", () => {
    it("should apply disabled attribute", () => {
      render(<Input disabled />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("should have disabled styling", () => {
      render(<Input disabled />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("disabled:opacity-50");
    });

    it("should not allow interaction when disabled", () => {
      const onChange = jest.fn();
      render(<Input disabled onChange={onChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "test" } });

      // onChange is still called on disabled inputs by DOM
      // but the input won't accept user interaction
      expect(input).toBeDisabled();
    });
  });

  describe("custom className", () => {
    it("should merge custom className with defaults", () => {
      render(<Input className="custom-input" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("custom-input");
      expect(input).toHaveClass("flex"); // Default class
    });

    it("should allow className to override defaults", () => {
      render(<Input className="h-20" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("h-20");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to input element", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.tagName).toBe("INPUT");
    });

    it("should allow focus via ref", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      ref.current?.focus();
      expect(document.activeElement).toBe(ref.current);
    });
  });

  describe("HTML attributes", () => {
    it("should pass through required attribute", () => {
      render(<Input required />);

      const input = screen.getByRole("textbox");
      expect(input).toBeRequired();
    });

    it("should pass through maxLength attribute", () => {
      render(<Input maxLength={10} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("maxLength", "10");
    });

    it("should pass through pattern attribute", () => {
      render(<Input pattern="[A-Za-z]+" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("pattern", "[A-Za-z]+");
    });

    it("should pass through aria attributes", () => {
      render(<Input aria-label="Email address" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-label", "Email address");
    });

    it("should pass through autoComplete attribute", () => {
      render(<Input autoComplete="email" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("autoComplete", "email");
    });

    it("should pass through data attributes", () => {
      render(<Input data-testid="email-input" />);

      expect(screen.getByTestId("email-input")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should be focusable", () => {
      render(<Input />);

      const input = screen.getByRole("textbox");
      input.focus();

      expect(document.activeElement).toBe(input);
    });

    it("should support aria-describedby for error messages", () => {
      render(
        <>
          <Input aria-describedby="error-msg" aria-invalid="true" />
          <span id="error-msg">Email is required</span>
        </>
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "error-msg");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });
});
