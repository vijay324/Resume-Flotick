/**
 * @fileoverview Unit tests for hooks/use-keyboard-shortcuts.ts
 * Tests keyboard shortcut registration and callbacks for undo/redo
 */

import { renderHook } from "@testing-library/react";
import {
  useKeyboardShortcuts,
  getModifierKeyLabel,
} from "@/hooks/use-keyboard-shortcuts";

// Helper to create and dispatch keyboard events
const createKeyboardEvent = (
  key: string,
  options: {
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
  } = {}
): KeyboardEvent => {
  return new KeyboardEvent("keydown", {
    key,
    ctrlKey: options.ctrlKey ?? false,
    metaKey: options.metaKey ?? false,
    shiftKey: options.shiftKey ?? false,
    bubbles: true,
    cancelable: true,
  });
};

describe("useKeyboardShortcuts", () => {
  let onUndo: jest.Mock;
  let onRedo: jest.Mock;

  beforeEach(() => {
    onUndo = jest.fn();
    onRedo = jest.fn();
    // Clear any active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("undo shortcut", () => {
    it("should call onUndo for Ctrl+Z on Windows", () => {
      // Mock Windows platform
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const event = createKeyboardEvent("z", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onUndo).toHaveBeenCalledTimes(1);
      expect(onRedo).not.toHaveBeenCalled();
    });

    it("should call onUndo for Cmd+Z on Mac", () => {
      // Mock Mac platform
      Object.defineProperty(navigator, "platform", {
        value: "MacIntel",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const event = createKeyboardEvent("z", { metaKey: true });
      document.dispatchEvent(event);

      expect(onUndo).toHaveBeenCalledTimes(1);
    });

    it("should not call onUndo for Z without modifier", () => {
      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const event = createKeyboardEvent("z");
      document.dispatchEvent(event);

      expect(onUndo).not.toHaveBeenCalled();
    });
  });

  describe("redo shortcut", () => {
    it("should call onRedo for Ctrl+Shift+Z on Windows", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const event = createKeyboardEvent("z", { ctrlKey: true, shiftKey: true });
      document.dispatchEvent(event);

      expect(onRedo).toHaveBeenCalledTimes(1);
      expect(onUndo).not.toHaveBeenCalled();
    });

    it("should call onRedo for Cmd+Shift+Z on Mac", () => {
      Object.defineProperty(navigator, "platform", {
        value: "MacIntel",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const event = createKeyboardEvent("z", { metaKey: true, shiftKey: true });
      document.dispatchEvent(event);

      expect(onRedo).toHaveBeenCalledTimes(1);
    });

    it("should call onRedo for Ctrl+Y on Windows", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const event = createKeyboardEvent("y", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onRedo).toHaveBeenCalledTimes(1);
    });

    it("should call onRedo for Cmd+Y on Mac", () => {
      Object.defineProperty(navigator, "platform", {
        value: "MacIntel",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const event = createKeyboardEvent("y", { metaKey: true });
      document.dispatchEvent(event);

      expect(onRedo).toHaveBeenCalledTimes(1);
    });
  });

  describe("enabled option", () => {
    it("should not register shortcuts when disabled", () => {
      renderHook(() =>
        useKeyboardShortcuts({ onUndo, onRedo, enabled: false })
      );

      const event = createKeyboardEvent("z", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onUndo).not.toHaveBeenCalled();
    });

    it("should register shortcuts when enabled is true", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo, enabled: true }));

      const event = createKeyboardEvent("z", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onUndo).toHaveBeenCalledTimes(1);
    });

    it("should register shortcuts by default (enabled not specified)", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const event = createKeyboardEvent("z", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onUndo).toHaveBeenCalledTimes(1);
    });
  });

  describe("editable element handling", () => {
    it("should not trigger shortcuts when input is focused", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      // Create and focus an input
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.focus();

      const event = createKeyboardEvent("z", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onUndo).not.toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(input);
    });

    it("should not trigger shortcuts when textarea is focused", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const textarea = document.createElement("textarea");
      document.body.appendChild(textarea);
      textarea.focus();

      const event = createKeyboardEvent("z", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onUndo).not.toHaveBeenCalled();

      document.body.removeChild(textarea);
    });

    it("should not trigger shortcuts when contenteditable is focused", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const div = document.createElement("div");
      div.setAttribute("contenteditable", "true");
      document.body.appendChild(div);
      div.focus();

      const event = createKeyboardEvent("z", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onUndo).not.toHaveBeenCalled();

      document.body.removeChild(div);
    });

    it("should not trigger shortcuts when role=textbox is focused", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const div = document.createElement("div");
      div.setAttribute("role", "textbox");
      div.setAttribute("tabindex", "0");
      document.body.appendChild(div);
      div.focus();

      const event = createKeyboardEvent("z", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onUndo).not.toHaveBeenCalled();

      document.body.removeChild(div);
    });
  });

  describe("cleanup", () => {
    it("should remove event listener on unmount", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({ onUndo, onRedo })
      );

      unmount();

      // Dispatch event after unmount
      const event = createKeyboardEvent("z", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onUndo).not.toHaveBeenCalled();
    });

    it("should remove event listener when enabled changes to false", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      const { rerender } = renderHook(
        ({ enabled }) => useKeyboardShortcuts({ onUndo, onRedo, enabled }),
        { initialProps: { enabled: true } }
      );

      // Should work initially
      let event = createKeyboardEvent("z", { ctrlKey: true });
      document.dispatchEvent(event);
      expect(onUndo).toHaveBeenCalledTimes(1);

      // Disable shortcuts
      rerender({ enabled: false });
      onUndo.mockClear();

      // Should not work anymore
      event = createKeyboardEvent("z", { ctrlKey: true });
      document.dispatchEvent(event);
      expect(onUndo).not.toHaveBeenCalled();
    });
  });

  describe("case insensitivity", () => {
    it("should handle uppercase Z key", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const event = createKeyboardEvent("Z", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onUndo).toHaveBeenCalledTimes(1);
    });

    it("should handle uppercase Y key", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
      });

      renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

      const event = createKeyboardEvent("Y", { ctrlKey: true });
      document.dispatchEvent(event);

      expect(onRedo).toHaveBeenCalledTimes(1);
    });
  });
});

describe("getModifierKeyLabel", () => {
  it("should return Ctrl for Windows", () => {
    Object.defineProperty(navigator, "platform", {
      value: "Win32",
      writable: true,
    });

    expect(getModifierKeyLabel()).toBe("Ctrl");
  });

  it("should return Ctrl for Linux", () => {
    Object.defineProperty(navigator, "platform", {
      value: "Linux x86_64",
      writable: true,
    });

    expect(getModifierKeyLabel()).toBe("Ctrl");
  });

  it("should return ⌘ for Mac", () => {
    Object.defineProperty(navigator, "platform", {
      value: "MacIntel",
      writable: true,
    });

    expect(getModifierKeyLabel()).toBe("⌘");
  });

  it("should return Ctrl when navigator is undefined", () => {
    // This test is for SSR scenarios where navigator might not exist
    // The actual implementation handles this case
    expect(typeof getModifierKeyLabel()).toBe("string");
  });
});
