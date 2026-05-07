"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative gradient-hero dark:gradient-hero-dark rounded-3xl p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Pattern */}
          <div className="absolute inset-0 pattern-bg" />

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-white/5" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-8"
            >
              <Heart className="w-8 h-8 text-white fill-white/50" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-white mb-4">
              Ready to Make a <span className="text-amber-300">Difference</span>?
            </h2>

            <p className="text-lg text-white/70 max-w-xl mx-auto mb-3">
              Join thousands of Pakistanis who are transforming lives, one garment at a time.
            </p>

            <p className="urdu-text text-white/50 text-base mb-10">
              ایک لباس، ایک زندگی — آج ہی شامل ہوں
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register/donor">
                <Button
                  size="xl"
                  className="bg-white text-emerald-700 hover:bg-white/90 shadow-xl shadow-black/20 hover:shadow-black/30"
                >
                  <Heart className="w-5 h-5" />
                  Register as Donor
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/register/ngo">
                <Button
                  variant="ghost"
                  size="xl"
                  className="text-white border-2 border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <Building2 className="w-5 h-5" />
                  Register Your NGO
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
