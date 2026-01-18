"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function Dialog({ 
  children, 
  open, 
  onOpenChange 
}: { 
  children: React.ReactNode; 
  open?: boolean; 
  onOpenChange?: (open: boolean) => void; 
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Controlled vs Uncontrolled
  const isControlled = open !== undefined;
  const show = isControlled ? open : isOpen;
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setIsOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContext.Provider value={{ open: !!show, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  const { open, onOpenChange } = useContext(DialogContext)!;
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => onOpenChange(false)}
        />
        {/* Content */}
        <div 
          ref={contentRef}
          className={cn(
            "relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg animate-in zoom-in-95 duration-200 border border-zinc-200",
            className
          )}
        >
          {children}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-100 transition-colors text-zinc-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Portal>
  );
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-4 text-left space-y-1.5", className)}>{children}</div>;
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)}>{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h2>;
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}
