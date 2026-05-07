"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Star, CheckCircle2, Building2, ArrowRight, Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { NGOLogo } from "@/components/ui/ngo-logo";
import { cn, PAKISTAN_CITIES } from "@/lib/utils";

interface NGO {
  id: string; name: string; slug: string; description: string;
  city: string; isVerified: boolean; rating: number; reviewCount: number;
  totalDistributed: number; currentNeeds: string; logo: string | null;
  acceptsPickup: boolean;
}

export default function BrowseNGOsPage() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const fetchNgos = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city !== "all") params.set("city", city);
    if (verifiedOnly) params.set("verified", "true");

    fetch(`/api/ngos?${params}`)
      .then((res) => res.json())
      .then((data) => setNgos(data.ngos || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNgos();
  }, [city, verifiedOnly]);

  useEffect(() => {
    const timer = setTimeout(fetchNgos, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const parseNeeds = (needs: string): string[] => {
    try {
      const obj = JSON.parse(needs);
      return Object.entries(obj)
        .filter(([, level]) => level === "HIGH" || level === "CRITICAL")
        .map(([type]) => type.replace(/_/g, " "))
        .slice(0, 3);
    } catch { return []; }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">Browse NGOs</h1>
        <p className="text-gray-500 mt-1">Find the right organization for your donation</p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search NGOs by name, city..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                className="h-11 rounded-lg border border-input bg-background pl-10 pr-8 text-sm appearance-none cursor-pointer"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="all">All Cities</option>
                {PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Button
              variant={verifiedOnly ? "default" : "outline"}
              size="default"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className="shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              Verified Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : ngos.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No NGOs found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ngos.map((ngo, i) => {
            const needs = parseNeeds(ngo.currentNeeds);
            return (
              <motion.div
                key={ngo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-3 mb-4">
                      <NGOLogo name={ngo.name} logo={ngo.logo} size="xl" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-gray-900 dark:text-white truncate">{ngo.name}</h3>
                          {ngo.isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ngo.city}</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{ngo.rating} ({ngo.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">{ngo.description}</p>

                    {needs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {needs.map((need) => (
                          <span key={need} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium capitalize">
                            {need.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-xs text-gray-400">
                        {ngo.totalDistributed.toLocaleString()} items distributed
                      </span>
                      <Link href={`/donor/ngos/${ngo.slug}`}>
                        <Button variant="ghost" size="sm" className="group/btn">
                          View <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
