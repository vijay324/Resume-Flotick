"use client";

import React, { useState } from "react";
import { useResume } from "@/context/resume-context";
import { useJobOptimization } from "@/hooks/use-ai-features";
import { AIButton } from "./ai-button";
import { AIBadge } from "./ai-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Briefcase, Sparkles, X, Plus } from "lucide-react";
import type { JobDescriptionInput, OptimizedResumeResult, ContentLength } from "@/types/ai";
import { OptimizationPreview } from "./optimization-preview";
import { LengthSelector } from "./length-selector";

export function JobOptimizerPanel() {
  const { resumeData } = useResume();
  const { optimizeForJob, isLoading, error } = useJobOptimization();
  const [result, setResult] = useState<OptimizedResumeResult | null>(null);
  
  // Form State
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [responsibilities, setResponsibilities] = useState("");
  const [length, setLength] = useState<ContentLength>("medium");

  const handleAddSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      setRequiredSkills([...requiredSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setRequiredSkills(requiredSkills.filter(skill => skill !== skillToRemove));
  };

  const handleOptimize = async () => {
    if (!jobTitle.trim() || !description.trim()) return;

    const input: JobDescriptionInput = {
      jobTitle,
      company: company || undefined,
      description,
      requiredSkills,
      responsibilities: responsibilities || undefined,
      length
    };

    const optimizationResult = await optimizeForJob(resumeData, input);
    if (optimizationResult) {
      setResult(optimizationResult);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  if (result) {
    return <OptimizationPreview result={result} onBack={handleReset} />;
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Tailor Resume to Job
            </h3>
            <AIBadge variant={isLoading ? "loading" : "enabled"} />
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Paste a job description to get AI-powered optimizations for this specific role.
        </p>
      </div>

      <div className="p-5 space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Job Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jobTitle"
              placeholder="e.g. Senior Frontend Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="bg-gray-50/50 focus:bg-white transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Company (Optional)
            </Label>
            <Input
              id="company"
              placeholder="e.g. Acme Corp"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-gray-50/50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Job Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Paste the full job description here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[150px] bg-gray-50/50 focus:bg-white transition-colors leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
             Output Length
          </Label>
          <LengthSelector value={length} onChange={setLength} className="w-full [&>button]:w-full bg-gray-50/50" />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Required Skills
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add key skills..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
              className="bg-gray-50/50 focus:bg-white transition-colors"
            />
            <Button 
              type="button" 
              onClick={() => handleAddSkill()} 
              variant="outline" 
              size="icon"
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {requiredSkills.map((skill, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium"
                >
                  {skill}
                  <button 
                    onClick={() => removeSkill(skill)}
                    className="hover:text-indigo-900 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsibilities" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Key Responsibilities (Optional)
          </Label>
          <Textarea
            id="responsibilities"
            placeholder="Paste key responsibilities or requirements..."
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            className="min-h-[100px] bg-gray-50/50 focus:bg-white transition-colors"
          />
        </div>

        <div className="pt-2">
          <AIButton 
            onClick={handleOptimize} 
            isLoading={isLoading} 
            disabled={!jobTitle || !description || isLoading}
            className="w-full justify-center h-12 text-sm font-semibold"
          >
            {isLoading ? "Analyzing Job & Optimizing Resume..." : "Optimize Resume for This Job"}
          </AIButton>
          <p className="text-xs text-center text-gray-400 mt-3">
            AI will analyze your resume against this job description to suggest improvements.
          </p>
        </div>
      </div>
    </div>
  );
}
