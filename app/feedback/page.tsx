"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Star,
  MessageSquare,
  Sparkles
} from "lucide-react";

// Rating options for feature feedback with refined colors
const RATING_OPTIONS = [
  { value: "very-useful", label: "Very Useful", color: "bg-emerald-500", ring: "ring-emerald-500", text: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { value: "useful", label: "Useful", color: "bg-blue-500", ring: "ring-blue-500", text: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { value: "neutral", label: "Neutral", color: "bg-gray-500", ring: "ring-gray-500", text: "text-gray-700 dark:text-gray-300", bg: "bg-gray-50 dark:bg-gray-900/20" },
  { value: "not-useful", label: "Not Useful", color: "bg-red-500", ring: "ring-red-500", text: "text-red-700 dark:text-red-300", bg: "bg-red-50 dark:bg-red-900/20" },
  { value: "not-used", label: "Not Used", color: "bg-neutral-400", ring: "ring-neutral-400", text: "text-neutral-600 dark:text-neutral-400", bg: "bg-neutral-100 dark:bg-neutral-800" },
] as const;

// Features to collect feedback on
const FEATURES = [
  { 
    id: "resume-builder", 
    name: "Resume Builder",
    description: "Core editor logic"
  },
  { 
    id: "ai-optimization", 
    name: "AI Optimization",
    description: "Suggestions quality"
  },
  { 
    id: "linkedin-analyzer", 
    name: "LinkedIn Import",
    description: "Profile analysis"
  },
  { 
    id: "job-description", 
    name: "Job Matching",
    description: "DCI relevance"
  },
  { 
    id: "overall-ai", 
    name: "AI Experience",
    description: "Speed & accuracy"
  },
] as const;

type FeatureId = typeof FEATURES[number]["id"];
type RatingValue = typeof RATING_OPTIONS[number]["value"] | "";

interface FeatureFeedback {
  rating: RatingValue;
  comment: string;
}

interface FeedbackFormData {
  overallRating: number;
  features: Record<FeatureId, FeatureFeedback>;
  improvements: string;
  issues: string;
}

const initialFormData: FeedbackFormData = {
  overallRating: 0,
  features: {
    "resume-builder": { rating: "", comment: "" },
    "ai-optimization": { rating: "", comment: "" },
    "linkedin-analyzer": { rating: "", comment: "" },
    "job-description": { rating: "", comment: "" },
    "overall-ai": { rating: "", comment: "" },
  },
  improvements: "",
  issues: "",
};

// Minimalist Star Rating Component
function StarRating({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (rating: number) => void;
}) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverValue(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            className="group relative p-1 focus:outline-none transition-transform active:scale-95"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={`h-8 w-8 transition-all duration-200 ${
                star <= (hoverValue || value)
                  ? "fill-amber-400 text-amber-400 drop-shadow-sm scale-110"
                  : "fill-transparent text-neutral-200 dark:text-neutral-800 group-hover:text-neutral-300 dark:group-hover:text-neutral-700"
              }`}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      <span className={`text-sm font-medium transition-opacity duration-300 ${value > 0 ? "opacity-100" : "opacity-0"} text-amber-600 dark:text-amber-500`}>
        {value === 1 ? "Poor" : value === 2 ? "Fair" : value === 3 ? "Good" : value === 4 ? "Very Good" : "Excellent"}
      </span>
    </div>
  );
}

// Feature Rating Chip
function FeatureRatingOptions({
  value,
  onChange,
}: {
  value: RatingValue;
  onChange: (rating: RatingValue) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {RATING_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200
            hover:scale-105 active:scale-95
            ${
              value === option.value
                ? `${option.bg} ${option.text} ${option.ring} border-transparent ring-1 ring-inset`
                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Feature Row
function FeatureFeedbackRow({
  feature,
  feedback,
  onRatingChange,
  onCommentChange,
}: {
  feature: typeof FEATURES[number];
  feedback: FeatureFeedback;
  onRatingChange: (rating: RatingValue) => void;
  onCommentChange: (comment: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`
      group rounded-xl border border-transparent transition-all duration-200
      hover:bg-neutral-50 dark:hover:bg-neutral-900/50
      ${isExpanded || feedback.comment ? "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800" : ""}
    `}>
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-[140px]">
          <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
            {feature.name}
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            {feature.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <FeatureRatingOptions 
            value={feedback.rating} 
            onChange={(rating) => {
              onRatingChange(rating);
              if (rating && rating !== "not-used" && !isExpanded) setIsExpanded(true);
            }} 
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`
              h-8 w-8 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300
              ${isExpanded || feedback.comment ? "text-neutral-600 dark:text-neutral-300 bg-black/5 dark:bg-white/5" : ""}
            `}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {(isExpanded || feedback.comment) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden px-3 pb-3 sm:px-4 sm:pb-4"
          >
            <Textarea
              placeholder="Tell us more... (Optional)"
              value={feedback.comment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={2}
              className="resize-none text-sm bg-white dark:bg-black/20 border-neutral-200 dark:border-neutral-800 focus:border-neutral-300 dark:focus:border-neutral-700 min-h-[60px]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FeedbackPage() {
  const [formData, setFormData] = useState<FeedbackFormData>(initialFormData);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFeatureFeedback = useCallback(
    (featureId: FeatureId, field: keyof FeatureFeedback, value: string) => {
      setFormData((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [featureId]: {
            ...prev.features[featureId],
            [field]: value,
          },
        },
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (formData.overallRating === 0) {
      setErrorMessage("Please verify your overall experience with a rating.");
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      setStatus("success");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 py-20 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-100 dark:border-neutral-800 mb-2"
          >
            <Sparkles className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />
          </motion.div>
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white"
          >
            We value your voice
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-neutral-500 dark:text-neutral-400"
          >
            Help us craft the ultimate resume building experience.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                Feedback Received
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                Thank you for helping us grow. We read every update.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setStatus("idle")}
                className="mx-auto"
              >
                Send another response
              </Button>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {/* Overall Rating */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
                <Label className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                  How was your experience?
                </Label>
                <StarRating 
                  value={formData.overallRating} 
                  onChange={(rating) => {
                    setFormData(prev => ({ ...prev, overallRating: rating }));
                    if (status === "error") setStatus("idle");
                  }} 
                />
              </div>

              {/* Detailed Feedback */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-6">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                    Feature breakdown
                  </Label>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Which tools worked well for you?
                  </p>
                </div>

                <div className="space-y-2">
                  {FEATURES.map((feature) => (
                    <FeatureFeedbackRow
                      key={feature.id}
                      feature={feature}
                      feedback={formData.features[feature.id]}
                      onRatingChange={(rating) => updateFeatureFeedback(feature.id, "rating", rating)}
                      onCommentChange={(comment) => updateFeatureFeedback(feature.id, "comment", comment)}
                    />
                  ))}
                </div>
              </div>

              {/* Text Areas */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="improvements" className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 pl-1">
                    Suggestion Box
                  </Label>
                  <Textarea
                    id="improvements"
                    placeholder="What feature should we build next?"
                    value={formData.improvements}
                    onChange={(e) => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
                    className="min-h-[100px] resize-none bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:border-neutral-300 dark:focus:border-neutral-700"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="issues" className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 pl-1">
                    Bug Report
                  </Label>
                  <Textarea
                    id="issues"
                    placeholder="Did you run into any hiccups?"
                    value={formData.issues}
                    onChange={(e) => setFormData(prev => ({ ...prev, issues: e.target.value }))}
                    className="min-h-[100px] resize-none bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:border-neutral-300 dark:focus:border-neutral-700"
                  />
                </div>
              </div>

              {/* Error State */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <Button
                type="submit"
                disabled={status === "loading" || isSubmitting}
                className="w-full h-12 text-sm font-medium transition-all shadow-sm hover:shadow-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                <span>Send Feedback</span>
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
