"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package, Clock, CheckCircle2, Truck, Heart, Star, BarChart3,
  ArrowRight, Loader2, Megaphone, Warehouse, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getStatusColor, formatDate } from "@/lib/utils";

interface DashboardData {
  ngo: { name: string; city: string };
  stats: {
    pendingDonations: number; totalDonations: number; activeCampaigns: number;
    totalReceived: number; totalDistributed: number; rating: number; reviewCount: number;
  };
  recentDonations: Array<{
    id: string; trackingCode: string; status: string; totalItems: number;
    createdAt: string; pickupMethod: string;
    donor: { name: string; email: string };
    items: Array<{ category: string; type: string; quantity: number }>;
  }>;
  recentReviews: Array<{ id: string; rating: number; comment: string | null; createdAt: string; donor: { name: string } }>;
}

const statCards = [
  { key: "pendingDonations", label: "Pending", icon: Clock, color: "#d97706", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { key: "totalReceived", label: "Items Received", icon: Package, color: "#3b82f6", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { key: "totalDistributed", label: "Distributed", icon: Heart, color: "#059669", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { key: "activeCampaigns", label: "Active Campaigns", icon: Megaphone, color: "#9333ea", bg: "bg-purple-50 dark:bg-purple-950/30" },
];

export default function NGODashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/ngo").then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  if (!data) return null;

  const dist = data.stats.totalReceived > 0 ? Math.round((data.stats.totalDistributed / data.stats.totalReceived) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">NGO Dashboard</h1>
          <p className="text-gray-500 mt-1">{data.ngo.name} — {data.ngo.city}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/ngo/donations"><Button variant="outline"><Package className="w-4 h-4" /> Manage Donations</Button></Link>
          <Link href="/ngo/campaigns"><Button><Megaphone className="w-4 h-4" /> New Campaign</Button></Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">
                      {(data.stats[s.key as keyof typeof data.stats] as number).toLocaleString()}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-xl", s.bg)}><s.icon className="w-6 h-6" style={{ color: s.color }} /></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Distribution & Rating Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white overflow-hidden relative h-full">
            <div className="absolute inset-0 pattern-bg opacity-20" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div><p className="text-white/70 text-sm">Distribution Rate</p><p className="text-4xl font-extrabold font-heading">{dist}%</p></div>
                <TrendingUp className="w-10 h-10 text-white/30" />
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/80 rounded-full transition-all" style={{ width: `${dist}%` }} />
              </div>
              <p className="text-white/60 text-xs mt-2">{data.stats.totalDistributed.toLocaleString()} of {data.stats.totalReceived.toLocaleString()} items distributed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-0 shadow-sm h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div><p className="text-sm text-gray-500">Average Rating</p><div className="flex items-center gap-2"><p className="text-4xl font-extrabold font-heading text-gray-900 dark:text-white">{data.stats.rating}</p><Star className="w-6 h-6 text-amber-400 fill-amber-400" /></div></div>
                <p className="text-sm text-gray-400">{data.stats.reviewCount} reviews</p>
              </div>
              {data.recentReviews.length > 0 && (
                <div className="space-y-2 mt-2">
                  {data.recentReviews.slice(0, 2).map(r => (
                    <div key={r.id} className="text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-1 mb-0.5">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />)}<span className="text-xs text-gray-400 ml-1">{r.donor.name}</span></div>
                      {r.comment && <p className="text-gray-500 text-xs line-clamp-1">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Donations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Recent Donations</CardTitle>
            <Link href="/ngo/donations"><Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4" /></Button></Link>
          </CardHeader>
          <CardContent>
            {data.recentDonations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No donations yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Donor</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Code</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Items</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Date</th>
                  </tr></thead>
                  <tbody>
                    {data.recentDonations.map((d) => (
                      <tr key={d.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{d.donor.name}</td>
                        <td className="py-3 px-2 font-mono text-gray-500 text-xs">{d.trackingCode}</td>
                        <td className="py-3 px-2 text-gray-600">{d.totalItems}</td>
                        <td className="py-3 px-2"><span className={cn("status-badge text-xs", getStatusColor(d.status))}>{d.status.replace(/_/g, " ")}</span></td>
                        <td className="py-3 px-2 text-gray-400">{formatDate(d.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
