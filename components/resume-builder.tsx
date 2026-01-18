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
import Link from "next/link";
import Image from "next/image";
import { useResume } from "@/context/resume-context";
import { useTemplate } from "@/context/template-context";
import { MobileToolbar } from "@/components/resume-builder/mobile-toolbar";
import { PdfDownloadButton } from "@/components/pdf-download-button";

export function ResumeBuilder() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState<"editor" | "preview">("editor");
  const [zoom, setZoom] = useState(0.9); // Default scale
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { resumeData, clearAllData } = useResume();
  const { templateType } = useTemplate();

  const handleClearResume = async () => {
    setIsClearing(true);
    try {
      await clearAllData();
      setIsClearDialogOpen(false);
    } finally {
      setIsClearing(false);
    }
  };

  // Default zoom based on screen size
  React.useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setZoom(isMobile ? 0.4 : 0.8);
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-zinc-50/50">
        {/* Mobile Tab Navigation & Header */}
        <div className="lg:hidden flex items-center justify-between px-4 h-16 bg-white border-b border-zinc-200 shrink-0 z-30">
          <div className="flex items-center gap-3">
             <Link href="/" className="p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
               <ChevronLeft className="h-5 w-5" />
             </Link>
             <div className="flex bg-zinc-100/80 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveMobileTab('editor')} 
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeMobileTab === 'editor' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  Editor
                </button>
                <button 
                  onClick={() => setActiveMobileTab('preview')} 
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeMobileTab === 'preview' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  Preview
                </button>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="scale-90 origin-right">
                <UndoRedoControls />
             </div>
             <MobileToolbar 
               resumeData={resumeData}
               templateType={templateType}
               onClear={() => setIsClearDialogOpen(true)}
               zoom={zoom}
               onZoomChange={setZoom}
             />
          </div>
        </div>

        {/* Left Side - Editor */}
        <div 
           className={`
             relative flex-col h-full bg-background/95 backdrop-blur-xl border-r border-border/60 
             shadow-[4px_0_24px_-12px_rgba(0,0,0,0.02)] z-20 transition-all duration-500 ease-[bezier(0.25,1,0.5,1)]
             ${activeMobileTab === 'editor' ? 'flex w-full' : 'hidden'} lg:flex
             ${isSidebarOpen ? "lg:w-1/2 xl:w-2/5 lg:translate-x-0 lg:opacity-100" : "lg:w-0 lg:border-r-0 lg:-translate-x-full lg:opacity-0 lg:overflow-hidden"}
           `}
        >
          {/* Header */}
          <div className="h-16 px-6 border-b border-zinc-100 items-center justify-between shrink-0 bg-white/50 backdrop-blur-md sticky top-0 z-10 hidden lg:flex">
             <div className="flex items-center gap-3">
                <Link href="/" className="p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all lg:flex hidden">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
                <div className="h-10 w-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm lg:flex hidden">
                   <Image src="/logo-black.svg" alt="Logo" width={22} height={22} />
                </div>
                <div className="hidden lg:block">
                   <h1 className="text-sm font-semibold text-zinc-900 leading-tight">Professional Resume</h1>
                   <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">ATS-Optimized</p>
                </div>
             </div>

             <div className="flex items-center gap-2">
                <UndoRedoControls />
                <div className="hidden md:block">
                  <SaveStatusIndicator />
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-900 hidden lg:flex"
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

        {/* Mobile Toolbar - Removed (Moved to Header) */}
        
        {/* Floating Open Button when collapsed */}
        <div className={`absolute left-6 top-6 z-30 transition-all duration-500 ${!isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white border border-zinc-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-zinc-500 hover:text-indigo-600 hover:scale-105 transition-all"
            title="Open Sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Right Side - Preview */}
        <div className={`flex-1 bg-muted/30 h-full overflow-auto overflow-x-auto relative flex-col items-start p-4 lg:p-8 print:p-0 print:w-full print:h-auto print:static print:bg-white scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent ${activeMobileTab === 'preview' ? 'flex' : 'hidden'} lg:flex`}>
            {/* Template Selector & Download Button (Floating) - Desktop Only */}
            <div className={`hidden lg:flex fixed top-6 right-8 z-30 items-center gap-3 transition-all duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-0'}`}>
                {/* Clear Resume Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 gap-2 bg-white border border-zinc-200 rounded-xl shadow-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-zinc-600 transition-all"
                  onClick={() => setIsClearDialogOpen(true)}
                  title="Clear Resume"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="font-medium">Clear</span>
                </Button>
                <ZoomControls zoom={zoom} onZoomChange={setZoom} />
                <TemplateSelector />
                <PdfDownloadButton resumeData={resumeData} templateType={templateType} />
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]" 
                style={{ 
                    backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", 
                    backgroundSize: "24px 24px",
                    maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)"
                }} 
            />
            
            {/* Resume Container */}
            <div className="z-10 my-auto transition-transform duration-300 ease-out origin-top mx-auto" style={{ transform: `scale(${zoom})` }}>
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

