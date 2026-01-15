"use client";

import React, { useRef } from "react";
import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { Button } from "@/components/ui/button";
import { Download, PanelLeftClose, PanelLeft } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export function ResumeBuilder() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Left Side - Editor */}
        <div 
           className={`border-r border-gray-200 bg-white h-full overflow-hidden flex flex-col print:hidden relative transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-full md:w-1/2 lg:w-2/5" : "w-0 border-r-0"}`}
        >
          {isSidebarOpen && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-start gap-4 shrink-0 relative">
                 <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute right-4 top-4 z-50 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="Collapse Sidebar"
                 >
                    <PanelLeftClose className="h-5 w-5" />
                 </button>

                 <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200 relative shrink-0">
                    <img src="/placeholder-avatar.jpg" alt="Profile" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold text-xs">
                       SD
                    </div>
                 </div>
                 
                 <div className="flex-1 pr-8">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">Resume Template</h1>
                    <div className="flex items-center justify-between mt-1">
                      <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">BY Flotick</p>
                          <p className="text-xs text-gray-500">Personal ATS format</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 gap-2 ml-2" onClick={() => reactToPrintFn()}>
                         <Download className="h-3.5 w-3.5" /> PDF
                      </Button>
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                 <ResumeForm />
              </div>
            </>
          )}
        </div>

        {/* Floating Open Button when collapsed */}
        {!isSidebarOpen && (
          <div className="absolute left-6 top-6 z-[100] print:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
              title="Open Sidebar"
            >
              <PanelLeft className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Right Side - Preview */}
        <div className={`flex-1 bg-[#F8F9FA] h-full overflow-y-auto flex flex-col items-center p-8 print:p-0 print:w-full print:h-auto print:static print:bg-white relative`}>
            {/* Dotted Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" 
                style={{ 
                    backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)", 
                    backgroundSize: "20px 20px" 
                }} 
            />
            <div className="z-10 shadow-sm print:shadow-none print:w-full print:static" ref={contentRef}>
              <ResumePreview />
           </div>
        </div>
      </div>
  );
}
