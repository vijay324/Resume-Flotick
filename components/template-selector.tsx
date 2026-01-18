"use client";

import React, { useState } from "react";
import { useTemplate, TEMPLATES } from "@/context/template-context";
import { LayoutTemplate, Check, ChevronDown } from "lucide-react";
import type { TemplateType } from "@/types/resume";

export function TemplateSelector() {
  const { templateType, setTemplate, templates } = useTemplate();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentTemplate = templates.find(t => t.id === templateType);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all text-sm font-medium text-zinc-700 w-full"
      >
        <LayoutTemplate className="h-4 w-4 text-indigo-500 shrink-0" />
        <span className="truncate block max-w-[80px] xl:max-w-none">{currentTemplate?.name || "Classic"}</span>
        <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ml-auto shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-zinc-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 border-b border-zinc-100 bg-zinc-50/50">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Resume Templates</p>
              <p className="text-[10px] text-zinc-400">All templates are ATS-friendly</p>
            </div>
            
            <div className="p-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setTemplate(template.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left ${
                    templateType === template.id 
                      ? 'bg-indigo-50 border border-indigo-200' 
                      : 'hover:bg-zinc-50 border border-transparent'
                  }`}
                >
                  {/* Preview Icon */}
                  <div className={`w-10 h-14 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                    templateType === template.id ? 'border-indigo-400 bg-indigo-100' : 'border-zinc-200 bg-zinc-50'
                  }`}>
                    {template.layout === "single-column" ? (
                      <div className="w-6 space-y-0.5">
                        <div className="h-1 bg-zinc-300 rounded-sm w-full" />
                        <div className="h-0.5 bg-zinc-200 rounded-sm w-4" />
                        <div className="h-0.5 bg-zinc-200 rounded-sm w-full" />
                        <div className="h-0.5 bg-zinc-200 rounded-sm w-5" />
                        <div className="h-0.5 bg-zinc-200 rounded-sm w-full" />
                      </div>
                    ) : (
                      <div className="w-6 flex gap-0.5">
                        <div className="w-2 space-y-0.5">
                          <div className="h-1 bg-zinc-400 rounded-sm" />
                          <div className="h-0.5 bg-zinc-300 rounded-sm" />
                          <div className="h-0.5 bg-zinc-300 rounded-sm" />
                        </div>
                        <div className="w-4 space-y-0.5">
                          <div className="h-0.5 bg-zinc-200 rounded-sm" />
                          <div className="h-0.5 bg-zinc-200 rounded-sm" />
                          <div className="h-0.5 bg-zinc-200 rounded-sm" />
                          <div className="h-0.5 bg-zinc-200 rounded-sm" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${
                        templateType === template.id ? 'text-indigo-700' : 'text-zinc-900'
                      }`}>
                        {template.name}
                      </p>
                      {templateType === template.id && (
                        <Check className="h-4 w-4 text-indigo-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2">{template.description}</p>
                    <span className={`inline-block mt-1 text-[9px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded ${
                      template.layout === "single-column" 
                        ? 'bg-zinc-100 text-zinc-500' 
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {template.layout.replace("-", " ")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
