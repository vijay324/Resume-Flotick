"use client";

import React, { useState } from "react";
import { useResume } from "@/context/resume-context";
import { useResumeAnalysis } from "@/hooks/use-ai-features";
import { AIButton } from "./ai-button";
import { AIBadge } from "./ai-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Lightbulb, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ResumeAnalysis } from "@/types/ai";

export function ResumeAIPanel() {
  const { resumeData } = useResume();
  const { analyzeResume, isLoading, error } = useResumeAnalysis();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const handleAnalyze = async () => {
    const result = await analyzeResume(resumeData);
    if (result) {
      setAnalysis(result);
    }
  };

  return (
    <div className="p-5 bg-white border border-zinc-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-zinc-900">AI Resume Analysis</h3>
          <AIBadge variant={isLoading ? "loading" : "enabled"} />
        </div>
        <AIButton onClick={handleAnalyze} isLoading={isLoading}>
          {analysis ? "Re-analyze" : "Analyze Resume"}
        </AIButton>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Overall Score */}
          <div className="flex items-center gap-4 p-4 bg-zinc-50/50 rounded-xl border border-zinc-100">
            <div className="flex-1">
              <div className="text-xs uppercase font-bold text-zinc-400 mb-2 tracking-wider">Overall Score</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 transition-all duration-1000 ease-out"
                    style={{ width: `${analysis.overallScore}%` }}
                  />
                </div>
                <span className="text-3xl font-bold text-zinc-900">{analysis.overallScore}</span>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-green-700 uppercase tracking-wide">
                <TrendingUp className="w-4 h-4" />
                Strengths
              </div>
              <ul className="grid gap-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm p-3 bg-green-50/50 border border-green-100 rounded-lg text-green-800">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {analysis.weaknesses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-orange-700 uppercase tracking-wide">
                <TrendingDown className="w-4 h-4" />
                Areas for Improvement
              </div>
              <ul className="grid gap-2">
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm p-3 bg-orange-50/50 border border-orange-100 rounded-lg text-orange-800">
                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 uppercase tracking-wide">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Actionable Suggestions
              </div>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 bg-white border border-zinc-100 rounded-xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        {suggestion.section}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wide px-2 py-1 rounded-full border ${
                          suggestion.priority === "high"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : suggestion.priority === "medium"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                              : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}
                      >
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-700 leading-relaxed">{suggestion.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
