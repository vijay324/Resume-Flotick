"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAllResumeData } from "@/lib/client/resume-persistence";

interface ClearDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCleared: () => void;
}

/**
 * Confirmation dialog for clearing all user data
 * Requires typing "DELETE" to confirm
 */
export function ClearDataDialog({
  isOpen,
  onClose,
  onCleared,
}: ClearDataDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClear = async () => {
    if (confirmText !== "DELETE") return;

    setIsClearing(true);
    setError(null);

    try {
      await clearAllResumeData();
      onCleared();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to clear data");
    } finally {
      setIsClearing(false);
      setConfirmText("");
    }
  };

  const handleClose = () => {
    if (isClearing) return;
    setConfirmText("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        onKeyDown={(e) => e.key === "Escape" && handleClose()}
        role="button"
        tabIndex={0}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          disabled={isClearing}
          type="button"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        {/* Warning icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Clear All Data
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          This will permanently delete your resume data, API keys, and all
          preferences stored in this browser. This action cannot be undone.
        </p>

        {/* Confirmation input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Type <span className="font-mono text-red-600">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            placeholder="Type DELETE"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isClearing}
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isClearing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClear}
            disabled={confirmText !== "DELETE" || isClearing}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isClearing ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Data
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
