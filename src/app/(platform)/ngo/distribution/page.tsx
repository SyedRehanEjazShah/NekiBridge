"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Truck, Loader2, Package, Heart, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getStatusColor, formatDate } from "@/lib/utils";

interface DonationSummary {
  id: string; trackingCode: string; status: string; totalItems: number;
  createdAt: string; completedAt: string | null;
  donor: { name: string };
  items: Array<{ category: string; type: string; quantity: number; isDistributed: boolean }>;
}

export default function DistributionPage() {
  const [ready, setReady] = useState<DonationSummary[]>([]);
  const [distributed, setDistributed] = useState<DonationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/ngo/donations?status=SORTED&limit=20").then(r => r.json()),
      fetch("/api/ngo/donations?status=DISTRIBUTED&limit=20").then(r => r.json()),
    ]).then(([s, d]) => {
      setReady(s.donations || []);
      setDistributed(d.donations || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">Distribution</h1>
        <p className="text-gray-500 mt-1">Track items ready and already distributed to beneficiaries</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white overflow-hidden relative">
          <div className="absolute inset-0 pattern-bg opacity-20" />
          <CardContent className="p-6 relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"><Package className="w-7 h-7" /></div>
            <div><p className="text-white/70 text-sm">Ready to Distribute</p><p className="text-3xl font-extrabold font-heading">{ready.length} donations</p><p className="text-white/60 text-sm">{ready.reduce((s, d) => s + d.totalItems, 0)} total items</p></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white overflow-hidden relative">
          <div className="absolute inset-0 pattern-bg opacity-20" />
          <CardContent className="p-6 relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"><Heart className="w-7 h-7" /></div>
            <div><p className="text-white/70 text-sm">Successfully Distributed</p><p className="text-3xl font-extrabold font-heading">{distributed.length} donations</p><p className="text-white/60 text-sm">{distributed.reduce((s, d) => s + d.totalItems, 0)} items reached beneficiaries</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Ready for Distribution */}
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /> Ready for Distribution ({ready.length})</CardTitle></CardHeader>
        <CardContent>
          {ready.length === 0 ? <p className="text-gray-400 text-center py-8">No items ready for distribution. Sort received donations first.</p> : (
            <div className="space-y-3">
              {ready.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30">
                  <Package className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{d.donor.name}</p>
                    <p className="text-xs text-gray-400">{d.trackingCode} · {d.totalItems} items · {formatDate(d.createdAt)}</p>
                  </div>
                  <span className={cn("status-badge text-xs", getStatusColor(d.status))}>SORTED</span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recently Distributed */}
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Recently Distributed ({distributed.length})</CardTitle></CardHeader>
        <CardContent>
          {distributed.length === 0 ? <p className="text-gray-400 text-center py-8">No distributions completed yet.</p> : (
            <div className="space-y-3">
              {distributed.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30">
                  <Heart className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{d.donor.name}</p>
                    <p className="text-xs text-gray-400">{d.trackingCode} · {d.totalItems} items · Completed {d.completedAt ? formatDate(d.completedAt) : formatDate(d.createdAt)}</p>
                  </div>
                  <span className={cn("status-badge text-xs", getStatusColor("DISTRIBUTED"))}>DISTRIBUTED</span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
