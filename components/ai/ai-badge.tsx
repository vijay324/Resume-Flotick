"use client";

import React from "react";
import { Sparkles, Lock, Loader2, AlertCircle } from "lucide-react";

export type AIBadgeVariant = "enabled" | "disabled" | "loading" | "error";

interface AIBadgeProps {
  variant?: AIBadgeVariant;
  className?: string;
}

export function AIBadge({ variant = "enabled", className = "" }: AIBadgeProps) {
  const variants = {
    enabled: {
      icon: <Sparkles className="w-3 h-3" />,
      text: "AI",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    disabled: {
      icon: <Lock className="w-3 h-3" />,
      text: "AI",
      className: "bg-muted text-muted-foreground border-border",
    },
    loading: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      text: "AI",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    error: {
      icon: <AlertCircle className="w-3 h-3" />,
      text: "AI",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const config = variants[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border ${config.className} ${className}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
}
