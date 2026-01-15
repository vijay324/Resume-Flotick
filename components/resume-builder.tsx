"use client";

import React, { useRef } from "react";
import { ResumeProvider } from "@/context/resume-context";
import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export function ResumeBuilder() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <ResumeProvider>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Left Side - Editor */}
        <div 
           className={`border-r border-gray-200 bg-white h-full overflow-hidden flex flex-col print:hidden relative transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-full md:w-1/2 lg:w-2/5" : "w-16"}`}
        >
          {/* Collapse Toggle */}
          <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-50 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 flex items-center justify-center h-6 w-6 text-gray-400 hover:text-gray-600"
          >
             {isSidebarOpen ? "❮" : "❯"}
          </button>
          
          {/* Header */}
          <div className={`p-6 border-b border-gray-100 flex items-start gap-4 shrink-0 ${!isSidebarOpen && "flex-col items-center px-2"}`}>
             <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200 relative shrink-0">
                <img src="/placeholder-avatar.jpg" alt="Profile" className="object-cover w-full h-full" />
                {/* Fallback if image missing, or use a colorful div */}
                <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold text-xs">
                   SD
                </div>
             </div>
             {isSidebarOpen && (
               <div className="flex-1">
                  <h1 className="text-xl font-bold tracking-tight text-gray-900">Resume Template</h1>
                  <div className="flex items-center justify-between mt-1">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">BY SREECHARANDESU</p>
                        <p className="text-xs text-gray-500">Personal ATS format</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 gap-2 ml-2" onClick={() => reactToPrintFn()}>
                       <Download className="h-3.5 w-3.5" /> PDF
                    </Button>
                  </div>
               </div>
             )}
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
             {isSidebarOpen ? <ResumeForm /> : (
                <div className="flex flex-col gap-4 items-center pt-8 text-gray-300">
                    {/* Collapsed placeholder icons */}
                </div>
             )}
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className={`flex-1 bg-[#F8F9FA] h-full overflow-y-auto flex flex-col items-center p-8 print:p-0 print:w-full print:h-auto print:static print:bg-white relative`}>
            {/* Dotted Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" 
                style={{ 
                    backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)", 
                    backgroundSize: "20px 20px" 
                }} 
            />
            <div className="print:w-full print:h-full z-10 shadow-sm" ref={contentRef}>
              <ResumePreview />
           </div>
        </div>
      </div>
    </ResumeProvider>
  );
}
