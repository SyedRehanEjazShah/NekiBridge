"use client";

import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import {
  Heart, Users, Globe, Shield, Award, Target,
  Shirt, Truck, BarChart3, Building2, Sparkles,
} from "lucide-react";

const values = [
  { icon: Shield, title: "Transparency", titleUrdu: "شفافیت", desc: "Every donation is tracked from your doorstep to the recipient. Full accountability at every step.", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { icon: Target, title: "Smart Matching", titleUrdu: "سمارٹ میچنگ", desc: "Our algorithm matches your donation to NGOs that need exactly what you're giving — right clothes, right place, right time.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { icon: Heart, title: "Dignity First", titleUrdu: "عزت مقدم", desc: "Clothing is sorted, cleaned, and distributed with dignity through organized 'Gift Shops' and door-to-door programs.", color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/30" },
  { icon: Globe, title: "Nationwide Reach", titleUrdu: "ملک بھر میں", desc: "Operating across 20+ cities with 15+ verified NGO partners, from Karachi to Gilgit.", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
];

const team = [
  { name: "Rehan Shah", role: "Founder & Lead Developer", initial: "R", color: "from-emerald-400 to-teal-500" },
  { name: "NekiBridge Team", role: "Design & Research", initial: "N", color: "from-blue-400 to-indigo-500" },
  { name: "Community", role: "NGO Partners & Donors", initial: "C", color: "from-amber-400 to-orange-500" },
];

const stats = [
  { value: "15+", label: "Verified NGOs" },
  { value: "20+", label: "Cities Covered" },
  { value: "12,000+", label: "Items Donated" },
  { value: "100%", label: "Free Platform" },
];

export default function AboutPage() {
  return (
    <SessionProvider>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-24 gradient-hero dark:gradient-hero-dark overflow-hidden">
          <div className="absolute inset-0 pattern-bg" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" /> Our Mission
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white mb-6 leading-tight">
                Bridging the Gap Between <span className="text-amber-300">Generosity</span> and <span className="text-amber-300">Need</span>
              </h1>
              <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
                NekiBridge is Pakistan&apos;s first smart clothing donation platform — connecting donors with verified
                NGOs through technology-driven matching, end-to-end tracking, and transparent impact reporting.
              </p>
              <p className="urdu-text text-white/50 text-base">
                نیکی بریج — پاکستان کا پہلا سمارٹ لباس عطیہ پلیٹ فارم
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
        </section>

        {/* Stats */}
        <section className="relative -mt-10 z-20 px-4 mb-20">
          <div className="max-w-4xl mx-auto glass-card p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* The Problem */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-sm font-semibold mb-4">The Problem</span>
                <h2 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white mb-4">Why NekiBridge?</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>In Pakistan, millions of usable garments are discarded while millions of people lack adequate clothing. The disconnect is staggering:</p>
                  <ul className="space-y-3">
                    {[
                      "Donors don't know which NGOs need what — clothing piles up or mismatches",
                      "NGOs receive random donations they can't distribute effectively",
                      "No tracking means donors never know if their clothes actually reached someone",
                      "Seasonal urgency (winter drives) creates chaotic, uncoordinated efforts",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-red-500 text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 border border-emerald-100 dark:border-emerald-900">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-4">Our Solution</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Technology-Driven Kindness</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-sm">
                  {[
                    { icon: Shirt, text: "Donors specify exactly what they're giving (type, season, condition, size)" },
                    { icon: Target, text: "Smart algorithm matches items to NGOs with the highest need" },
                    { icon: Truck, text: "Free pickup or drop-off scheduling" },
                    { icon: BarChart3, text: "Real-time tracking from pickup to distribution" },
                    { icon: Building2, text: "Verified NGO partners with transparent impact metrics" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3"><item.icon className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{item.text}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50/50 dark:bg-gray-950 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 dark:text-white mb-4">Our <span className="text-gradient">Core Values</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <div className={`${v.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <v.icon className={`w-6 h-6 ${v.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{v.title}</h3>
                  <p className="urdu-text text-xs text-emerald-500 mb-2">{v.titleUrdu}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 dark:text-white mb-12">The <span className="text-gradient">Team</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {team.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center hover:shadow-lg transition-all">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>{t.initial}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{t.name}</h3>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </SessionProvider>
  );
}
