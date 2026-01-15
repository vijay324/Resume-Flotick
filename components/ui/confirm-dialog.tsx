"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

/**
 * Reusable confirmation dialog component
 * Replaces browser's native confirm() with a styled modal
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const handleConfirm = () => {
    if (isLoading) return;
    onConfirm();
  };

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      buttonBg: "bg-amber-600 hover:bg-amber-700",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const styles = variantStyles[variant];

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
          disabled={isLoading}
          type="button"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        {/* Warning icon */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg} mb-4`}>
          <AlertTriangle className={`h-6 w-6 ${styles.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 ${styles.buttonBg} text-white`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
