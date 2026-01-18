"use client";

import React, { useState } from "react";
import { OptimizedResumeResult, SectionOptimization } from "@/types/ai";
import { useResume } from "@/context/resume-context";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OptimizationPreviewProps {
  result: OptimizedResumeResult;
  onBack: () => void;
}

export function OptimizationPreview({ result, onBack }: OptimizationPreviewProps) {
  const { resumeData, setResumeData } = useResume();
  const [syncedSections, setSyncedSections] = useState<Set<string>>(new Set());

  // Helper to strip markdown formatting (bold/italic) from text
  const stripMarkdown = (text: string): string => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove **bold**
      .replace(/\*([^*]+)\*/g, '$1')       // Remove *italic*
      .replace(/__([^_]+)__/g, '$1')       // Remove __bold__
      .replace(/_([^_]+)_/g, '$1');        // Remove _italic_
  };

  // Helper to parse complex nested keys like "experience.0.description"
  const applyChange = (sectionKey: string, newValue: string) => {
    // Strip markdown formatting from the value before applying
    const cleanValue = stripMarkdown(newValue);
    // Handle "summary" key (maps to personalInfo.summary)
    if (sectionKey === "summary" || sectionKey === "personalInfo.summary") {
       setResumeData(prev => ({
         ...prev,
         personalInfo: {
           ...prev.personalInfo,
           summary: cleanValue
         }
       }));
       setSyncedSections(prev => new Set(prev).add(sectionKey));
       return;
    }

    // Handle skills section - the AI might return a comma-separated list of skills
    if (sectionKey === "skills") {
      // For skills, we update the skill names based on the optimized content
      // The AI typically returns suggestions, we'll keep skills as-is for manual editing
      setSyncedSections(prev => new Set(prev).add(sectionKey));
      console.info("Skills optimization noted. Please review and update skills manually if needed.");
      return;
    }

    // For array items like experience.0.description or projects.0.description
    const parts = sectionKey.split(".");
    if (parts.length === 3) {
       const [section, indexStr, field] = parts;
       const index = parseInt(indexStr);
       
       if (section === "experience" || section === "projects" || section === "education") {
         setResumeData(prev => {
           // @ts-ignore - Dynamic access is safe here given the structure check
           const list = [...prev[section]];
           if (list[index]) {
             list[index] = { ...list[index], [field]: cleanValue };
             return { ...prev, [section]: list };
           }
           return prev;
         });
         setSyncedSections(prev => new Set(prev).add(sectionKey));
         return;
       }
    }

    // Handle direct section fields like "experience.0" (full item replacement not supported)
    if (parts.length === 2) {
       const [section, indexStr] = parts;
       const index = parseInt(indexStr);
       
       if ((section === "experience" || section === "projects" || section === "education") && !isNaN(index)) {
         // For now, assume it's the description field if not specified
         setResumeData(prev => {
           // @ts-ignore - Dynamic access is safe here given the structure check
           const list = [...prev[section]];
           if (list[index]) {
             list[index] = { ...list[index], description: cleanValue };
             return { ...prev, [section]: list };
           }
           return prev;
         });
         setSyncedSections(prev => new Set(prev).add(sectionKey));
         return;
       }
    }
    
    console.warn("Unsupported section key:", sectionKey);
  };

  const handleApplyAll = () => {
    // Apply all optimizations
    result.sections.forEach(section => {
      if (!syncedSections.has(section.section)) {
        applyChange(section.section, section.optimized);
      }
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50/20">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-gray-500 hover:text-gray-900 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Input
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Match Score</span>
            <div className={`
              flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold
              ${result.matchScore >= 80 ? "bg-green-100 text-green-700" : 
                result.matchScore >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}
            `}>
              {result.matchScore}%
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Optimization Results
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            Tailored for <span className="font-semibold text-gray-800">{result.jobTitle}</span>
            {result.company && <span>at {result.company}</span>}
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex divide-x divide-gray-100 border-b border-gray-100 bg-white">
        <div className="flex-1 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{result.sections.length}</div>
          <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Sections Improved</div>
        </div>
        <div className="flex-1 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{result.keywordsAdded.length}</div>
          <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Keywords Added</div>
        </div>
        <div className="flex-1 p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{result.gapSuggestions.length}</div>
          <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Skill Gaps</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="divide-y divide-gray-100">
        
        {/* Bulk Action */}
        <div className="p-4 bg-gray-50/50 flex justify-end">
          <Button onClick={handleApplyAll} className="bg-gray-900 text-white hover:bg-black gap-2">
            <Sparkles className="w-4 h-4" />
            Apply All Changes
          </Button>
        </div>

        {/* Optimizations List */}
        <div className="max-h-[600px] overflow-y-auto">
          {result.sections.map((section, idx) => (
            <SectionComparison 
              key={idx} 
              data={section} 
              isApplied={syncedSections.has(section.section)}
              onApply={() => {
                applyChange(section.section, section.optimized);
              }}
              onRevert={() => {
                 applyChange(section.section, section.original);
                 setSyncedSections(prev => {
                   const next = new Set(prev);
                   next.delete(section.section);
                   return next;
                 });
              }}
            />
          ))}

          {/* Keyword Gaps */}
          {result.gapSuggestions.length > 0 && (
             <div className="p-6 bg-amber-50/30">
               <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                 <Lightbulb className="w-5 h-5 text-amber-500" />
                 Recommended Gaps to Fill
               </h3>
               <div className="space-y-3">
                 {result.gapSuggestions.map((gap, i) => (
                   <div key={i} className="flex items-start gap-3 p-3 bg-white border border-amber-100 rounded-lg shadow-sm">
                     <Badge variant="outline" className={cn(
                       "mt-0.5", 
                       gap.importance === 'high' ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"
                     )}>
                       {gap.type}
                     </Badge>
                     <p className="text-sm text-gray-700">{gap.suggestion}</p>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionComparison({ 
  data, 
  isApplied, 
  onApply, 
  onRevert 
}: { 
  data: SectionOptimization; 
  isApplied: boolean; 
  onApply: () => void; 
  onRevert: () => void;
}) {
  // Helper to safe render content that might be an object (e.g. skills array)
  const renderContent = (content: any) => {
    if (typeof content === 'string') return content;
    if (typeof content === 'object') {
      // If it's a list of skills (objects), map them to names
      if (Array.isArray(content) && content.length > 0 && typeof content[0] === 'object' && 'name' in content[0]) {
        return content.map((s: any) => s.name).join(", ");
      }
      return JSON.stringify(content, null, 2);
    }
    return String(content);
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
          {isApplied && <CheckCircle2 className="w-4 h-4 text-green-600" />}
          {data.sectionLabel}
        </h4>
        <div className="flex items-center gap-2">
           {isApplied ? (
             <Button variant="outline" size="sm" onClick={onRevert} className="text-gray-500 h-8 text-xs">
               <RotateCcw className="w-3 h-3 mr-1.5" />
               Revert
             </Button>
           ) : (
             <Button size="sm" onClick={onApply} className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs shadow-sm shadow-indigo-200">
               <Check className="w-3 h-3 mr-1.5" />
               Apply Change
             </Button>
           )}
        </div>
      </div>

      {/* Changes Summary */}
      <div className="mb-4 flex flex-wrap gap-2">
        {data.changes.map((change, i) => (
          <span key={i} className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide rounded-md">
            {change}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Original</div>
          <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg text-sm text-gray-600 leading-relaxed font-mono whitespace-pre-wrap">
             {renderContent(data.original)}
          </div>
        </div>

        {/* Optimized */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center justify-between">
            <span>Optimized Version</span>
            <Sparkles className="w-3 h-3" />
          </div>
          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-sm text-gray-800 leading-relaxed shadow-sm font-medium whitespace-pre-wrap">
             {renderContent(data.optimized)}
          </div>
        </div>
      </div>
    </div>
  );
}
