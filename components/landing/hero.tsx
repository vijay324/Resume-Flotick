"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-32 pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/20 rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-accent text-accent-foreground text-sm font-medium mb-4"
        >
          <Sparkles className="h-4 w-4" />
          <span>Powered by <a href="https://Flotick.com" className="font-semibold hover:underline" target="_blank" rel="noopener noreferrer">Flotick</a></span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-balance max-w-4xl"
        >
          Craft your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            perfect resume
          </span>{" "}
          in minutes.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance"
        >
          Beat the ATS with our industry-standard resume builder. 
          Real-time preview, AI suggestions, and professional templates designed to get you hired.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link href="/builder">
            <Button size="lg" className="h-12 px-8 rounded-full text-base gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow">
              Build My Resume <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          {/* <Link href="#features">
            <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-base backdrop-blur-sm">
              View Examples
            </Button>
          </Link> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex gap-8 mt-12 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>ATS-Friendly</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Real-time Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>No Sign-up Required</span>
          </div>
        </motion.div>
      </div>
      
      {/* Mockup / Visual element would go here */}
      {/* <motion.div 
         initial={{ opacity: 0, scale: 0.95, y: 40 }}
         whileInView={{ opacity: 1, scale: 1, y: 0 }}
         transition={{ duration: 0.8, delay: 0.4 }}
         viewport={{ once: true }}
         className="mt-20 relative w-full h-[500px] max-w-6xl mx-auto rounded-t-3xl border border-border bg-white shadow-2xl overflow-hidden glass-panel"
      >
         <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-zinc-200">
             <div className="flex items-center gap-2 p-4 border-b border-border">
                 <div className="h-3 w-3 rounded-full bg-red-400"/>
                 <div className="h-3 w-3 rounded-full bg-yellow-400"/>
                 <div className="h-3 w-3 rounded-full bg-green-400"/>
             </div>
             <div className="p-8 flex items-center justify-center h-full">
                 <p className="text-muted-foreground">Product UI Perspective View</p>
             </div>
         </div>
      </motion.div> */}

      {/* Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20 pointer-events-none" />
    </section>
  );
}
