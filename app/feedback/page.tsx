"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Star,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

// Rating options for feature feedback
const RATING_OPTIONS = [
  { value: "very-useful", label: "Very Useful", color: "bg-emerald-500", ring: "ring-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  { value: "useful", label: "Useful", color: "bg-blue-500", ring: "ring-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  { value: "neutral", label: "Neutral", color: "bg-gray-500", ring: "ring-gray-500", text: "text-gray-700", bg: "bg-gray-50" },
  { value: "not-useful", label: "Not Useful", color: "bg-red-500", ring: "ring-red-500", text: "text-red-700", bg: "bg-red-50" },
  { value: "not-used", label: "Not Used", color: "bg-neutral-400", ring: "ring-neutral-400", text: "text-neutral-600", bg: "bg-neutral-100" },
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
  name: string;
  email: string;
  overallRating: number;
  features: Record<FeatureId, FeatureFeedback>;
  improvements: string;
  issues: string;
}

const initialFormData: FeedbackFormData = {
  name: "",
  email: "",
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

// Wizard Steps
const STEPS = [
  { id: "intro", title: "Welcome" },
  { id: "overall", title: "Overall Experience" },
  { id: "features", title: "Feature Ratings" },
  { id: "details", title: "Additional Details" },
] as const;

// --- COMPONENTS ---

function StarRating({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (rating: number) => void;
}) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="flex items-center gap-3" onMouseLeave={() => setHoverValue(0)}>
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
              className={`h-10 w-10 transition-all duration-200 ${
                star <= (hoverValue || value)
                  ? "fill-amber-400 text-amber-400 drop-shadow-sm scale-110"
                  : "fill-transparent text-neutral-200 group-hover:text-neutral-300"
              }`}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      <span className={`text-lg font-medium transition-opacity duration-300 ${value > 0 ? "opacity-100" : "opacity-0"} text-amber-600`}>
        {value === 1 ? "Poor" : value === 2 ? "Fair" : value === 3 ? "Good" : value === 4 ? "Very Good" : "Excellent"}
      </span>
    </div>
  );
}

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
                : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

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
      hover:bg-neutral-50
      ${isExpanded || feedback.comment ? "bg-neutral-50 border-neutral-200" : ""}
    `}>
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-[140px]">
          <h4 className="font-medium text-sm text-neutral-900">
            {feature.name}
          </h4>
          <p className="text-xs text-neutral-500">
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
              h-8 w-8 rounded-full text-neutral-400 hover:text-neutral-600
              ${isExpanded || feedback.comment ? "text-neutral-600 bg-black/5" : ""}
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
              className="resize-none text-sm bg-white border-neutral-200 focus:border-neutral-300 min-h-[60px]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- MAIN PAGE ---

export default function FeedbackPage() {
  const [formData, setFormData] = useState<FeedbackFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
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

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleSubmit = async () => {
    if (formData.overallRating === 0) {
      setErrorMessage("Please provide an overall rating before submitting.");
      setStatus("error");
      return;
    }

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
      setCurrentStep(0);
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send feedback");
    }
  };

  const isStepValid = () => {
    if (currentStep === 1 && formData.overallRating === 0) return false;
    return true;
  };

  // Render Step Content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Intro & Bio
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
               <h2 className="text-xl font-semibold text-neutral-900">Let&#39;s get to know you</h2>
              <p className="text-sm text-neutral-500">This helps us follow up if needed (Optional)</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white border-neutral-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white border-neutral-200"
                />
              </div>
            </div>
          </div>
        );
      
      case 1: // Overall Rating
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xl font-semibold text-neutral-900">How was your experience?</h2>
              <p className="text-sm text-neutral-500">Rate your overall satisfaction with the Resume Builder</p>
            </div>
            <StarRating 
              value={formData.overallRating} 
              onChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
            />
          </div>
        );

      case 2: // Feature Ratings
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Feature Breakdown</h2>
              <p className="text-sm text-neutral-500">Which tools worked well for you?</p>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
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
        );

      case 3: // Text Feedback
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Final Thoughts</h2>
              <p className="text-sm text-neutral-500">Any bugs or suggestions?</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="improvements" className="text-xs font-medium uppercase tracking-wider text-neutral-500 pl-1">
                  Suggestion Box
                </Label>
                <Textarea
                  id="improvements"
                  placeholder="What feature should we build next?"
                  value={formData.improvements}
                  onChange={(e) => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
                  className="min-h-[100px] resize-none bg-white border-neutral-200 focus:border-neutral-300"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="issues" className="text-xs font-medium uppercase tracking-wider text-neutral-500 pl-1">
                  Bug Report
                </Label>
                <Textarea
                  id="issues"
                  placeholder="Did you run into any hiccups?"
                  value={formData.issues}
                  onChange={(e) => setFormData(prev => ({ ...prev, issues: e.target.value }))}
                  className="min-h-[100px] resize-none bg-white border-neutral-200 focus:border-neutral-300"
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-sm border border-neutral-100 mb-2"
          >
            <Sparkles className="h-5 w-5 text-neutral-900" />
          </motion.div>
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-semibold tracking-tight text-neutral-900"
          >
            We value your voice
          </motion.h1>
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Feedback Received
              </h3>
              <p className="text-sm text-neutral-500 mb-6">
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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden"
            >
              {/* Progress Bar */}
              <div className="h-1 bg-neutral-100 w-full">
                <motion.div 
                  className="h-full bg-neutral-900"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="p-6 sm:p-8">
                 <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-100">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 0 || status === "loading"}
                    className={currentStep === 0 ? "invisible" : ""}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 font-medium">
                      Step {currentStep + 1} of {STEPS.length}
                    </span>
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid() || status === "loading"}
                      className="bg-neutral-900 hover:bg-neutral-800 text-white min-w-[100px]"
                    >
                      {status === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : currentStep === STEPS.length - 1 ? (
                        <>
                          Submit
                          <Send className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Error State */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-red-50 border-t border-red-100"
                  >
                    <div className="flex items-center gap-2 text-sm text-red-600 p-3 justify-center">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
