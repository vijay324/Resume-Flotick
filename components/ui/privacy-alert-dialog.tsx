"use client";

import React from "react";
import { ShieldCheck, Lock, HardDrive, ServerOff, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivacyAlertDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
}

/**
 * Privacy Alert Dialog
 * Mandatory first-visit modal to inform users about local-only data storage.
 * Cannot be closed without accepting.
 */
export function PrivacyAlertDialog({
  isOpen,
  onConfirm,
}: PrivacyAlertDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - High z-index, blocking interaction */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 fade-in duration-300 border border-zinc-200 dark:border-zinc-800">
        
        {/* Safe/Privacy Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="relative">
             <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full scale-150 animate-pulse" />
             <div className="relative h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center transform rotate-3">
                <ShieldCheck className="h-8 w-8 text-white" />
             </div>
             {/* Decorative small icons */}
             <div className="absolute -right-6 -bottom-2 bg-white dark:bg-zinc-800 p-1.5 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-700">
                <ServerOff className="h-4 w-4 text-zinc-400" />
             </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Your Privacy is Our Priority
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Please read this important notice about your data.
          </p>
        </div>

        {/* Key Points - Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
             <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                    <ServerOff className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-0.5">No Servers</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">No database servers. We never store your resume or API keys.</p>
                </div>
             </div>

             <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
                    <HardDrive className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-0.5">Local Storage</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">All data stays locally in your browser and never leaves your device.</p>
                </div>
             </div>
        </div>

        {/* Warning / Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg p-4 mb-8 text-left">
           <div className="flex gap-3"> 
              <Database className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                 <p className="font-medium text-zinc-900 dark:text-amber-500 mb-1">Important to know:</p>
                 <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Your data will only be removed if you manually <span className="font-semibold">clear your browser storage</span>. 
                    Clearing cache/history will permanently delete your resume.
                 </p>
              </div>
           </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={onConfirm}
          className="w-full h-12 text-base font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-all shadow-xl shadow-zinc-200/50 dark:shadow-none"
        >
          I Understand & Continue
        </Button>
        
        <p className="text-center mt-4 text-[10px] text-zinc-400 uppercase tracking-widest font-medium">
             100% Client-Side • Secure • Private
        </p>

      </div>
    </div>
  );
}
