"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, FileText, CheckCircle, Wand2, Download } from "lucide-react";
import { cn } from "@/lib/utils"; 

const features = [
  {
    title: "AI-Powered Writing",
    description: "Generates professional summaries and bullet points tailored to your role.",
    icon: Wand2,
    className: "md:col-span-2",
    gradient: "from-blue-500/20 to-cyan-500/20",
    textGradient: "text-blue-500"
  },
  {
    title: "Real-time Preview",
    description: "See your changes instantly as you type. No more guessing.",
    icon: Zap,
    className: "md:col-span-1",
    gradient: "from-purple-500/20 to-pink-500/20",
    textGradient: "text-purple-500"
  },
  {
    title: "ATS-Friendly Optimization",
    description: "Templates designed to pass automated screening systems.",
    icon: CheckCircle,
    className: "md:col-span-1",
    gradient: "from-green-500/20 to-emerald-500/20",
    textGradient: "text-green-500"
  },
  {
    title: "Instant PDF Export",
    description: "Download high-quality PDFs ready for application.",
    icon: Download,
    className: "md:col-span-2",
    gradient: "from-orange-500/20 to-red-500/20",
    textGradient: "text-orange-500"
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-secondary/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Everything you need to <span className="text-blue-600">get hired</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Built by engineers, optimized for recruiters. Our tools give you the unfair advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-border bg-background p-8 hover:shadow-xl transition-all duration-300",
                feature.className
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
                  feature.gradient
                )}
              />
              <div className="relative z-10 flex flex-col items-start gap-4">
                <div className={cn("p-3 rounded-2xl bg-secondary group-hover:bg-background/80 transition-colors", feature.textGradient)}>
                    <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
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
