"use client";

import React, { useState, useMemo } from "react";
import { useLinkedInAnalysis } from "@/hooks/use-ai-features";
import { AIButton } from "./ai-button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Target,
  Hash,
  Link2,
  ExternalLink,
  Copy,
  CheckCircle2,
  Info,
} from "lucide-react";
import type { LinkedInAnalysis } from "@/types/ai";

// Validate LinkedIn profile URL
function isValidLinkedInUrl(url: string): boolean {
  if (!url) return false;
  const pattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i;
  return pattern.test(url.trim());
}

// Extract username from LinkedIn URL
function extractUsername(url: string): string | null {
  const match = url.match(/linkedin\.com\/in\/([\w-]+)/i);
  return match ? match[1] : null;
}

export function LinkedInAnalyzer() {
  const { analyzeLinkedIn, isLoading, error } = useLinkedInAnalysis();
  const [profileUrl, setProfileUrl] = useState("");
  const [profileText, setProfileText] = useState("");
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const isValidUrl = useMemo(() => isValidLinkedInUrl(profileUrl), [profileUrl]);
  const username = useMemo(() => extractUsername(profileUrl), [profileUrl]);

  const handleOpenProfile = () => {
    if (isValidUrl) {
      window.open(profileUrl, "_blank", "noopener,noreferrer");
      setStep(2);
    }
  };

  const handleAnalyze = async () => {
    const result = await analyzeLinkedIn(profileText, profileUrl);
    if (result) {
      setAnalysis(result);
    }
  };

  const handleReset = () => {
    setProfileUrl("");
    setProfileText("");
    setAnalysis(null);
    setStep(1);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 bg-white border border-zinc-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-5">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">LinkedIn Profile Analyzer</h3>
          <p className="text-sm text-zinc-500">
            Paste your LinkedIn profile URL to get AI-powered optimization suggestions.
          </p>
        </div>

        {/* Step 1: URL Input */}
        <div className="space-y-3">
          <Label htmlFor="profile-url" className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-2">
            <Link2 className="w-3 h-3" />
            LinkedIn Profile URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="profile-url"
              type="url"
              placeholder="https://www.linkedin.com/in/your-username"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="flex-1 rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-black focus:border-black text-sm"
            />
            {isValidUrl && (
              <button
                type="button"
                onClick={handleOpenProfile}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </button>
            )}
          </div>
          
          {/* URL Validation Feedback */}
          {profileUrl && (
            <div className={`flex items-center gap-2 text-xs ${isValidUrl ? 'text-green-600' : 'text-orange-500'}`}>
              {isValidUrl ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Profile detected: <strong>{username}</strong></span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please enter a valid LinkedIn profile URL (e.g., linkedin.com/in/username)</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Instructions & Text Input */}
        {isValidUrl && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Instructions Card */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                <Info className="w-4 h-4" />
                How to copy your profile content
              </div>
              <ol className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-200 text-blue-800 rounded-full text-xs font-bold flex items-center justify-center">1</span>
                  <span>Click <strong>"Open"</strong> to view your LinkedIn profile in a new tab</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-200 text-blue-800 rounded-full text-xs font-bold flex items-center justify-center">2</span>
                  <span>Select all text on the page: <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">Ctrl+A</kbd> or <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">⌘+A</kbd></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-200 text-blue-800 rounded-full text-xs font-bold flex items-center justify-center">3</span>
                  <span>Copy the text: <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">Ctrl+C</kbd> or <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">⌘+C</kbd></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-200 text-blue-800 rounded-full text-xs font-bold flex items-center justify-center">4</span>
                  <span>Paste it in the box below</span>
                </li>
              </ol>
            </div>

            {/* Text Area */}
            <div className="space-y-2">
              <Label htmlFor="profile-text" className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-2">
                <Copy className="w-3 h-3" />
                Paste Profile Content Here
              </Label>
              <Textarea
                id="profile-text"
                placeholder="Paste your LinkedIn profile content here..."
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                rows={8}
                className="resize-none rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-black focus:border-black p-4 text-sm"
              />
              {profileText.length > 0 && (
                <div className="text-xs text-zinc-400">
                  {profileText.length} characters
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <AIButton
              onClick={handleAnalyze}
              isLoading={isLoading}
              disabled={profileText.length < 50}
              className="w-full h-11 rounded-xl"
            >
              Analyze Profile
            </AIButton>

            {profileText.length > 0 && profileText.length < 50 && (
              <p className="text-xs text-orange-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Please paste more content (minimum 50 characters for analysis)
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-zinc-500 hover:text-zinc-700 underline"
            >
              Analyze another profile
            </button>
          </div>

          {/* Profile Score */}
          <div className="p-5 bg-white border border-zinc-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-xs uppercase font-bold text-zinc-400 mb-2 tracking-wider">Profile Strength</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                      style={{ width: `${analysis.profileScore}%` }}
                    />
                  </div>
                  <span className="text-3xl font-bold text-zinc-900">{analysis.profileScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Headline Suggestions */}
          {analysis.headlineSuggestions.length > 0 && (
            <div className="p-5 bg-white border border-zinc-100 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 uppercase tracking-wide">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Headline Suggestions
              </div>
              <ul className="space-y-2">
                {analysis.headlineSuggestions.map((headline, index) => (
                  <li key={index} className="p-4 rounded-lg bg-zinc-50 border border-zinc-100 text-sm text-zinc-700 italic border-l-4 border-l-indigo-500">
                    "{headline}"
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Keyword Optimization */}
          {(analysis.keywordOptimization.missing.length > 0 ||
            analysis.keywordOptimization.recommended.length > 0) && (
            <div className="p-5 bg-white border border-zinc-100 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 uppercase tracking-wide">
                <Hash className="w-4 h-4 text-purple-500" />
                Keyword Optimization
              </div>
              {analysis.keywordOptimization.missing.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-zinc-500">Missing Keywords</div>
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
                  <div className="text-xs font-semibold text-zinc-500">Recommended Keywords</div>
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
          <div className="p-5 bg-white border border-zinc-100 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 uppercase tracking-wide">
                <Target className="w-4 h-4 text-rose-500" />
                Recruiter Readiness
              </div>
              <span className="text-xl font-bold text-zinc-900">{analysis.recruiterReadiness.score}<span className="text-sm text-zinc-400 font-normal">/100</span></span>
            </div>
            {analysis.recruiterReadiness.improvementAreas.length > 0 && (
              <ul className="space-y-2">
                {analysis.recruiterReadiness.improvementAreas.map((area, index) => (
                  <li key={index} className="text-sm text-zinc-600 flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recommendations */}
          {analysis.actionableRecommendations.length > 0 && (
            <div className="p-5 bg-white border border-zinc-100 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 uppercase tracking-wide">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Actionable Recommendations
              </div>
              <div className="space-y-3">
                {analysis.actionableRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 rounded-lg border border-zinc-100 bg-zinc-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
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
                    <p className="text-sm text-zinc-700">{rec.recommendation}</p>
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
