"use client";

import { useState, useCallback, useMemo } from "react";
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
  ArrowLeft,
  Heart,
  Zap,
  Layout,
  Cpu,
  Link as LinkIcon,
  Crosshair,
  User,
  Mail,
  Bug,
  Lightbulb
} from "lucide-react";

// Rating options for feature feedback with premium colors
const RATING_OPTIONS = [
  { value: "very-useful", label: "Brilliant", icon: <Heart className="h-3 w-3" />, color: "bg-emerald-500", ring: "ring-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  { value: "useful", label: "Great", icon: <Zap className="h-3 w-3" />, color: "bg-blue-500", ring: "ring-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  { value: "neutral", label: "Good", icon: <CheckCircle2 className="h-3 w-3" />, color: "bg-zinc-500", ring: "ring-zinc-500", text: "text-zinc-700", bg: "bg-zinc-50" },
  { value: "not-useful", label: "Average", icon: <AlertCircle className="h-3 w-3" />, color: "bg-amber-500", ring: "ring-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  { value: "not-used", label: "Poor", icon: <ArrowRight className="h-3 w-3" />, color: "bg-neutral-400", ring: "ring-neutral-400", text: "text-neutral-600", bg: "bg-neutral-100" },
] as const;

// Features with enhanced icons and descriptions
const FEATURES = [
  { 
    id: "resume-builder", 
    name: "Resume Editor",
    description: "The core crafting experience",
    icon: <Layout className="h-5 w-5" />
  },
  { 
    id: "ai-optimization", 
    name: "AI Insights",
    description: "Smart content suggestions",
    icon: <Cpu className="h-5 w-5" />
  },
  { 
    id: "linkedin-analyzer", 
    name: "LinkedIn Sync",
    description: "Profile import & analysis",
    icon: <LinkIcon className="h-5 w-5" />
  },
  { 
    id: "job-description", 
    name: "Job Matcher",
    description: "Tailoring to job roles",
    icon: <Crosshair className="h-5 w-5" />
  },
  { 
    id: "overall-ai", 
    name: "AI Engine",
    description: "Processing speed & quality",
    icon: <Sparkles className="h-5 w-5" />
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
  { id: "intro", title: "Identity", description: "Who are you?" },
  { id: "overall", title: "Experience", description: "How's the vibe?" },
  { id: "features", title: "Capabilities", description: "Deep dive" },
  { id: "details", title: "Vision", description: "Future ideas" },
] as const;

// --- PREMIUM UI COMPONENTS ---

const BackgroundDecoration = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 blur-[120px] animate-pulse delay-700" />
    <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-emerald-50/50 blur-[80px]" />
  </div>
);

function StarRating({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (rating: number) => void;
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const labels = [
    "Needs improvement", // 0.5
    "Could be better",    // 1
    "Below average",    // 1.5
    "It's okay",         // 2
    "Fair enough",       // 2.5
    "Pretty good",       // 3
    "Impressive",        // 3.5
    "Excellent",         // 4
    "Outstanding",       // 4.5
    "Mind-blowing"       // 5
  ];

  const currentVal = hoverValue || value;

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div className="flex items-center gap-2" onMouseLeave={() => setHoverValue(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="group relative h-14 w-14 transition-all"
          >
            {/* Left half hitbox */}
            <div 
              className="absolute left-0 top-0 w-1/2 h-full z-20 cursor-pointer" 
              onMouseEnter={() => setHoverValue(star - 0.5)}
              onClick={() => onChange(star - 0.5)}
            />
            {/* Right half hitbox */}
            <div 
              className="absolute right-0 top-0 w-1/2 h-full z-20 cursor-pointer" 
              onMouseEnter={() => setHoverValue(star)}
              onClick={() => onChange(star)}
            />

            <motion.div
              className="pointer-events-none"
              animate={{
                scale: currentVal >= star - 0.5 ? 1.15 : 1,
                rotate: currentVal >= star - 0.5 ? [0, 5, -5, 0] : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                {/* Background Star */}
                <Star
                  className="h-14 w-14 text-neutral-200 fill-transparent transition-colors duration-300 group-hover:text-neutral-300"
                  strokeWidth={1.5}
                />
                
                {/* Foreground Filled Star */}
                <div 
                  className="absolute top-0 left-0 h-full overflow-hidden transition-all duration-300 ease-out"
                  style={{ 
                    width: currentVal >= star ? '100%' : currentVal >= star - 0.5 ? '50%' : '0%' 
                  }}
                >
                  <Star
                    className="h-14 w-14 fill-amber-400 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {value > 0 && (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-2xl font-black text-neutral-900 leading-none">
              {value.toFixed(1)}
            </span>
            <p className="text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent uppercase tracking-wider">
              {labels[Math.round(value * 2) - 1]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
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
    <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
      {RATING_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-all duration-300
            hover:shadow-sm active:scale-95
            ${
              value === option.value
                ? `${option.bg} ${option.text} ${option.ring} border-transparent ring-1 ring-inset shadow-inner`
                : "bg-white/50 border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-white"
            }
          `}
        >
          {option.icon}
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
      relative group rounded-2xl border transition-all duration-500 overflow-hidden
      ${feedback.rating ? "border-black/5 bg-white/40" : "border-neutral-100 bg-transparent hover:bg-white/30 hover:border-neutral-200"}
      ${isExpanded ? "ring-1 ring-black/5 shadow-sm" : ""}
    `}>
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`
            p-1 rounded-xl transition-colors duration-300
            ${feedback.rating ? "bg-black text-white" : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200 group-hover:text-neutral-600"}
          `}>
            {feature.icon}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-neutral-900 tracking-tight">
              {feature.name}
            </h4>
            <p className="text-xs text-neutral-500 font-medium">
              {feature.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <FeatureRatingOptions 
            value={feedback.rating} 
            onChange={(rating) => {
              onRatingChange(rating);
              if (rating && !isExpanded) setIsExpanded(true);
            }} 
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`
              h-8 w-8 rounded-full transition-all duration-300
              ${isExpanded || feedback.comment ? "text-black bg-black/5" : "text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100"}
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
            transition={{ duration: 0.3, ease: "circOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <Textarea
                placeholder="What details would make this perfect? (Optional)"
                value={feedback.comment}
                onChange={(e) => onCommentChange(e.target.value)}
                autoFocus={isExpanded && !feedback.comment}
                rows={2}
                className="resize-none text-sm bg-white/60 border-neutral-200 focus:bg-white focus:border-black focus-visible:ring-0 min-h-[70px] transition-all rounded-xl placeholder:text-neutral-400"
              />
            </div>
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send feedback");
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim().length > 0;
      case 1:
        return formData.overallRating > 0;
      case 2:
        return Object.values(formData.features).every(f => f.rating !== "");
      default:
        return true;
    }
  };

  // Render Step Content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Intro & Bio
        return (
          <div className="space-y-8 py-4">
            <div className="text-center space-y-3 mb-4">
               <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">The Personal Touch</h2>
              <p className="text-sm text-neutral-500 max-w-[280px] mx-auto font-medium">Your identity helps us refine our communication.</p>
            </div>
            <div className="space-y-5 text-left max-w-sm mx-auto">
              <div className="space-y-2 group">
                <Label htmlFor="name" className="flex justify-between items-center px-1">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-neutral-400 group-focus-within:text-black transition-colors">
                    <User className="h-3 w-3" />
                    Full Name
                  </span>
                  <span className="text-[9px] text-neutral-300 font-bold uppercase tracking-widest">Required</span>
                </Label>
                <Input
                  id="name"
                  placeholder="your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 bg-white/60 border-neutral-200 focus:bg-white focus:border-black focus-visible:ring-0 transition-all rounded-xl placeholder:text-neutral-300 text-base"
                />
              </div>
              <div className="space-y-2 group">
                <Label htmlFor="email" className="flex justify-between items-center px-1">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-neutral-400 group-focus-within:text-black transition-colors">
                    <Mail className="h-3 w-3" />
                    Email Address
                  </span>
                  <span className="text-[9px] text-neutral-300 font-bold uppercase tracking-widest">Optional</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-12 bg-white/60 border-neutral-200 focus:bg-white focus:border-black focus-visible:ring-0 transition-all rounded-xl placeholder:text-neutral-300 text-base"
                />
              </div>
            </div>
          </div>
        );
      
      case 1: // Overall Rating
        return (
          <div className="space-y-8 py-4">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Overall Vibe</h2>
              <p className="text-sm text-neutral-500 max-w-[300px] mx-auto font-medium">How would you rate your journey with us so far?</p>
            </div>
            <StarRating 
              value={formData.overallRating} 
              onChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
            />
          </div>
        );

      case 2: // Feature Ratings
        return (
          <div className="space-y-8 py-4">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Feature Deep-Dive</h2>
              <p className="text-sm text-neutral-500 max-w-[320px] mx-auto font-medium">Which components served you best? Every rating counts.</p>
            </div>
            <div className="space-y-3 max-h-[450px] overflow-y-auto px-1 custom-scrollbar pb-4">
              {FEATURES.map((feature, idx) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <FeatureFeedbackRow
                    feature={feature}
                    feedback={formData.features[feature.id]}
                    onRatingChange={(rating) => updateFeatureFeedback(feature.id, "rating", rating)}
                    onCommentChange={(comment) => updateFeatureFeedback(feature.id, "comment", comment)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 3: // Text Feedback
        return (
          <div className="space-y-8 py-4">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">The Vision</h2>
              <p className="text-sm text-neutral-500 max-w-[300px] mx-auto font-medium">Help us shape the roadmap of professional resumes.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2 group">
                <Label htmlFor="improvements" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-neutral-400 group-focus-within:text-green-600 transition-colors pl-1">
                  <Lightbulb className="h-3.3 w-3.3" />
                  What's Next?
                </Label>
                <Textarea
                  id="improvements"
                  placeholder="I wish the builder could..."
                  value={formData.improvements}
                  onChange={(e) => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
                  className="min-h-[120px] resize-none bg-white/60 border-neutral-200 focus:bg-white focus:border-green-600 focus-visible:ring-0 transition-all rounded-2xl p-4 text-base placeholder:text-neutral-300"
                />
              </div>
              <div className="space-y-2 group">
                 <Label htmlFor="issues" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-neutral-400 group-focus-within:text-red-500 transition-colors pl-1">
                  <Bug className="h-3.3 w-3.3" />
                  Minor Hiccups
                </Label>
                <Textarea
                  id="issues"
                  placeholder="Did something feel off?"
                  value={formData.issues}
                  onChange={(e) => setFormData(prev => ({ ...prev, issues: e.target.value }))}
                  className="min-h-[120px] resize-none bg-white/60 border-neutral-200 focus:bg-white focus:border-red-400 focus-visible:ring-0 transition-all rounded-2xl p-4 text-base placeholder:text-neutral-300"
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
    <div className="min-h-screen relative flex flex-col items-center justify-center py-20 px-4 sm:px-6">
      <BackgroundDecoration />
      
      <div className="w-full max-w-2xl pt-16 relative">
        
        {/* Header Branding */}
        <div className="text-center mb-10">
          {/* <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white shadow-xl shadow-black/10 mb-6"
          >
            <Sparkles className="h-7 w-7" />
          </motion.div> */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl"
          >
            We Value Your Voice.
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-neutral-500 font-semibold tracking-wide uppercase text-[10px]"
          >
            Your insights help us grow • It only takes a minute
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="premium-glass rounded-[2rem] p-12 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
              <div className="flex justify-center mb-6">
                <motion.div 
                  initial={{ rotate: -15, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="h-20 w-20 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-[0_20px_40px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </motion.div>
              </div>
              <h3 className="text-3xl font-black text-neutral-900 mb-3">
                Mission Success!
              </h3>
              <p className="text-neutral-500 font-medium mb-10 max-w-[320px] mx-auto leading-relaxed">
                Your insights are already fueling our next sprint. We appreciate your dedication.
              </p>
              <Button 
                onClick={() => {
                  setStatus("idle");
                  setCurrentStep(0);
                }}
                className="h-12 px-8 bg-black hover:bg-neutral-800 text-white rounded-xl font-bold shadow-lg shadow-black/10 transition-all hover:translate-y-[-2px] active:translate-y-0"
              >
                Send more insights
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-glass rounded-[2.5rem] relative overflow-hidden"
            >
              {/* Progress Indicator */}
              <div className="flex px-8 pt-8 gap-2">
                {STEPS.map((step, idx) => (
                  <div key={step.id} className="flex-1 h-1.5 relative rounded-full overflow-hidden bg-white/50">
                    <motion.div 
                      className="absolute inset-0 bg-black"
                      initial={false}
                      animate={{ 
                        width: currentStep >= idx ? "100%" : "0%",
                        opacity: currentStep === idx ? 1 : 0.4
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                ))}
              </div>

              <div className="p-8 sm:p-12">
                 <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ x: 20, opacity: 0, filter: "blur(8px)" }}
                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ x: -20, opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                  >
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                      Phase 0{currentStep + 1}
                    </div>
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-black/5">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 0 || status === "loading"}
                    className={`
                      h-12 px-6 rounded-xl font-bold transition-all
                      ${currentStep === 0 ? "invisible" : "text-neutral-400 hover:text-black hover:bg-black/5"}
                    `}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Target</p>
                      <p className="text-xs font-bold text-neutral-900">{STEPS[currentStep].title}</p>
                    </div>
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid() || status === "loading"}
                      className={`
                        h-10 min-w-[140px] px-6 rounded-xl font-black text-white shadow-xl transition-all
                        ${!isStepValid() || status === "loading" 
                          ? "bg-neutral-200 cursor-not-allowed shadow-none" 
                          : "bg-black hover:bg-neutral-800 shadow-black/10 hover:translate-y-[-2px] active:translate-y-0"}
                      `}
                    >
                      {status === "loading" ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </span>
                      ) : currentStep === STEPS.length - 1 ? (
                        <span className="flex items-center gap-2">
                          Transmit <Send className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Proceed <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Error Feedback */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-red-500 text-white"
                  >
                    <div className="flex items-center gap-3 text-sm font-bold p-4 justify-center">
                      <AlertCircle className="h-4 w-4" />
                      <p>{errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Meta */}
        <div className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-900">
            Encrypted & Secure Submission • built by Flotick
          </p>
        </div>
      </div>
    </div>
  );
}
