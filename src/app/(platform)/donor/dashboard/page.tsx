"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package, Gift, Building2, Heart, TrendingUp, ArrowRight,
  Clock, CheckCircle2, Truck, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getStatusColor, formatDate } from "@/lib/utils";

interface DashboardData {
  stats: {
    totalDonations: number;
    totalItems: number;
    ngosHelped: number;
    distributedCount: number;
    impactScore: number;
  };
  recentDonations: Array<{
    id: string;
    trackingCode: string;
    status: string;
    totalItems: number;
    createdAt: string;
    ngo: { name: string; slug: string; city: string };
    items: Array<{ category: string; type: string; quantity: number }>;
  }>;
}

const statCards = [
  { key: "totalDonations", label: "Total Donations", icon: Package, color: "from-emerald-500 to-teal-500", bgColor: "bg-emerald-50 dark:bg-emerald-950/30" },
  { key: "totalItems", label: "Items Donated", icon: Gift, color: "from-blue-500 to-indigo-500", bgColor: "bg-blue-50 dark:bg-blue-950/30" },
  { key: "ngosHelped", label: "NGOs Helped", icon: Building2, color: "from-amber-500 to-orange-500", bgColor: "bg-amber-50 dark:bg-amber-950/30" },
  { key: "distributedCount", label: "Distributed", icon: Heart, color: "from-pink-500 to-rose-500", bgColor: "bg-pink-50 dark:bg-pink-950/30" },
];

const statusIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  SCHEDULED: Clock,
  PICKED_UP: Truck,
  IN_TRANSIT: Truck,
  RECEIVED: CheckCircle2,
  SORTED: CheckCircle2,
  DISTRIBUTED: Heart,
};

export default function DonorDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/donor")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">
            Donor Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your impact and manage your donations
          </p>
        </div>
        <Link href="/donor/donate">
          <Button size="lg">
            <Gift className="w-5 h-5" />
            New Donation
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const value = data.stats[stat.key as keyof typeof data.stats];
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">
                        {typeof value === "number" ? value.toLocaleString() : value}
                      </p>
                    </div>
                    <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                      <stat.icon className={cn("w-6 h-6 bg-gradient-to-br bg-clip-text", stat.color)} style={{ color: stat.color.includes("emerald") ? "#059669" : stat.color.includes("blue") ? "#3b82f6" : stat.color.includes("amber") ? "#d97706" : "#ec4899" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Impact Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white overflow-hidden relative">
          <div className="absolute inset-0 pattern-bg opacity-20" />
          <CardContent className="p-6 relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Your Impact Score</p>
              <p className="text-4xl font-extrabold font-heading">{data.stats.impactScore}</p>
            </div>
            <div className="ml-auto text-right hidden sm:block">
              <p className="text-white/70 text-sm">Keep donating to increase</p>
              <p className="text-white/70 text-sm">your impact score!</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Donations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Recent Donations</CardTitle>
            <Link href="/donor/my-donations">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.recentDonations.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No donations yet</p>
                <Link href="/donor/donate">
                  <Button>Make Your First Donation</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentDonations.map((donation) => {
                  const StatusIcon = statusIcons[donation.status] || Clock;
                  return (
                    <Link
                      key={donation.id}
                      href={`/donor/my-donations/${donation.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                        <StatusIcon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {donation.ngo.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {donation.trackingCode} · {donation.totalItems} items · {formatDate(donation.createdAt)}
                        </p>
                      </div>
                      <span className={cn("status-badge text-xs", getStatusColor(donation.status))}>
                        {donation.status.replace(/_/g, " ")}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
