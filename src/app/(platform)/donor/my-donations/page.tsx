"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ArrowRight, Loader2, Filter, Clock, Truck, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NGOLogo } from "@/components/ui/ngo-logo";
import { cn, getStatusColor, formatDate } from "@/lib/utils";

interface Donation {
  id: string; trackingCode: string; status: string; totalItems: number;
  pickupMethod: string; createdAt: string; completedAt: string | null;
  ngo: { name: string; slug: string; city: string; logo: string | null };
  items: Array<{ category: string; type: string; quantity: number }>;
}

const statusFilters = ["all", "PENDING", "SCHEDULED", "PICKED_UP", "IN_TRANSIT", "RECEIVED", "SORTED", "DISTRIBUTED"];

export default function MyDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (statusFilter !== "all") params.set("status", statusFilter);
    fetch(`/api/donations?${params}`)
      .then((r) => r.json())
      .then((d) => { setDonations(d.donations || []); setTotalPages(d.pagination?.totalPages || 1); })
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">My Donations</h1>
          <p className="text-gray-500 mt-1">Track all your donation history</p>
        </div>
        <Link href="/donor/donate"><Button><Package className="w-4 h-4" /> New Donation</Button></Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {statusFilters.map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              statusFilter === s ? "bg-emerald-500 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700")}>
            {s === "all" ? "All" : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
      ) : donations.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No donations found</p>
          <Link href="/donor/donate"><Button>Make Your First Donation</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/donor/my-donations/${d.id}`}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                  <CardContent className="p-5 flex items-center gap-4">
                    <NGOLogo name={d.ngo.name} logo={d.ngo.logo} size="xl" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-gray-900 dark:text-white">{d.ngo.name}</p>
                        <span className={cn("status-badge text-xs", getStatusColor(d.status))}>{d.status.replace(/_/g, " ")}</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        <span className="font-mono text-gray-500">{d.trackingCode}</span> · {d.totalItems} items · {d.pickupMethod.replace(/_/g, " ").toLowerCase()} · {formatDate(d.createdAt)}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
