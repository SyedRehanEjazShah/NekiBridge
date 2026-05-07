"use client";

import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsBar } from "@/components/landing/stats-bar";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturedNGOs } from "@/components/landing/featured-ngos";
import { ActiveCampaigns } from "@/components/landing/active-campaigns";
import { Testimonials } from "@/components/landing/testimonials";
import { CTASection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <SessionProvider>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <HowItWorks />
        <FeaturedNGOs />
        <ActiveCampaigns />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </SessionProvider>
  );
}
