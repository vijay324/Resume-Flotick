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
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">LinkedIn Profile Analyzer</h3>
          <p className="text-sm text-muted-foreground">
            Paste your LinkedIn profile content below to get AI-powered optimization suggestions.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-text">LinkedIn Profile Content</Label>
          <Textarea
            id="profile-text"
            placeholder="Paste your LinkedIn headline, about section, and experience here..."
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            rows={8}
            className="resize-none"
          />
        </div>

        <AIButton
          onClick={handleAnalyze}
          isLoading={isLoading}
          disabled={profileText.length < 10}
          className="w-full"
        >
          Analyze Profile
        </AIButton>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </Card>

      {analysis && (
        <div className="space-y-4">
          {/* Profile Score */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-2">Profile Strength</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${analysis.profileScore}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold">{analysis.profileScore}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Headline Suggestions */}
          {analysis.headlineSuggestions.length > 0 && (
            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4 text-primary" />
                Headline Suggestions
              </div>
              <ul className="space-y-2">
                {analysis.headlineSuggestions.map((headline, index) => (
                  <li key={index} className="p-3 rounded-md bg-muted text-sm">
                    {headline}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Keyword Optimization */}
          {(analysis.keywordOptimization.missing.length > 0 ||
            analysis.keywordOptimization.recommended.length > 0) && (
            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Hash className="w-4 h-4 text-primary" />
                Keyword Optimization
              </div>
              {analysis.keywordOptimization.missing.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Missing Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordOptimization.missing.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-md bg-orange-100 text-orange-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analysis.keywordOptimization.recommended.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Recommended Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordOptimization.recommended.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Recruiter Readiness */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Target className="w-4 h-4 text-primary" />
                Recruiter Readiness
              </div>
              <span className="text-lg font-bold">{analysis.recruiterReadiness.score}/100</span>
            </div>
            {analysis.recruiterReadiness.improvementAreas.length > 0 && (
              <ul className="space-y-1">
                {analysis.recruiterReadiness.improvementAreas.map((area, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {area}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Recommendations */}
          {analysis.actionableRecommendations.length > 0 && (
            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lightbulb className="w-4 h-4 text-primary" />
                Actionable Recommendations
              </div>
              <div className="space-y-3">
                {analysis.actionableRecommendations.map((rec, index) => (
                  <Card key={index} className="p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        {rec.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          rec.impact === "high"
                            ? "bg-red-100 text-red-700"
                            : rec.impact === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {rec.impact} impact
                      </span>
                    </div>
                    <p className="text-sm">{rec.recommendation}</p>
                  </Card>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
