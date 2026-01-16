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
            "relative flex items-center justify-between rounded-b-xl border px-6 py-3 transition-all duration-300 backdrop-blur-xl",
            isScrolled
              ? "bg-white/80 border-black/5 shadow-lg"
              : "bg-white/50 border-white/20 shadow-sm"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-105">
              <Image src="/logo-black.svg" alt="Logo" width={24} height={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none tracking-tight text-gray-900">
                Resume
              </span>
              <span className="text-[10px] font-medium leading-none text-gray-500">
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
                className="relative px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 group"
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
                className="rounded-md bg-gray-900 px-5 text-white shadow-lg shadow-gray-900/10 hover:bg-gray-800 hover:shadow-gray-900/20"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-24 z-40 rounded-2xl border border-gray-100 bg-white/50 p-4 shadow-xl backdrop-blur-sm md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl p-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  {link.name}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
              <hr className="my-2 border-gray-100" />
              <div className="flex flex-col gap-2 p-2">
                <Link href="/builder" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
