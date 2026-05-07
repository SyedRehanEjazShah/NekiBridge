"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Shirt, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden gradient-hero dark:gradient-hero-dark">
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-bg" />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-[15%] left-[10%] w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shirt className="w-10 h-10 text-white/60" />
      </motion.div>

      <motion.div
        className="absolute top-[25%] right-[12%] w-16 h-16 rounded-full bg-amber-400/20 backdrop-blur-sm border border-amber-400/20 flex items-center justify-center"
        animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Sparkles className="w-8 h-8 text-amber-300/60" />
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] left-[8%] w-14 h-14 rounded-xl bg-cyan-400/15 backdrop-blur-sm border border-cyan-400/15"
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div
        className="absolute bottom-[30%] right-[8%] w-24 h-24 rounded-full bg-emerald-300/10 backdrop-blur-sm border border-emerald-300/10"
        animate={{ y: [0, 10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Pakistan&apos;s First Smart Donation Platform
          <span className="urdu-text text-xs text-white/60 mr-1">پاکستان کا پہلا سمارٹ عطیہ پلیٹ فارم</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading text-white leading-[1.1] mb-6"
        >
          Every{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Garment</span>
            <motion.span
              className="absolute bottom-1 left-0 right-0 h-3 bg-amber-400/40 -rotate-1 rounded"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            />
          </span>{" "}
          Tells a{" "}
          <span className="text-gradient">Story</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          Connect with verified NGOs across Pakistan. Donate the{" "}
          <span className="text-white font-semibold">right clothes</span> to the{" "}
          <span className="text-white font-semibold">right people</span> at the{" "}
          <span className="text-white font-semibold">right time</span> — and track
          every step.
        </motion.p>

        {/* Urdu subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="urdu-text text-white/50 text-base mb-10"
        >
          تصدیق شدہ فلاحی اداروں کے ذریعے — صحیح لباس، صحیح وقت، صحیح لوگوں تک
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/register/donor">
            <Button size="xl" className="text-base group">
              Start Donating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/track">
            <Button
              variant="ghost"
              size="xl"
              className="text-white border-2 border-white/20 hover:bg-white/10 hover:text-white"
            >
              <Search className="w-5 h-5" />
              Track a Donation
            </Button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-8 text-white/40 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">✓</div>
            15+ Verified NGOs
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">✓</div>
            20+ Cities
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">✓</div>
            100% Free Platform
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
    </section>
  );
}
