"use client";

import { useEffect, useCallback } from "react";

/**
 * Keyboard shortcut configuration
 */
interface ShortcutConfig {
  /** Callback for undo action */
  onUndo: () => void;
  /** Callback for redo action */
  onRedo: () => void;
  /** Whether shortcuts are enabled (default: true) */
  enabled?: boolean;
}

/**
 * Check if the current focus is on an editable element
 * where native undo/redo should take precedence
 */
function isEditableElement(element: Element | null): boolean {
  if (!element) return false;

  const tagName = element.tagName.toLowerCase();
  
  // Standard input elements
  if (tagName === "input" || tagName === "textarea") {
    return true;
  }

  // Contenteditable elements
  if (element.getAttribute("contenteditable") === "true") {
    return true;
  }

  // Check for role="textbox" (accessibility pattern)
  if (element.getAttribute("role") === "textbox") {
    return true;
  }

  return false;
}

/**
 * Global keyboard shortcut handler for undo/redo
 * 
 * Shortcuts:
 * - Ctrl/Cmd + Z → Undo
 * - Ctrl/Cmd + Shift + Z → Redo
 * - Ctrl/Cmd + Y → Redo (Windows alternative)
 * 
 * Features:
 * - Cross-platform modifier key detection
 * - Ignores shortcuts when focus is in text inputs
 * - Clean registration/cleanup via useEffect
 * 
 * @param config - Shortcut configuration with callbacks
 */
export function useKeyboardShortcuts(config: ShortcutConfig): void {
  const { onUndo, onRedo, enabled = true } = config;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Check for modifier key (Ctrl on Windows/Linux, Cmd on Mac)
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      if (!modifierKey) return;

      // Skip if focus is on an editable element
      const activeElement = document.activeElement;
      if (isEditableElement(activeElement)) {
        return;
      }

      const key = event.key.toLowerCase();

      // Ctrl/Cmd + Z → Undo
      if (key === "z" && !event.shiftKey) {
        event.preventDefault();
        onUndo();
        return;
      }

      // Ctrl/Cmd + Shift + Z → Redo
      if (key === "z" && event.shiftKey) {
        event.preventDefault();
        onRedo();
        return;
      }

      // Ctrl/Cmd + Y → Redo (Windows alternative)
      if (key === "y" && !event.shiftKey) {
        event.preventDefault();
        onRedo();
        return;
      }
    },
    [enabled, onUndo, onRedo]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}

/**
 * Get platform-specific modifier key label
 * @returns "⌘" for Mac, "Ctrl" for Windows/Linux
 */
export function getModifierKeyLabel(): string {
  if (typeof navigator === "undefined") return "Ctrl";
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  return isMac ? "⌘" : "Ctrl";
}
