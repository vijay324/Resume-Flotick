"use client";

import { motion } from "framer-motion";
import { 
  Wand2, 
  Eye, 
  CheckCircle, 
  ShieldCheck, 
  FileText, 
  History, 
  Download, 
  Linkedin
} from "lucide-react";
import { cn } from "@/lib/utils"; 

const features = [
  {
    title: "AI-Powered Writing",
    description: "Instantly rewrite bullet points, fix grammar, and optimize for keywords with advanced AI.",
    icon: Wand2,
    className: "md:col-span-2 md:row-span-2",
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
    textGradient: "text-blue-500",
    delay: 0.1
  },
  {
    title: "LinkedIn Import",
    description: "Transform your LinkedIn profile URL into a professional resume in seconds.",
    icon: Linkedin,
    className: "md:col-span-2",
    gradient: "from-sky-500/20 to-blue-600/20",
    textGradient: "text-sky-600",
    delay: 0.2
  },
  {
    title: "Real-time Preview",
    description: "See changes instantly as you type. WYSIWYG editing.",
    icon: Eye,
    className: "md:col-span-1",
    gradient: "from-amber-500/20 to-orange-500/20",
    textGradient: "text-amber-500",
    delay: 0.3
  },
  {
    title: "Privacy First",
    description: "100% local. Your data stays on your device and never hits our servers.",
    icon: ShieldCheck,
    className: "md:col-span-1",
    gradient: "from-emerald-500/20 to-green-500/20",
    textGradient: "text-emerald-500",
    delay: 0.4
  },
  {
    title: "ATS Optimized",
    description: "Clean code and formatting designed to beat the robots.",
    icon: CheckCircle,
    className: "md:col-span-1",
    gradient: "from-rose-500/20 to-pink-500/20",
    textGradient: "text-rose-500",
    delay: 0.5
  },
  {
    title: "Smart Pagination",
    description: "Automatic page handling ensures your resume looks perfect on A4.",
    icon: FileText,
    className: "md:col-span-1",
    gradient: "from-cyan-500/20 to-teal-500/20",
    textGradient: "text-cyan-500",
    delay: 0.6
  },
  {
    title: "History Control",
    description: "Full undo/redo support. Experiment without fear.",
    icon: History,
    className: "md:col-span-1",
    gradient: "from-fuchsia-500/20 to-purple-500/20",
    textGradient: "text-fuchsia-500",
    delay: 0.7
  },
  {
    title: "Instant PDF",
    description: "High-quality vector export ready for applications.",
    icon: Download,
    className: "md:col-span-1",
    gradient: "from-red-500/20 to-orange-500/20",
    textGradient: "text-red-500",
    delay: 0.8
  }
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
              Everything you need to <span className="text-blue-600 dark:text-blue-400">get hired</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
              Powerful features packed into a simple, intuitive interface. Built for speed, privacy, and success.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              viewport={{ once: true }}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-border/50 bg-background/50 p-6 md:p-8 hover:shadow-2xl transition-all duration-300 hover:border-border/80",
                feature.className
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
                  feature.gradient
                )}
              />
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex items-start justify-between">
                  <div className={cn("p-3 rounded-2xl bg-secondary/50 group-hover:bg-background/80 transition-colors backdrop-blur-sm", feature.textGradient)}>
                      <feature.icon className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                  {feature.title === "AI-Powered Writing" && (
                     <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full animate-pulse shadow-lg">New</span>
                  )}
                </div>

                {feature.title === "AI-Powered Writing" && (
                  <div className="flex-1 w-full flex items-center justify-center my-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="relative w-full max-w-[280px] space-y-3">
                      {/* Abstract Resume Lines */}
                      <div className="h-2 w-3/4 bg-foreground/10 rounded-full" />
                      <div className="h-2 w-full bg-foreground/10 rounded-full" />
                      <div className="h-2 w-5/6 bg-foreground/10 rounded-full" />
                      
                      {/* Magic Wand Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-x-full group-hover:animate-shimmer" style={{ animationDuration: '2s' }} />
                      
                      {/* Floating Sparkles */}
                      <motion.div 
                        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -right-4 -top-6 text-blue-500"
                      >
                         <Wand2 className="h-6 w-6" />
                      </motion.div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
