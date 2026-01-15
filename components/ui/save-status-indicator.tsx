"use client";

import React, { useEffect, useState } from "react";
import { Check, AlertCircle, Loader2, Cloud } from "lucide-react";
import {
  subscribeToStorageStatus,
  type StorageStatus,
} from "@/lib/client/resume-persistence";

/**
 * Visual indicator for save status
 * Shows saving spinner, saved confirmation, or error state
 */
export function SaveStatusIndicator() {
  const [status, setStatus] = useState<StorageStatus | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToStorageStatus(setStatus);
    return unsubscribe;
  }, []);

  if (!status) return null;

  // Format last saved time
  const formatTime = (date: Date | null) => {
    if (!date) return "";
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (status.error) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2.5 py-1.5 rounded-full border border-red-100">
        <AlertCircle className="h-3.5 w-3.5" />
        <span className="font-medium">Save failed</span>
      </div>
    );
  }

  if (status.isSaving) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-full border border-gray-100">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="font-medium">Saving...</span>
      </div>
    );
  }

  if (status.lastSaved) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-full border border-green-100">
        <Check className="h-3.5 w-3.5" />
        <span className="font-medium">Saved {formatTime(status.lastSaved)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-2.5 py-1.5 rounded-full border border-gray-100">
      <Cloud className="h-3.5 w-3.5" />
      <span className="font-medium">Auto-save enabled</span>
    </div>
  );
}
