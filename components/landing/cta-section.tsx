"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function LandingCTA() {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto relative z-10 text-center space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tighter max-w-2xl mx-auto"
        >
          Ready to land your dream job?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-primary-foreground/80 md:text-xl max-w-xl mx-auto"
        >
          Join thousands of professionals who have accelerated their careers with our AI-powered resume builder.
        </motion.p>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           viewport={{ once: true }}
        >
          <Link href="/builder">
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg font-semibold gap-2 border-none bg-white text-blue-600 hover:bg-gray-100">
              Build My Resume Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
