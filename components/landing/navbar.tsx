"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Blogs", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Feedback", href: "/feedback" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-4 left-0 right-0 z-50 mx-auto max-w-7xl px-4 md:px-6 transition-all duration-300",
          isScrolled ? "top-0" : "top-0"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden transition-all duration-300 backdrop-blur-xl  flex flex-col",
            isMobileMenuOpen ? "rounded-b-2xl" : "rounded-b-xl",
            isScrolled
              ? "bg-white/90 border-black/5 shadow-lg"
              : "bg-white/80 border-white/20 shadow-sm"
          )}
        >
          {/* Main Navbar Row */}
          <div className="flex items-center justify-between px-6 py-3 shrink-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-105">
                <Image src="/logo-black.svg" alt="Logo" width={24} height={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-none tracking-tight text-zinc-900">
                  Resume
                </span>
                <span className="text-[10px] font-medium leading-none text-zinc-500">
                  by Flotick
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 group"
                >
                  {link.name}
                  <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/70 to-blue-500/0 opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/builder">
                <Button 
                  size="sm" 
                  className="rounded-md bg-zinc-900 px-5 text-white shadow-lg shadow-zinc-900/10 hover:bg-zinc-800 hover:shadow-zinc-900/20"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "md:hidden p-2 rounded-full transition-all duration-300",
                isMobileMenuOpen 
                  ? "bg-orange-50 text-orange-600 shadow-sm ring-2 ring-orange-200" 
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              )}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu Content (Expanded) */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden"
              >
                <div className="p-4 pt-0 flex flex-col gap-1">
                  <div className="h-px bg-zinc-100 mb-2 mx-2" />
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl p-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all group"
                    >
                      {link.name}
                      <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                  <div className="pt-2 mt-2">
                    <Link href="/builder" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
}
