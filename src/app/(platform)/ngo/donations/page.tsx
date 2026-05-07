"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Loader2, X, ArrowRight, Clock, CheckCircle2, Truck,
  Heart, Eye, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getStatusColor, formatDate, formatDateTime } from "@/lib/utils";

interface Donation {
  id: string; trackingCode: string; status: string; totalItems: number;
  pickupMethod: string; createdAt: string; notes: string | null;
  donor: { name: string; email: string; phone: string | null };
  items: Array<{ id: string; category: string; type: string; season: string; condition: string; size: string; quantity: number }>;
}

const statusFlow = ["PENDING", "SCHEDULED", "PICKED_UP", "IN_TRANSIT", "RECEIVED", "SORTED", "DISTRIBUTED"];
const statusFilters = ["all", ...statusFlow, "REJECTED"];

export default function NGODonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Donation | null>(null);
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDonations = () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    if (filter !== "all") p.set("status", filter);
    fetch(`/api/ngo/donations?${p}`)
      .then(r => r.json())
      .then(d => { setDonations(d.donations || []); setTotalPages(d.pagination?.totalPages || 1); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDonations(); }, [page, filter]);

  const updateStatus = async (donationId: string, newStatus: string) => {
    setUpdating(true);
    try {
      await fetch("/api/ngo/donations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationId, newStatus }),
      });
      fetchDonations();
      setSelected(null);
    } finally { setUpdating(false); }
  };

  const getNextStatus = (current: string) => {
    const idx = statusFlow.indexOf(current);
    return idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">Manage Donations</h1>
        <p className="text-gray-500 mt-1">Review, accept, and track incoming donations</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {statusFilters.map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }}
            className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              filter === s ? "bg-emerald-500 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200")}>
            {s === "all" ? "All" : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div> : donations.length === 0 ? (
        <div className="text-center py-20"><Package className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No donations found</p></div>
      ) : (
        <div className="space-y-3">
          {donations.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(d)}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shrink-0">{d.donor.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900 dark:text-white">{d.donor.name}</p>
                      <span className={cn("status-badge text-xs", getStatusColor(d.status))}>{d.status.replace(/_/g, " ")}</span>
                    </div>
                    <p className="text-sm text-gray-400"><span className="font-mono">{d.trackingCode}</span> · {d.totalItems} items · {d.pickupMethod.replace(/_/g, " ").toLowerCase()} · {formatDate(d.createdAt)}</p>
                  </div>
                  {getNextStatus(d.status) && (
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); updateStatus(d.id, getNextStatus(d.status)!); }} disabled={updating}
                      className="shrink-0 hidden sm:flex">
                      <ChevronRight className="w-4 h-4" /> {getNextStatus(d.status)!.replace(/_/g, " ")}
                    </Button>
                  )}
                  <Eye className="w-4 h-4 text-gray-300 shrink-0" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-gray-500 self-center">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Donation Details</h2>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-2">
                    <p className="text-xs text-gray-400">Tracking Code</p>
                    <p className="font-mono font-bold text-emerald-600">{selected.trackingCode}</p>
                    <p className="text-xs text-gray-400 mt-2">Donor</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selected.donor.name}</p>
                    <p className="text-sm text-gray-500">{selected.donor.email}{selected.donor.phone ? ` · ${selected.donor.phone}` : ""}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{selected.items.length} Item(s) — {selected.totalItems} total</p>
                    <div className="space-y-2">
                      {selected.items.map((item) => (
                        <div key={item.id} className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm">
                          <span className="text-gray-700 dark:text-gray-300 capitalize">{item.type.replace(/_/g, " ").toLowerCase()} ({item.size})</span>
                          <span className="text-gray-400">×{item.quantity} · {item.category} · {item.season}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selected.notes && <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-sm text-amber-700 dark:text-amber-400"><p className="text-xs font-medium mb-1">Donor Notes</p>{selected.notes}</div>}

                  {/* Status Actions */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Update Status</p>
                    <div className="grid grid-cols-2 gap-2">
                      {statusFlow.map(s => {
                        const isCurrent = selected.status === s;
                        const isPast = statusFlow.indexOf(s) < statusFlow.indexOf(selected.status);
                        return (
                          <button key={s} disabled={isPast || isCurrent || updating}
                            onClick={() => updateStatus(selected.id, s)}
                            className={cn("px-3 py-2 rounded-lg text-xs font-medium transition-all text-left",
                              isCurrent ? "bg-emerald-500 text-white ring-2 ring-emerald-500/30" :
                              isPast ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed" :
                              "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600"
                            )}>
                            {s.replace(/_/g, " ")} {isCurrent && "✓"}
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={() => updateStatus(selected.id, "REJECTED")} disabled={updating}
                      className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-100 transition-colors">
                      Reject Donation
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
