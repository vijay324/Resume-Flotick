"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Star,
  MessageSquare 
} from "lucide-react";

// Rating options for feature feedback
const RATING_OPTIONS = [
  { value: "very-useful", label: "Very Useful", color: "bg-green-500" },
  { value: "useful", label: "Useful", color: "bg-blue-500" },
  { value: "neutral", label: "Neutral", color: "bg-gray-500" },
  { value: "not-useful", label: "Not Useful", color: "bg-red-500" },
] as const;

// Features to collect feedback on
const FEATURES = [
  { 
    id: "resume-builder", 
    name: "Resume Builder",
    description: "Core resume creation and editing experience"
  },
  { 
    id: "ai-optimization", 
    name: "AI Resume Optimization",
    description: "AI-powered content suggestions and improvements"
  },
  { 
    id: "linkedin-analyzer", 
    name: "LinkedIn Profile Analyzer",
    description: "LinkedIn profile import and analysis"
  },
  { 
    id: "job-description", 
    name: "Job Description Optimization (DCI)",
    description: "Tailoring resume to specific job descriptions"
  },
  { 
    id: "overall-ai", 
    name: "Overall AI Experience",
    description: "General AI features and responsiveness"
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

// Star Rating Component
function StarRating({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (rating: number) => void;
}) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              star <= (hoverValue || value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
          {value} / 5
        </span>
      )}
    </div>
  );
}

// Feature Rating Options Component
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
          className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
            value === option.value
              ? `${option.color} text-white border-transparent`
              : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Feature Feedback Section Component
function FeatureFeedbackSection({
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
  return (
    <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-3">
      <div>
        <h4 className="font-medium text-neutral-900 dark:text-white">
          {feature.name}
        </h4>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {feature.description}
        </p>
      </div>
      
      <FeatureRatingOptions 
        value={feedback.rating} 
        onChange={onRatingChange} 
      />
      
      <Textarea
        placeholder="Any specific feedback or suggestions? (Optional)"
        value={feedback.comment}
        onChange={(e) => onCommentChange(e.target.value)}
        rows={2}
        className="resize-none"
      />
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
    
    // Prevent duplicate submissions
    if (isSubmitting) return;
    
    // Validate required fields
    if (formData.overallRating === 0) {
      setErrorMessage("Please provide an overall rating");
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("success");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error sending feedback:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Share Your Feedback
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Help us improve our free resume builder. Your feedback helps us make this tool better for everyone.
          </p>
        </div>

        {status === "success" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-8"
          >
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Thank You!
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-sm">
                Your feedback has been sent successfully. We truly appreciate you taking the time to help us improve.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setStatus("idle")}
                className="mt-4"
              >
                Send More Feedback
              </Button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-6"
            >
              <Label className="text-lg font-semibold text-neutral-900 dark:text-white">
                Overall Experience
              </Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 mb-4">
                How would you rate your overall experience with the Resume Builder?
              </p>
              <StarRating 
                value={formData.overallRating} 
                onChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
              />
            </motion.div>

            {/* Feature-wise Feedback Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-6"
            >
              <Label className="text-lg font-semibold text-neutral-900 dark:text-white">
                Feature Feedback
              </Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 mb-4">
                Rate individual features (optional, but helps us prioritize improvements)
              </p>
              
              <div className="space-y-4">
                {FEATURES.map((feature) => (
                  <FeatureFeedbackSection
                    key={feature.id}
                    feature={feature}
                    feedback={formData.features[feature.id]}
                    onRatingChange={(rating) => updateFeatureFeedback(feature.id, "rating", rating)}
                    onCommentChange={(comment) => updateFeatureFeedback(feature.id, "comment", comment)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Additional Feedback Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4"
            >
              <Label className="text-lg font-semibold text-neutral-900 dark:text-white">
                Additional Feedback
              </Label>
              
              <div>
                <Label htmlFor="improvements" className="text-sm font-medium">
                  What can we improve?
                </Label>
                <Textarea
                  id="improvements"
                  placeholder="Tell us what features or improvements you'd like to see..."
                  value={formData.improvements}
                  onChange={(e) => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
                  rows={3}
                  className="mt-1.5 resize-none"
                />
              </div>
              
              <div>
                <Label htmlFor="issues" className="text-sm font-medium">
                  Any issues or suggestions?
                </Label>
                <Textarea
                  id="issues"
                  placeholder="Report any bugs, issues, or share your suggestions..."
                  value={formData.issues}
                  onChange={(e) => setFormData(prev => ({ ...prev, issues: e.target.value }))}
                  rows={3}
                  className="mt-1.5 resize-none"
                />
              </div>
            </motion.div>

            {/* Error Message */}
            {status === "error" && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{errorMessage}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="submit"
                disabled={status === "loading" || isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-6 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-purple-700"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending Feedback...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </motion.div>

            {/* Privacy Note */}
            <p className="text-center text-xs text-neutral-500 dark:text-neutral-500">
              This service is completely free with no sign-up required. 
              Your feedback helps us improve the experience for everyone.
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
