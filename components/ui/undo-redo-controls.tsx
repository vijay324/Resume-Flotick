"use client";

import React from "react";
import { Undo2, Redo2 } from "lucide-react";
import { useResume } from "@/context/resume-context";
import { getModifierKeyLabel } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";

/**
 * Undo/Redo control buttons with keyboard shortcut hints
 * 
 * Features:
 * - Visual disabled states when actions unavailable
 * - Tooltips with platform-specific keyboard shortcuts
 * - Smooth hover/active animations
 * - Accessible with proper labels
 */
export function UndoRedoControls() {
  const { undo, redo, canUndo, canRedo } = useResume();
  const modKey = getModifierKeyLabel();

  const buttonClass = cn(
    "relative flex items-center justify-center h-8 w-8 rounded-lg",
    "text-gray-400 transition-all duration-200",
    "hover:text-gray-700 hover:bg-gray-100",
    "active:scale-95",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
  );

  return (
    <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
      {/* Undo Button */}
      <button
        onClick={undo}
        disabled={!canUndo}
        className={buttonClass}
        title={`Undo (${modKey}+Z)`}
        aria-label="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </button>

      {/* Redo Button */}
      <button
        onClick={redo}
        disabled={!canRedo}
        className={buttonClass}
        title={`Redo (${modKey}+Shift+Z)`}
        aria-label="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  );
}
