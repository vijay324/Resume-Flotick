"use client";

import React, { useEffect, useState } from "react";
import {
  subscribeToStorageStatus,
  type StorageStatus,
} from "@/lib/client/resume-persistence";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Visual indicator for save status
 * Redesigned as a discrete dot with animations
 */
export function SaveStatusIndicator() {
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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

  const getStatusColor = () => {
    if (status.error) return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
    if (status.isSaving) return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
    if (status.lastSaved) return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
    return "bg-zinc-400";
  };

  const getStatusText = () => {
    if (status.error) return "Save failed";
    if (status.isSaving) return "Saving changes...";
    if (status.lastSaved) return `Saved ${formatTime(status.lastSaved)}`;
    return "Auto-save active";
  };

  return (
    <div 
      className="relative flex items-center justify-center p-0.5 pointer-events-auto group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-2.5 w-2.5">
        {/* Ripple effect when saving */}
        {status.isSaving && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-400"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-400"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
            />
          </>
        )}
        
        {/* Main Indicator Dot */}
        <div className={cn(
          "h-full w-full rounded-full transition-all duration-700 border border-white ring-1 ring-zinc-200/20 shrink-0",
          getStatusColor(),
          status.error && "animate-pulse"
        )} />
      </div>

      {/* Tooltip Content */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[100] py-1.5 px-3 bg-zinc-900 text-white text-[10px] font-semibold rounded-lg shadow-2xl white-space-nowrap pointer-events-none"
          >
             <div className="flex items-center gap-2 whitespace-nowrap">
                <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", getStatusColor())} />
                {getStatusText()}
             </div>
             {/* Tooltip arrow */}
             <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
