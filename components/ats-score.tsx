"use client";

import React, { useMemo } from "react";
import { useResume } from "@/context/resume-context";
import { analyzeResume } from "@/lib/ats-analyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ATSScore() {
  const { resumeData } = useResume();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const result = useMemo(() => analyzeResume(resumeData), [resumeData]);

  const getColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };
  
  const getBgColor = (score: number) => {
      if (score >= 80) return "bg-green-100";
      if (score >= 50) return "bg-yellow-100";
      return "bg-red-100";
  };

  return (
    <Card className="border-2 border-primary/20 bg-primary/5 mb-4">
      <div 
         className="p-4 flex items-center justify-between cursor-pointer"
         onClick={() => setIsOpen(!isOpen)}
      >
         <div className="flex items-center gap-4">
             <div className={cn("relative flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg border-4", getColor(result.score), getBgColor(result.score).replace("bg-", "border-").replace("100", "200"))}>
                 {result.score}
             </div>
             <div>
                 <h3 className="font-bold text-lg">ATS Score</h3>
                 <p className="text-sm text-gray-500">{result.score >= 80 ? "Excellent" : result.score >= 50 ? "Needs Improvement" : "Critical Fixes Needed"}</p>
             </div>
         </div>
         <button className="text-gray-500">
             {isOpen ? <ChevronUp /> : <ChevronDown />}
         </button>
      </div>
      
      {isOpen && (
         <CardContent className="border-t pt-4">
            <h4 className="font-semibold mb-2">Suggestions</h4>
            {result.suggestions.length === 0 && (
                <p className="text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Great job! Your resume looks good.</p>
            )}
            <ul className="space-y-2">
               {result.suggestions.map((s) => (
                   <li key={s.id} className="flex items-start gap-2 text-sm">
                       {s.type === "error" && <XCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                       {s.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                       <span className={s.type === "error" ? "text-red-700 font-medium" : "text-gray-700"}>{s.message}</span>
                   </li>
               ))}
            </ul>
         </CardContent>
      )}
    </Card>
  );
}
