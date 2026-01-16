"use client";

import React, { useRef, useState } from "react";
import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { TemplateSelector } from "@/components/template-selector";
import { Button } from "@/components/ui/button";
import { SaveStatusIndicator } from "@/components/ui/save-status-indicator";
import { UndoRedoControls } from "@/components/ui/undo-redo-controls";
import { ZoomControls } from "@/components/ui/zoom-controls";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Download, PanelLeftClose, PanelLeft, ChevronLeft, Trash2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Link from "next/link";
import Image from "next/image";
import { useResume } from "@/context/resume-context";
import { MobileToolbar } from "@/components/resume-builder/mobile-toolbar";

export function ResumeBuilder() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(0.9); // Default scale
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { clearAllData } = useResume();

  const handleClearResume = async () => {
    setIsClearing(true);
    try {
      await clearAllData();
      setIsClearDialogOpen(false);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50/50">
        {/* Left Side - Editor */}
        <div 
           className={`
             relative flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/50 
             shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-20 transition-all duration-500 ease-[bezier(0.25,1,0.5,1)]
             ${isSidebarOpen ? "w-full md:w-1/2 lg:w-2/5 translate-x-0 opacity-100" : "w-0 border-r-0 -translate-x-full opacity-0 overflow-hidden"}
           `}
        >
          {/* Header */}
          <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-md sticky top-0 z-10">
             <div className="flex items-center gap-3">
                <Link href="/" className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
                <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm">
                   <Image src="/logo-black.svg" alt="Logo" width={22} height={22} />
                </div>
                <div>
                   <h1 className="text-sm font-semibold text-gray-900 leading-tight">Professional Resume</h1>
                   <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">ATS-Optimized</p>
                </div>
             </div>

             <div className="flex items-center gap-2">
                <UndoRedoControls />
                <SaveStatusIndicator />
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900"
                  onClick={() => setIsSidebarOpen(false)}
                >
       <PanelLeftClose className="h-4 w-4" />
                </Button>
             </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
             <ResumeForm />
          </div>
        </div>

        {/* Mobile Toolbar */}
        <MobileToolbar 
          onDownload={reactToPrintFn}
          onClear={() => setIsClearDialogOpen(true)}
          zoom={zoom}
          onZoomChange={setZoom}
        />
        
        {/* Floating Open Button when collapsed */}
        <div className={`absolute left-6 top-6 z-30 transition-all duration-500 ${!isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-gray-500 hover:text-indigo-600 hover:scale-105 transition-all"
            title="Open Sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Right Side - Preview */}
        <div className={`flex-1 bg-[#F8F9FA] h-full overflow-auto overflow-x-auto relative flex flex-col items-center p-8 print:p-0 print:w-full print:h-auto print:static print:bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent`}>
            {/* Template Selector & Download Button (Floating) - Desktop Only */}
            <div className={`hidden md:flex fixed top-6 right-8 z-30 items-center gap-3 transition-all duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-0'}`}>
                {/* Clear Resume Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 gap-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-gray-600 transition-all"
                  onClick={() => setIsClearDialogOpen(true)}
                  title="Clear Resume"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="font-medium">Clear</span>
                </Button>
                <ZoomControls zoom={zoom} onZoomChange={setZoom} />
                <TemplateSelector />
                <Button 
                  size="sm" 
                  className="h-9 gap-2 shadow-lg hover:shadow-xl bg-gray-900 hover:bg-black text-white rounded-full px-5 transition-all hover:-translate-y-0.5"
                  onClick={() => reactToPrintFn()}
                >
                   <Download className="h-3.5 w-3.5" /> 
                   <span className="font-medium">Download PDF</span>
                </Button>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.6]" 
                style={{ 
                    backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)", 
                    backgroundSize: "24px 24px",
                    maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)"
                }} 
            />
            
            {/* Resume Container */}
            <div className="z-10 my-auto transition-transform duration-300 ease-out origin-top" style={{ transform: `scale(${zoom})` }}>
               <div 
                  className="shadow-[0_24px_60px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.02)] print:shadow-none bg-white"
                  ref={contentRef}
                >
                  <ResumePreview />
               </div>
            </div>
        </div>
      </div>

      {/* Clear Resume Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={handleClearResume}
        title="Clear Resume Data"
        description="Are you sure you want to clear all resume data? This will remove all your information and reset the resume to a blank state. This action cannot be undone."
        confirmText="Clear All Data"
        cancelText="Cancel"
        variant="danger"
        isLoading={isClearing}
        waitDuration={4}
      />
    </>
  );
}

