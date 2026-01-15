"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function LandingNavbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-white/70 border-b border-white/20"
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            R
          </div>
          <span>Resumai</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-[10px] uppercase font-bold tracking-wider text-gray-500">
            by Flotick
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link href="#features" className="hover:text-primary transition-colors">
          Features
        </Link>
        <Link href="#templates" className="hover:text-primary transition-colors">
          Templates
        </Link>
        <Link href="#pricing" className="hover:text-primary transition-colors">
          Pricing
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/builder">
          <Button variant="default" className="rounded-full px-6">
            Get Started
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
}
