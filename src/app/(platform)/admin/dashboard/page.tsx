"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, Building2, Package, Heart, ShieldCheck, Megaphone,
  TrendingUp, Loader2, ArrowRight, Star, Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getStatusColor, formatDate } from "@/lib/utils";

interface AdminData {
  stats: {
    totalUsers: number; totalDonors: number; totalNGOAdmins: number;
    totalNGOs: number; verifiedNGOs: number; totalDonations: number;
    totalItems: number; distributedItems: number; activeCampaigns: number;
  };
  donationsByStatus: Array<{ status: string; _count: { id: number } }>;
  recentDonations: Array<{
    id: string; trackingCode: string; status: string; totalItems: number; createdAt: string;
    donor: { name: string }; ngo: { name: string; city: string };
  }>;
  topNGOs: Array<{ id: string; name: string; city: string; totalReceived: number; totalDistributed: number; rating: number; isVerified: boolean }>;
}

const statCards = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "#3b82f6", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { key: "totalDonors", label: "Donors", icon: Heart, color: "#ec4899", bg: "bg-pink-50 dark:bg-pink-950/30" },
  { key: "totalNGOs", label: "NGOs", icon: Building2, color: "#059669", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { key: "totalDonations", label: "Donations", icon: Package, color: "#d97706", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { key: "totalItems", label: "Items Total", icon: Gift, color: "#8b5cf6", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { key: "distributedItems", label: "Distributed", icon: TrendingUp, color: "#0891b2", bg: "bg-cyan-50 dark:bg-cyan-950/30" },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/admin").then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform-wide overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div className={cn("w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center", s.bg)}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <p className="text-2xl font-extrabold font-heading text-gray-900 dark:text-white">
                  {(data.stats[s.key as keyof typeof data.stats] as number).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Platform Health Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white overflow-hidden relative">
          <div className="absolute inset-0 pattern-bg opacity-20" />
          <CardContent className="p-6 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"><ShieldCheck className="w-7 h-7" /></div>
              <div>
                <p className="text-white/70 text-sm">Verified NGOs</p>
                <p className="text-3xl font-extrabold font-heading">{data.stats.verifiedNGOs} / {data.stats.totalNGOs}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div><p className="text-white/70 text-sm">Active Campaigns</p><p className="text-3xl font-extrabold font-heading">{data.stats.activeCampaigns}</p></div>
            </div>
            <div>
              <p className="text-white/70 text-sm">Distribution Rate</p>
              <p className="text-3xl font-extrabold font-heading">{data.stats.totalItems > 0 ? Math.round((data.stats.distributedItems / data.stats.totalItems) * 100) : 0}%</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Donations by Status</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.donationsByStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <span className={cn("status-badge text-xs", getStatusColor(s.status))}>{s.status.replace(/_/g, " ")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{s._count.id}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top NGOs */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Top NGOs by Distribution</CardTitle>
            <Link href="/admin/ngos"><Button variant="ghost" size="sm">Manage <ArrowRight className="w-4 h-4" /></Button></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topNGOs.map((ngo, i) => (
                <div key={ngo.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <span className="text-lg font-bold text-gray-300 w-6">#{i + 1}</span>
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{ngo.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5"><span className="font-semibold text-sm text-gray-900 dark:text-white truncate">{ngo.name}</span>{ngo.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}</div>
                    <p className="text-xs text-gray-400">{ngo.city} · <Star className="w-3 h-3 text-amber-400 fill-amber-400 inline" /> {ngo.rating}</p>
                  </div>
                  <div className="text-right"><p className="text-sm font-semibold text-gray-900 dark:text-white">{ngo.totalDistributed.toLocaleString()}</p><p className="text-xs text-gray-400">distributed</p></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Platform Activity</CardTitle>
          <Link href="/admin/donations"><Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4" /></Button></Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Donor</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">NGO</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Code</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Items</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Date</th>
              </tr></thead>
              <tbody>
                {data.recentDonations.map(d => (
                  <tr key={d.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{d.donor.name}</td>
                    <td className="py-3 px-2 text-gray-600">{d.ngo.name}</td>
                    <td className="py-3 px-2 font-mono text-gray-500 text-xs">{d.trackingCode}</td>
                    <td className="py-3 px-2 text-gray-600">{d.totalItems}</td>
                    <td className="py-3 px-2"><span className={cn("status-badge text-xs", getStatusColor(d.status))}>{d.status.replace(/_/g, " ")}</span></td>
                    <td className="py-3 px-2 text-gray-400">{formatDate(d.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
