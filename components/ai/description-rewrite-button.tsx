"use client";

import React, { useState } from "react";
import { useRewrite } from "@/hooks/use-ai-features";
import { useAI } from "@/context/ai-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Check, X, Lock, Wand2 } from "lucide-react";
import { ApiKeyModal } from "./api-key-modal";
import { LengthSelector } from "./length-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContentLength } from "@/types/ai";

interface DescriptionRewriteButtonProps {
  description: string;
  title?: string;
  context?: string;
  onApply: (newDescription: string) => void;
}

export function DescriptionRewriteButton({
  description,
  title,
  context,
  onApply,
}: DescriptionRewriteButtonProps) {
  const { aiEnabled } = useAI();
  const { rewrite, isLoading } = useRewrite();
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"config" | "preview">("config");
  const [previewContent, setPreviewContent] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  // Config State
  const [tone, setTone] = useState<string>("professional");
  const [length, setLength] = useState<ContentLength>("medium");

  const handleStartInteraction = () => {
    if (!aiEnabled) {
      setShowApiKeyModal(true);
      return;
    }
    setStep("config");
    setShowModal(true);
  };

  const handleRewrite = async () => {
    if (!description.trim()) return;

    // Build a context-enriched prompt
    const contextPrefix = title ? `For a "${title}" role${context ? ` at ${context}` : ""}: ` : "";
    const fullText = contextPrefix + description;

    const result = await rewrite(fullText, tone, length);
    if (result) {
      setPreviewContent(result.rewritten);
      setStep("preview");
    }
  };

  const handleApply = () => {
    onApply(previewContent);
    setShowModal(false);
    setPreviewContent("");
    setStep("config");
  };

  const handleCancel = () => {
    setShowModal(false);
    setPreviewContent("");
    setStep("config");
  };

  return (
    <>
      <button
        type="button"
        onClick={handleStartInteraction}
        disabled={isLoading || !description.trim()}
        className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        title={!aiEnabled ? "Add API key to enable AI features" : "Rewrite with AI"}
      >
        {!aiEnabled ? (
          <Lock className="h-3 w-3" />
        ) : (
          <Wand2 className="h-3 w-3" />
        )}
        <span>AI Rewrite</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg p-5 space-y-4 bg-white shadow-2xl border-0 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">
                    {step === "config" ? "Configure Rewrite" : "AI Suggestion"}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {step === "config" ? "Choose how you want to rewrite" : "Review the rewritten description"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {step === "config" ? (
              <div className="space-y-4 py-2">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tone</label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="confident">Confident</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Length</label>
                    <div className="w-full">
                      <LengthSelector value={length} onChange={setLength} className="w-full [&>button]:w-full" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleRewrite}
                    disabled={isLoading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Rewrite
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              // Preview Step
              <>
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 max-h-[300px] overflow-y-auto">
                  <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                    {previewContent}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setStep("config")}
                    variant="ghost"
                    className="text-zinc-500"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleApply}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Apply Changes
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      <ApiKeyModal isOpen={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} />
    </>
  );
}
