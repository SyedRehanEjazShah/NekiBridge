"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, Star, Phone, Globe, Calendar, Gift, CheckCircle2,
  ArrowLeft, Loader2, Building2, Package, Heart, Users,
  AlertTriangle, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NGOLogo } from "@/components/ui/ngo-logo";
import { cn, formatDate } from "@/lib/utils";

interface NGODetail {
  id: string; name: string; slug: string; description: string; descriptionUrdu: string | null;
  city: string; address: string; phone: string | null; email: string | null;
  website: string | null; foundedYear: number | null; isVerified: boolean;
  rating: number; reviewCount: number; totalReceived: number; totalDistributed: number;
  currentNeeds: string | null; logo: string | null;
  campaigns: Array<{
    id: string; title: string; titleUrdu: string | null; targetItems: number;
    collectedItems: number; endDate: string; urgencyLevel: string; city: string;
  }>;
  reviews: Array<{
    id: string; rating: number; comment: string | null; createdAt: string;
    donor: { name: string };
  }>;
  _count: { donations: number; campaigns: number };
}

const urgencyColors: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  HIGH: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  LOW: "bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400",
};

export default function NGODetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [ngo, setNgo] = useState<NGODetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ngos/${slug}`)
      .then((r) => r.json())
      .then(setNgo)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  if (!ngo) return <div className="text-center py-20"><p className="text-gray-500">NGO not found</p></div>;

  const parseNeeds = (needs: string | null) => {
    if (!needs) return [];
    try { return Object.entries(JSON.parse(needs)).map(([type, level]) => ({ type: type.replace(/_/g, " "), level: level as string })); }
    catch { return []; }
  };

  const needs = parseNeeds(ngo.currentNeeds);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/donor/ngos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to NGOs
      </Link>

      {/* Header Card */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 relative">
          <div className="absolute inset-0 pattern-bg opacity-10" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <NGOLogo name={ngo.name} logo={ngo.logo} size="xl" className="w-16 h-16 ring-2 ring-white/30" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold font-heading text-white">{ngo.name}</h1>
                {ngo.isVerified && <CheckCircle2 className="w-5 h-5 text-white" />}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-white/70 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{ngo.city}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-300 fill-amber-300" />{ngo.rating} ({ngo.reviewCount} reviews)</span>
                {ngo.foundedYear && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Est. {ngo.foundedYear}</span>}
              </div>
            </div>
            <Link href={`/donor/donate?ngo=${ngo.slug}`}>
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-white/90 shadow-xl">
                <Gift className="w-5 h-5" /> Donate Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Received", value: ngo.totalReceived.toLocaleString(), icon: Package },
              { label: "Distributed", value: ngo.totalDistributed.toLocaleString(), icon: Heart },
              { label: "Total Donors", value: ngo._count.donations.toString(), icon: Users },
              { label: "Campaigns", value: ngo._count.campaigns.toString(), icon: Building2 },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <s.icon className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-extrabold font-heading text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle>About</CardTitle></CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{ngo.description}</p>
              {ngo.descriptionUrdu && <p className="urdu-text text-gray-400 mt-3 text-sm">{ngo.descriptionUrdu}</p>}
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          {ngo.campaigns.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle>Active Campaigns</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {ngo.campaigns.map((c) => {
                  const progress = Math.round((c.collectedItems / c.targetItems) * 100);
                  return (
                    <div key={c.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{c.title}</h4>
                        <span className={cn("status-badge text-xs", urgencyColors[c.urgencyLevel])}>{c.urgencyLevel}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">{c.collectedItems}/{c.targetItems} items</span>
                        <span className="font-semibold text-emerald-600">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          {ngo.reviews.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle>Donor Reviews</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {ngo.reviews.map((r) => (
                  <div key={r.id} className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">{r.donor.name.charAt(0)}</div>
                      <div><p className="text-sm font-medium text-gray-900 dark:text-white">{r.donor.name}</p><p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p></div>
                      <div className="ml-auto flex gap-0.5">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-500 ml-10">{r.comment}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Needs */}
          {needs.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle className="text-base">Current Needs</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {needs.map((n) => (
                  <div key={n.type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{n.type.toLowerCase()}</span>
                    <span className={cn("status-badge text-xs",
                      n.level === "CRITICAL" ? "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400" :
                      n.level === "HIGH" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" :
                      n.level === "MEDIUM" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" :
                      "bg-gray-100 text-gray-600"
                    )}>{n.level}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Contact Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300"><MapPin className="w-4 h-4 text-gray-400 shrink-0" />{ngo.address}</div>
              {ngo.phone && <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300"><Phone className="w-4 h-4 text-gray-400" />{ngo.phone}</div>}
              {ngo.email && <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300"><Building2 className="w-4 h-4 text-gray-400" />{ngo.email}</div>}
              {ngo.website && <a href={ngo.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-emerald-600 hover:underline"><Globe className="w-4 h-4" />{ngo.website.replace(/https?:\/\//, "")}</a>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
