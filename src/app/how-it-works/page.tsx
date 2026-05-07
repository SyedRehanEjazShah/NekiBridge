"use client";

import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { UserPlus, Building2, CalendarCheck, BarChart3, ArrowRight, CheckCircle2, Truck, Gift, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { step: "01", icon: UserPlus, title: "Create Your Account", titleUrdu: "اکاؤنٹ بنائیں", desc: "Sign up as a donor in under 2 minutes. Tell us your city and preferences.", details: ["Name, email, and city", "Instant verification", "100% free"], color: "#059669" },
  { step: "02", icon: Building2, title: "Choose Your NGO", titleUrdu: "ادارہ منتخب کریں", desc: "Browse 15+ verified NGOs or let our smart algorithm match the best fit.", details: ["Filter by city, rating, needs", "See what each NGO needs most", "Smart matching available"], color: "#3b82f6" },
  { step: "03", icon: Gift, title: "Add Your Items", titleUrdu: "اشیاء شامل کریں", desc: "Specify clothing type, category, season, condition, and size.", details: ["Men's, Women's, Kids categories", "Shirts, Shalwar Kameez, Jackets...", "Condition: New to Fair"], color: "#d97706" },
  { step: "04", icon: Truck, title: "Schedule Pickup", titleUrdu: "پک اپ مقرر کریں", desc: "Drop off, home pickup, or ship via courier.", details: ["Free home pickup in most cities", "Choose date and time slot", "Drop-off at any NGO center"], color: "#9333ea" },
  { step: "05", icon: Search, title: "Track in Real-Time", titleUrdu: "ریئل ٹائم ٹریکنگ", desc: "Follow your donation through 7 stages to distribution.", details: ["7-stage journey tracking", "Public tracking — no login needed", "Status notifications"], color: "#0891b2" },
  { step: "06", icon: BarChart3, title: "See Your Impact", titleUrdu: "اپنا اثر دیکھیں", desc: "View your impact dashboard with personal impact score.", details: ["Impact score grows with donations", "See which communities benefited", "Track your total contributions"], color: "#e11d48" },
];

export default function HowItWorksPage() {
  return (
    <SessionProvider>
      <Navbar />
      <main className="pt-20">
        <section className="relative py-24 gradient-hero dark:gradient-hero-dark overflow-hidden">
          <div className="absolute inset-0 pattern-bg" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-white mb-4">How <span className="text-amber-300">NekiBridge</span> Works</h1>
              <p className="text-lg text-white/70 mb-3">From your closet to someone&apos;s smile — in 6 simple steps</p>
              <p className="urdu-text text-white/50">آپ کی الماری سے کسی کی مسکراہٹ تک</p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-6 items-start bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <s.icon className="w-7 h-7" style={{ color: s.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">STEP {s.step}</span>
                    <p className="urdu-text text-xs text-gray-400">{s.titleUrdu}</p>
                  </div>
                  <h3 className="text-xl font-extrabold font-heading text-gray-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-3">{s.desc}</p>
                  <ul className="space-y-1.5">
                    {s.details.map((d, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{d}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-16 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 pattern-bg opacity-20" />
            <div className="relative z-10">
              <Heart className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold font-heading text-white mb-3">Ready to Start?</h2>
              <p className="text-white/70 mb-8">Create your account and make your first donation in under 2 minutes.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register/donor"><Button size="xl" className="bg-white text-emerald-700 hover:bg-white/90">Start Donating <ArrowRight className="w-5 h-5" /></Button></Link>
                <Link href="/track"><Button variant="ghost" size="xl" className="text-white border-2 border-white/30 hover:bg-white/10 hover:text-white"><Search className="w-5 h-5" /> Track Donation</Button></Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </SessionProvider>
  );
}
