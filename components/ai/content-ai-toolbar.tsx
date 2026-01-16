"use client";

import React, { useState } from "react";
import { useSummarize, useRewrite } from "@/hooks/use-ai-features";
import { Button } from "@/components/ui/button";
import { AIButton } from "./ai-button";
import { Sparkles, X, Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LengthSelector } from "./length-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContentLength } from "@/types/ai";

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
  
  // Configuration State
  const [tone, setTone] = useState<string>("professional");
  const [length, setLength] = useState<ContentLength>("medium");

  const handleSummarize = async () => {
    if (!content) return;
    const result = await summarize(content, context);
    if (result) {
      setPreviewContent(result.summary);
      setShowPreview(true);
    }
  };

  const handleRewrite = async () => {
    if (!content) return;
    const result = await rewrite(content, tone, length);
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
      <div className="flex items-center gap-2 flex-wrap bg-gray-50/50 p-1.5 rounded-lg border border-gray-100">
        <AIButton
          onClick={handleSummarize}
          isLoading={isSummarizing}
          disabled={!content}
          size="sm"
          variant="outline"
          className="bg-white"
        >
          Summarize
        </AIButton>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Rewrite:</span>
          
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="h-8 w-[110px] text-xs bg-white">
              <SelectValue placeholder="Tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional" className="text-xs">Professional</SelectItem>
              <SelectItem value="confident" className="text-xs">Confident</SelectItem>
              <SelectItem value="friendly" className="text-xs">Friendly</SelectItem>
            </SelectContent>
          </Select>

          <LengthSelector value={length} onChange={setLength} className="bg-white rounded-md" />

          <Button
            onClick={handleRewrite}
            disabled={!content || isRewriting}
            size="sm"
            className="h-8 min-w-8 p-0 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-2"
          >
            {isRewriting ? (
              <>
                <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                <span className="text-[10px] font-medium">Generating...</span>
              </>
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      {showPreview && (
        <Card className="p-4 space-y-3 border-indigo-100 shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2 text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              AI Suggestion
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50/50 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed border border-indigo-50">
            {previewContent}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleApply} size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200">
              <Check className="w-3.5 h-3.5 mr-2" />
              Apply Change
            </Button>
            <Button
              onClick={() => setShowPreview(false)}
              size="sm"
              variant="outline"
              className="border-gray-200"
            >
              Discard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
