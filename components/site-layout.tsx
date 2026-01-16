"use client";

import { usePathname } from "next/navigation";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();
  const isBuilder = pathname?.startsWith("/builder");

  return (
    <>
      {!isBuilder && <LandingNavbar />}
      {children}
      {!isBuilder && <LandingFooter />}
    </>
  );
}
