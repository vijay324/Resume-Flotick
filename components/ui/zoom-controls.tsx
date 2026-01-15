"use client";

import React from "react";
import { ZoomIn, ZoomOut, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  className?: string;
}

export function ZoomControls({ zoom, onZoomChange, className }: ZoomControlsProps) {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.1, 0.5));
  };

  // Format percentage
  const percentage = Math.round(zoom * 100);

  return (
    <div className={cn("flex items-center bg-white border border-gray-200 rounded-xl shadow-sm p-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-lg hover:bg-gray-100 text-gray-500"
        onClick={handleZoomOut}
        disabled={zoom <= 0.5}
        title="Zoom Out"
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </Button>
      
      <div className="w-12 text-center text-xs font-medium text-gray-600 select-none">
        {percentage}%
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-lg hover:bg-gray-100 text-gray-500"
        onClick={handleZoomIn}
        disabled={zoom >= 1.5}
        title="Zoom In"
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
