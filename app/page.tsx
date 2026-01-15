import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingSocialProof } from "@/components/landing/social-proof";
import { LandingFeatures } from "@/components/landing/features";
import { LandingCTA } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background selection:bg-blue-500/30">
      <LandingNavbar />
      <LandingHero />
      <LandingSocialProof />
      <LandingFeatures />
      <LandingCTA />
      <LandingFooter />
    </main>
  );
}
