"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// --- Context ---
interface DropdownContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

// --- Components ---

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left" ref={containerRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ 
  children, 
  asChild 
}: { 
  children: React.ReactNode; 
  asChild?: boolean 
}) {
  const { open, setOpen } = useContext(DropdownContext)!;

  const handleClick = (e: React.MouseEvent) => {
    // e.stopPropagation(); // Avoid conflict?
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: (e: React.MouseEvent) => {
        (children.props as any).onClick?.(e);
        handleClick(e);
      },
      "aria-expanded": open,
      "data-state": open ? "open" : "closed",
    });
  }

  return (
    <button onClick={handleClick} aria-expanded={open}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ 
  children, 
  className,
  align = "center",
}: { 
  children: React.ReactNode; 
  className?: string;
  align?: "start" | "center" | "end"; 
}) {
  const { open } = useContext(DropdownContext)!;

  if (!open) return null;

  return (
    <div 
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 text-zinc-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2",
        "mt-2",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ 
  children, 
  className, 
  onSelect 
}: { 
  children: React.ReactNode; 
  className?: string; 
  onSelect?: () => void;
}) {
  const { setOpen } = useContext(DropdownContext)!;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
        setOpen(false);
      }}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>{children}</div>;
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-zinc-100", className)} />;
}

export function DropdownMenuGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
