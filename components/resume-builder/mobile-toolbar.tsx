"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, Menu, X, Download, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { TemplateSelector } from "@/components/template-selector";
import { ZoomControls } from "@/components/ui/zoom-controls";

interface MobileToolbarProps {
  onDownload: () => void;
  onClear: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function MobileToolbar({
  onDownload,
  onClear,
  zoom,
  onZoomChange,
}: MobileToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden fixed top-4 right-4 z-40">
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
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
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
              {/* Main CTA */}
              <Button 
                onClick={() => {
                  onDownload();
                  setIsOpen(false);
                }}
                className="w-full gap-2 bg-gray-900 text-white hover:bg-black shadow-lg"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>

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
