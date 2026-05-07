"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Search, MapPin, Star, CheckCircle2, ArrowRight, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NGOLogo } from "@/components/ui/ngo-logo";
import { PAKISTAN_CITIES, cn } from "@/lib/utils";

interface NGO {
  id: string; name: string; slug: string; description: string; logo: string | null;
  city: string; isVerified: boolean; rating: number; reviewCount: number;
  totalDistributed: number; currentNeeds: string;
}

export default function PublicNGOsPage() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams({ limit: "50" });
    if (search) p.set("search", search);
    if (city !== "all") p.set("city", city);
    fetch(`/api/ngos?${p}`).then(r => r.json()).then(d => setNgos(d.ngos || [])).finally(() => setLoading(false));
  }, [city]);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      const p = new URLSearchParams({ limit: "50" });
      if (search) p.set("search", search);
      if (city !== "all") p.set("city", city);
      fetch(`/api/ngos?${p}`).then(r => r.json()).then(d => setNgos(d.ngos || [])).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const parseNeeds = (needs: string): string[] => {
    try { return Object.entries(JSON.parse(needs)).filter(([, l]) => l === "HIGH" || l === "CRITICAL").map(([t]) => t.replace(/_/g, " ")).slice(0, 3); }
    catch { return []; }
  };

  return (
    <SessionProvider>
      <Navbar />
      <main className="pt-20">
        <section className="relative py-20 gradient-hero dark:gradient-hero-dark overflow-hidden">
          <div className="absolute inset-0 pattern-bg" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-white mb-4">Our <span className="text-amber-300">NGO Partners</span></h1>
              <p className="text-lg text-white/70">Verified organizations across Pakistan dedicated to clothing distribution</p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
        </section>

        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 mb-8 -mt-6 relative z-10">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search NGOs..." className="pl-10 bg-white dark:bg-gray-900 shadow-sm" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="h-11 rounded-lg border border-input bg-white dark:bg-gray-900 px-4 text-sm shadow-sm" value={city} onChange={e => setCity(e.target.value)}>
                <option value="all">All Cities</option>
                {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div> : ngos.length === 0 ? (
              <div className="text-center py-20"><Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No NGOs found</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ngos.map((ngo, i) => (
                  <motion.div key={ngo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-xl transition-all hover:-translate-y-0.5">
                    <div className="flex items-start gap-3 mb-3">
                      <NGOLogo name={ngo.name} logo={ngo.logo} size="lg" />
                      <div className="min-w-0"><div className="flex items-center gap-1.5"><h3 className="font-bold text-gray-900 dark:text-white truncate">{ngo.name}</h3>{ngo.isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5"><MapPin className="w-3 h-3" />{ngo.city}<Star className="w-3 h-3 text-amber-400 fill-amber-400" />{ngo.rating}</div></div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{ngo.description}</p>
                    {parseNeeds(ngo.currentNeeds).length > 0 && <div className="flex flex-wrap gap-1.5 mb-3">{parseNeeds(ngo.currentNeeds).map(n => <span key={n} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 text-xs font-medium capitalize">{n.toLowerCase()}</span>)}</div>}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-xs text-gray-400">{ngo.totalDistributed.toLocaleString()} distributed</span>
                      <Link href="/register/donor"><Button size="sm"><ArrowRight className="w-3.5 h-3.5" /> Donate</Button></Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </SessionProvider>
  );
}
