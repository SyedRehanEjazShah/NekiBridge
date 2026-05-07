"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getStatusColor, formatDate } from "@/lib/utils";

interface Donation {
  id: string; trackingCode: string; status: string; totalItems: number;
  pickupMethod: string; createdAt: string;
  donor: { name: string; email: string };
  ngo: { name: string; city: string };
}

const statuses = ["all", "PENDING", "SCHEDULED", "PICKED_UP", "IN_TRANSIT", "RECEIVED", "SORTED", "DISTRIBUTED", "REJECTED"];

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    if (filter !== "all") p.set("status", filter);
    fetch(`/api/admin/donations?${p}`).then(r => r.json())
      .then(d => { setDonations(d.donations || []); setTotalPages(d.pagination?.totalPages || 1); setTotal(d.pagination?.total || 0); })
      .finally(() => setLoading(false));
  }, [page, filter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">All Donations</h1>
        <p className="text-gray-500 mt-1">{total} donations across the platform</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {statuses.map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }}
            className={cn("px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              filter === s ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200")}>
            {s === "all" ? "All" : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div> : donations.length === 0 ? (
        <div className="text-center py-20"><Package className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No donations found</p></div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Tracking</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Donor</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">NGO</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Items</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Method</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                </tr></thead>
                <tbody>
                  {donations.map((d, i) => (
                    <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="py-3 px-4 font-mono text-xs text-emerald-600">{d.trackingCode}</td>
                      <td className="py-3 px-4"><p className="font-medium text-gray-900 dark:text-white">{d.donor.name}</p><p className="text-xs text-gray-400">{d.donor.email}</p></td>
                      <td className="py-3 px-4"><p className="text-gray-700 dark:text-gray-300">{d.ngo.name}</p><p className="text-xs text-gray-400">{d.ngo.city}</p></td>
                      <td className="py-3 px-4 text-gray-600">{d.totalItems}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs capitalize">{d.pickupMethod.replace(/_/g, " ").toLowerCase()}</td>
                      <td className="py-3 px-4"><span className={cn("status-badge text-xs", getStatusColor(d.status))}>{d.status.replace(/_/g, " ")}</span></td>
                      <td className="py-3 px-4 text-gray-400">{formatDate(d.createdAt)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-gray-500 self-center">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
