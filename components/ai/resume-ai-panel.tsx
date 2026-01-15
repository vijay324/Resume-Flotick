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
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">AI Resume Analysis</h3>
          <AIBadge variant={isLoading ? "loading" : "enabled"} />
        </div>
        <AIButton onClick={handleAnalyze} isLoading={isLoading}>
          {analysis ? "Re-analyze" : "Analyze Resume"}
        </AIButton>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-2">Overall Score</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${analysis.overallScore}%` }}
                  />
                </div>
                <span className="text-2xl font-bold">{analysis.overallScore}</span>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <TrendingUp className="w-4 h-4" />
                Strengths
              </div>
              <ul className="space-y-1">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {analysis.weaknesses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
                <TrendingDown className="w-4 h-4" />
                Areas for Improvement
              </div>
              <ul className="space-y-1">
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lightbulb className="w-4 h-4 text-primary" />
                Actionable Suggestions
              </div>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, index) => (
                  <Card key={index} className="p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        {suggestion.section}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          suggestion.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : suggestion.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className="text-sm">{suggestion.suggestion}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
