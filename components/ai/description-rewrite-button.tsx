"use client";

import React, { useState } from "react";
import { useRewrite } from "@/hooks/use-ai-features";
import { useAI } from "@/context/ai-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Check, X, Lock, Wand2 } from "lucide-react";
import { ApiKeyModal } from "./api-key-modal";

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
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const handleRewrite = async () => {
    if (!aiEnabled) {
      setShowApiKeyModal(true);
      return;
    }

    if (!description.trim()) return;

    // Build a context-enriched prompt
    const contextPrefix = title ? `For a "${title}" role${context ? ` at ${context}` : ""}: ` : "";
    const fullText = contextPrefix + description;

    const result = await rewrite(fullText, "professional");
    if (result) {
      setPreviewContent(result.rewritten);
      setShowPreview(true);
    }
  };

  const handleApply = () => {
    onApply(previewContent);
    setShowPreview(false);
    setPreviewContent("");
  };

  const handleCancel = () => {
    setShowPreview(false);
    setPreviewContent("");
  };

  return (
    <>
      <button
        type="button"
        onClick={handleRewrite}
        disabled={isLoading || !description.trim()}
        className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        title={!aiEnabled ? "Add API key to enable AI features" : "Rewrite with AI"}
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : !aiEnabled ? (
          <Lock className="h-3 w-3" />
        ) : (
          <Wand2 className="h-3 w-3" />
        )}
        <span>AI Rewrite</span>
      </button>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg p-5 space-y-4 bg-white shadow-2xl border-0 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Suggestion</h3>
                  <p className="text-xs text-gray-500">Review the rewritten description</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {previewContent}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleApply}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-200"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      <ApiKeyModal isOpen={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} />
    </>
  );
}
