/**
 * @fileoverview Unit tests for components/ui/select.tsx
 * Tests custom Select component and its sub-components
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Helper to render Select with common setup
const renderSelect = (
  value = "",
  onValueChange = jest.fn(),
  options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]
) => {
  return render(
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

describe("Select", () => {
  describe("rendering", () => {
    it("should render the trigger button", () => {
      renderSelect();

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should display placeholder when no value selected", () => {
      renderSelect();

      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("should display selected value", () => {
      renderSelect("option1");

      expect(screen.getByText("option1")).toBeInTheDocument();
    });
  });

  describe("opening and closing", () => {
    it("should open dropdown when trigger is clicked", () => {
      renderSelect();

      const trigger = screen.getByRole("button");
      fireEvent.click(trigger);

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("should toggle dropdown on trigger click", () => {
      renderSelect();

      const trigger = screen.getByRole("button");

      // Open
      fireEvent.click(trigger);
      expect(screen.getByText("Option 1")).toBeInTheDocument();

      // Close
      fireEvent.click(trigger);
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("should close dropdown when item is selected", () => {
      const onValueChange = jest.fn();
      renderSelect("", onValueChange);

      const trigger = screen.getByRole("button");
      fireEvent.click(trigger);

      const option = screen.getByText("Option 2");
      fireEvent.click(option);

      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("should call onValueChange when item is selected", () => {
      const onValueChange = jest.fn();
      renderSelect("", onValueChange);

      const trigger = screen.getByRole("button");
      fireEvent.click(trigger);

      const option = screen.getByText("Option 2");
      fireEvent.click(option);

      expect(onValueChange).toHaveBeenCalledWith("option2");
    });

    it("should call onValueChange with correct value", () => {
      const onValueChange = jest.fn();
      renderSelect("", onValueChange);

      const trigger = screen.getByRole("button");
      fireEvent.click(trigger);

      const option = screen.getByText("Option 3");
      fireEvent.click(option);

      expect(onValueChange).toHaveBeenCalledWith("option3");
    });
  });

  describe("controlled open state", () => {
    it("should respect open prop", () => {
      const onValueChange = jest.fn();

      render(
        <Select value="" onValueChange={onValueChange} open={true}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>
      );

      // Should be open without clicking
      expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("should call onOpenChange when open state changes", () => {
      const onValueChange = jest.fn();
      const onOpenChange = jest.fn();

      render(
        <Select value="" onValueChange={onValueChange} onOpenChange={onOpenChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("button");
      fireEvent.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });
});

describe("SelectTrigger", () => {
  it("should have correct displayName", () => {
    expect(SelectTrigger.displayName).toBe("SelectTrigger");
  });

  it("should throw error when used outside Select", () => {
    expect(() => {
      render(<SelectTrigger>Trigger</SelectTrigger>);
    }).toThrow("SelectTrigger must be used within Select");
  });

  it("should include chevron icon", () => {
    renderSelect();

    const trigger = screen.getByRole("button");
    const svg = trigger.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should merge custom className", () => {
    render(
      <Select value="" onValueChange={jest.fn()}>
        <SelectTrigger className="custom-trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveClass("custom-trigger");
  });

  it("should be disabled when disabled prop is passed", () => {
    render(
      <Select value="" onValueChange={jest.fn()}>
        <SelectTrigger disabled>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("SelectContent", () => {
  it("should have correct displayName", () => {
    expect(SelectContent.displayName).toBe("SelectContent");
  });

  it("should not render when closed", () => {
    renderSelect();

    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  it("should render children when open", () => {
    renderSelect();

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });
});

describe("SelectItem", () => {
  it("should have correct displayName", () => {
    expect(SelectItem.displayName).toBe("SelectItem");
  });

  it("should throw error when used outside Select", () => {
    expect(() => {
      render(<SelectItem value="test">Test</SelectItem>);
    }).toThrow("SelectItem must be used within Select");
  });

  it("should show check icon when selected", () => {
    renderSelect("option1");

    fireEvent.click(screen.getByRole("button"));

    const option1Container = screen.getByText("Option 1").parentElement;
    const checkIcon = option1Container?.querySelector("svg");
    expect(checkIcon).toBeInTheDocument();
  });

  it("should not show check icon when not selected", () => {
    renderSelect("option1");

    fireEvent.click(screen.getByRole("button"));

    const option2Container = screen.getByText("Option 2").parentElement;
    const checkIcon = option2Container?.querySelector("svg");
    expect(checkIcon).not.toBeInTheDocument();
  });
});

describe("SelectValue", () => {
  it("should have correct displayName", () => {
    expect(SelectValue.displayName).toBe("SelectValue");
  });

  it("should display placeholder when no value", () => {
    renderSelect("");

    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("should display value when selected", () => {
    renderSelect("option2");

    expect(screen.getByText("option2")).toBeInTheDocument();
  });
});
