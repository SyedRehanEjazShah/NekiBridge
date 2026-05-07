"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NGOLogo } from "@/components/ui/ngo-logo";

const ngos = [
  {
    name: "Edhi Foundation",
    slug: "edhi-foundation",
    logo: "/logos/edhi-foundation.png",
    city: "Karachi",
    rating: 4.9,
    reviewCount: 24,
    description: "Pakistan's largest welfare organization serving millions through clothing, shelter, and emergency relief across 300+ centers.",
    needs: ["Winter Jackets", "Blankets", "Children's Clothes"],
    totalDistributed: 85,
    verified: true,
    color: "from-emerald-400 to-teal-400",
  },
  {
    name: "Akhuwat Clothes Bank",
    slug: "akhuwat-clothes-bank",
    logo: "/logos/akhuwat-clothes-bank.png",
    city: "Lahore",
    rating: 4.8,
    reviewCount: 18,
    description: "Dedicated clothing bank that collects, washes, repairs, and distributes clothes through free 'Gift Shops'.",
    needs: ["Shalwar Kameez", "Shoes", "School Uniforms"],
    totalDistributed: 62,
    verified: true,
    color: "from-blue-400 to-indigo-400",
  },
  {
    name: "Al-Khidmat Foundation",
    slug: "al-khidmat-foundation",
    logo: "/logos/al-khidmat-foundation.png",
    city: "Islamabad",
    rating: 4.7,
    reviewCount: 12,
    description: "Running winter clothing drives and distributing essentials to families across Pakistan's underserved communities.",
    needs: ["Sweaters", "Shawls", "Warm Clothing"],
    totalDistributed: 48,
    verified: true,
    color: "from-amber-400 to-orange-400",
  },
  {
    name: "Chhipa Welfare",
    slug: "chhipa-welfare",
    logo: "/logos/chhipa-welfare.png",
    city: "Karachi",
    rating: 4.8,
    reviewCount: 9,
    description: "'You Call We Collect' — providing free pickup services for clothing donations and distributing to the needy.",
    needs: ["Men's Clothing", "Women's Clothing", "Blankets"],
    totalDistributed: 35,
    verified: true,
    color: "from-purple-400 to-pink-400",
  },
];

export function FeaturedNGOs() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-4">
            Verified Partners
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-gray-900 dark:text-white mb-4">
            Trusted <span className="text-gradient">NGOs</span> Across Pakistan
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Every partner is verified and transparent. Your clothes reach those who truly need them.
          </p>
        </motion.div>

        {/* NGO Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ngos.map((ngo, i) => (
            <motion.div
              key={ngo.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 p-6 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                {/* NGO Logo */}
                <NGOLogo name={ngo.name} logo={ngo.logo} size="xl" className="shadow-lg w-14 h-14" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white truncate">
                      {ngo.name}
                    </h3>
                    {ngo.verified && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {ngo.city}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {ngo.rating}
                      <span className="text-gray-400">({ngo.reviewCount})</span>
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {ngo.description}
                  </p>

                  {/* Current needs */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ngo.needs.map((need) => (
                      <span
                        key={need}
                        className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium"
                      >
                        {need}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        {ngo.totalDistributed.toLocaleString()}
                      </span>{" "}
                      items distributed
                    </span>
                    <Link href={`/ngos/${ngo.slug}`}>
                      <Button variant="ghost" size="sm" className="group/btn">
                        View
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/ngos">
            <Button variant="outline" size="lg">
              View All 15+ NGOs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
