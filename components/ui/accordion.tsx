"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AccordionItemContext = React.createContext<{
  isOpen: boolean;
  toggle: () => void;
} | null>(null);

const Accordion = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("divide-y divide-zinc-100 border border-zinc-100 rounded-xl overflow-hidden shadow-sm bg-white", className)}>
      {children}
    </div>
  );
};

const AccordionItem = ({ 
  children, 
  title, 
  icon: Icon, 
  defaultOpen = false,
  className 
}: { 
  children: React.ReactNode; 
  title: string; 
  icon?: React.ElementType; 
  defaultOpen?: boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <AccordionItemContext.Provider value={{ isOpen, toggle: () => setIsOpen(!isOpen) }}>
      <div className={cn("group", className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

const AccordionTrigger = ({ 
  title, 
  icon: Icon, 
  subtitle 
}: { 
  title: string; 
  icon?: React.ElementType; 
  subtitle?: string 
}) => {
  const context = React.useContext(AccordionItemContext);
  if (!context) throw new Error("AccordionTrigger must be used within AccordionItem");

  return (
    <button
      onClick={context.toggle}
      className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-zinc-50/50"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
            context.isOpen ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-zinc-50 border-zinc-100 text-zinc-500"
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h4 className={cn(
            "font-bold transition-colors",
            context.isOpen ? "text-indigo-600" : "text-zinc-900"
          )}>
            {title}
          </h4>
          {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <ChevronDown className={cn(
        "h-5 w-5 text-zinc-400 transition-transform duration-300",
        context.isOpen && "rotate-180 text-indigo-500"
      )} />
    </button>
  );
};

const AccordionContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const context = React.useContext(AccordionItemContext);
  if (!context) throw new Error("AccordionContent must be used within AccordionItem");

  if (!context.isOpen) return null;

  return (
    <div className={cn(
      "p-5 pt-0 animate-in fade-in slide-in-from-top-2 duration-300",
      className
    )}>
      {children}
    </div>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
