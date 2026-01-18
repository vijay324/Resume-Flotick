"use client";

import { motion } from "framer-motion";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Netflix",
  "Tesla"
];

export function LandingSocialProof() {
  return (
    <section className="py-12 border-y border-border bg-secondary/30">
      <div className="container px-4 md:px-6 mx-auto text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
          Trusted by professionals at top companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 zincscale hover:zincscale-0 transition-all duration-500">
          {companies.map((company, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               viewport={{ once: true }}
               className="text-xl md:text-2xl font-bold font-serif text-foreground/80 hover:text-foreground cursor-default"
             >
               {company}
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
