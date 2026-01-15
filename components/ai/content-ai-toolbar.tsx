"use client";

import React, { useState } from "react";
import { useSummarize, useRewrite } from "@/hooks/use-ai-features";
import { Button } from "@/components/ui/button";
import { AIButton } from "./ai-button";
import { Sparkles, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ContentAIToolbarProps {
  content: string;
  onApply: (newContent: string) => void;
  context?: string;
}

export function ContentAIToolbar({
  content,
  onApply,
  context,
}: ContentAIToolbarProps) {
  const { summarize, isLoading: isSummarizing } = useSummarize();
  const { rewrite, isLoading: isRewriting } = useRewrite();
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [selectedTone, setSelectedTone] = useState<
    "professional" | "concise" | "detailed"
  >("professional");

  const handleSummarize = async () => {
    if (!content) return;
    const result = await summarize(content, context);
    if (result) {
      setPreviewContent(result.summary);
      setShowPreview(true);
    }
  };

  const handleRewrite = async (tone: "professional" | "concise" | "detailed") => {
    if (!content) return;
    setSelectedTone(tone);
    const result = await rewrite(content, tone);
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

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <AIButton
          onClick={handleSummarize}
          isLoading={isSummarizing}
          disabled={!content}
          size="sm"
          variant="outline"
        >
          Summarize
        </AIButton>

        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Rewrite:</span>
          <Button
            onClick={() => handleRewrite("professional")}
            disabled={!content || isRewriting}
            size="sm"
            variant="outline"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Professional
          </Button>
          <Button
            onClick={() => handleRewrite("concise")}
            disabled={!content || isRewriting}
            size="sm"
            variant="outline"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Concise
          </Button>
          <Button
            onClick={() => handleRewrite("detailed")}
            disabled={!content || isRewriting}
            size="sm"
            variant="outline"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Detailed
          </Button>
        </div>
      </div>

      {showPreview && (
        <Card className="p-4 space-y-3 border-primary/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Suggestion
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-3 rounded-md bg-muted text-sm whitespace-pre-wrap">
            {previewContent}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleApply} size="sm" className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Apply
            </Button>
            <Button
              onClick={() => setShowPreview(false)}
              size="sm"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
