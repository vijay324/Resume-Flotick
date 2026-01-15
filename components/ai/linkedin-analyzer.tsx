"use client";

import React, { useState } from "react";
import { useLinkedInAnalysis } from "@/hooks/use-ai-features";
import { AIButton } from "./ai-button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Target,
  Hash,
} from "lucide-react";
import type { LinkedInAnalysis } from "@/types/ai";

export function LinkedInAnalyzer() {
  const { analyzeLinkedIn, isLoading, error } = useLinkedInAnalysis();
  const [profileText, setProfileText] = useState("");
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);

  const handleAnalyze = async () => {
    const result = await analyzeLinkedIn(profileText);
    if (result) {
      setAnalysis(result);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">LinkedIn Profile Analyzer</h3>
          <p className="text-sm text-gray-500">
            Paste your LinkedIn profile content below to get AI-powered optimization suggestions.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-text" className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">LinkedIn Profile Content</Label>
          <Textarea
            id="profile-text"
            placeholder="Paste your LinkedIn headline, about section, and experience here..."
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            rows={8}
            className="resize-none rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-black focus:border-black p-4 text-sm"
          />
        </div>

        <AIButton
          onClick={handleAnalyze}
          isLoading={isLoading}
          disabled={profileText.length < 10}
          className="w-full h-11 rounded-xl"
        >
          Analyze Profile
        </AIButton>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Profile Score */}
          <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-xs uppercase font-bold text-gray-400 mb-2 tracking-wider">Profile Strength</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                      style={{ width: `${analysis.profileScore}%` }}
                    />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{analysis.profileScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Headline Suggestions */}
          {analysis.headlineSuggestions.length > 0 && (
            <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Headline Suggestions
              </div>
              <ul className="space-y-2">
                {analysis.headlineSuggestions.map((headline, index) => (
                  <li key={index} className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-700 italic border-l-4 border-l-indigo-500">
                    "{headline}"
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Keyword Optimization */}
          {(analysis.keywordOptimization.missing.length > 0 ||
            analysis.keywordOptimization.recommended.length > 0) && (
            <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                <Hash className="w-4 h-4 text-purple-500" />
                Keyword Optimization
              </div>
              {analysis.keywordOptimization.missing.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500">Missing Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordOptimization.missing.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-orange-50 text-orange-700 border border-orange-100"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analysis.keywordOptimization.recommended.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500">Recommended Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordOptimization.recommended.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-green-50 text-green-700 border border-green-100"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recruiter Readiness */}
          <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                <Target className="w-4 h-4 text-rose-500" />
                Recruiter Readiness
              </div>
              <span className="text-xl font-bold text-gray-900">{analysis.recruiterReadiness.score}<span className="text-sm text-gray-400 font-normal">/100</span></span>
            </div>
            {analysis.recruiterReadiness.improvementAreas.length > 0 && (
              <ul className="space-y-2">
                {analysis.recruiterReadiness.improvementAreas.map((area, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recommendations */}
          {analysis.actionableRecommendations.length > 0 && (
            <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Actionable Recommendations
              </div>
              <div className="space-y-3">
                {analysis.actionableRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 rounded-lg border border-gray-100 bg-gray-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {rec.category}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wide px-2 py-1 rounded-full border ${
                          rec.impact === "high"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : rec.impact === "medium"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                              : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}
                      >
                        {rec.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{rec.recommendation}</p>
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
