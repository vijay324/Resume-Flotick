"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, Menu, X, Download, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { TemplateSelector } from "@/components/template-selector";
import { ZoomControls } from "@/components/ui/zoom-controls";

import { PdfDownloadButton } from "@/components/pdf-download-button";
import type { ResumeData, TemplateType } from "@/types/resume";
import Image from "next/image";
import { SaveStatusIndicator } from "@/components/ui/save-status-indicator";

interface MobileToolbarProps {
  onClear: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  resumeData: ResumeData;
  templateType: TemplateType;
}

export function MobileToolbar({
  onClear,
  zoom,
  onZoomChange,
  resumeData,
  templateType,
}: MobileToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-white shadow-md border-gray-200"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </Button>

      {/* Mobile Drawer/Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-3/4 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm">
                    <Image src="/logo-black.svg" alt="Logo" width={22} height={22} />
                 </div>
                 <div>
                    <h1 className="text-sm font-semibold text-gray-900 leading-tight">Professional Resume</h1>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">ATS-Optimized</p>
                 </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 text-gray-400 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <div className="flex justify-center pb-2">
                 <SaveStatusIndicator />
              </div>

              {/* Main CTA */}
              <div onClick={() => setIsOpen(false)}>
                <PdfDownloadButton resumeData={resumeData} templateType={templateType} />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Template
                </label>
                <div className="overflow-visible">
                   <TemplateSelector />
                </div>
              </div>

              <div className="space-y-3">
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Zoom Level
                </label>
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100 justify-center">
                   <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
                    disabled={zoom <= 0.5}
                   >
                     <ZoomOut className="h-4 w-4" />
                   </Button>
                   <span className="text-sm font-medium w-12 text-center">
                     {Math.round(zoom * 100)}%
                   </span>
                   <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))}
                    disabled={zoom >= 1.5}
                   >
                     <ZoomIn className="h-4 w-4" />
                   </Button>
                </div>
              </div>

              <div className="pt-6 mt-auto border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    onClear();
                    setIsOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
