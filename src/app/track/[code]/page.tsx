"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock, CalendarCheck, Truck, Navigation, PackageCheck, ListChecks,
  HeartHandshake, XCircle, ArrowLeft, Building2, Package, Loader2, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn, formatDateTime, getStatusColor } from "@/lib/utils";
import { NGOLogo } from "@/components/ui/ngo-logo";

interface TrackingData {
  id: string; trackingCode: string; status: string; pickupMethod: string;
  totalItems: number; notes: string | null; createdAt: string; completedAt: string | null;
  scheduledDate: string | null; scheduledTimeSlot: string | null; pickupAddress: string | null;
  ngo: { name: string; slug: string; city: string; phone: string | null; logo: string | null };
  items: Array<{ id: string; category: string; type: string; season: string; condition: string; size: string; quantity: number; isDistributed: boolean }>;
  statusHistory: Array<{ id: string; fromStatus: string; toStatus: string; note: string | null; createdAt: string; updatedBy: { name: string; role: string } }>;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string }> = {
  PENDING: { icon: Clock, color: "text-amber-500" },
  SCHEDULED: { icon: CalendarCheck, color: "text-blue-500" },
  PICKED_UP: { icon: Truck, color: "text-indigo-500" },
  IN_TRANSIT: { icon: Navigation, color: "text-purple-500" },
  RECEIVED: { icon: PackageCheck, color: "text-cyan-500" },
  SORTED: { icon: ListChecks, color: "text-teal-500" },
  DISTRIBUTED: { icon: HeartHandshake, color: "text-emerald-500" },
  REJECTED: { icon: XCircle, color: "text-red-500" },
};

const allStatuses = ["PENDING", "SCHEDULED", "PICKED_UP", "IN_TRANSIT", "RECEIVED", "SORTED", "DISTRIBUTED"];

export default function TrackCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/donations/track/${code}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return (
    <SessionProvider><Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
    </SessionProvider>
  );

  if (error || !data) return (
    <SessionProvider><Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20 text-center">
        <div><XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" /><h2 className="text-2xl font-bold mb-2">Donation Not Found</h2><p className="text-gray-500 mb-6">Tracking code &quot;{code}&quot; was not found</p><Link href="/track"><Button variant="outline"><ArrowLeft className="w-4 h-4" /> Try Again</Button></Link></div>
      </div>
      <Footer />
    </SessionProvider>
  );

  const currentStatusIdx = allStatuses.indexOf(data.status);

  return (
    <SessionProvider>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Tracking Code</p>
            <p className="text-3xl font-mono font-bold text-emerald-600 mb-3">{data.trackingCode}</p>
            <span className={cn("status-badge text-sm", getStatusColor(data.status))}>{data.status.replace(/_/g, " ")}</span>
          </div>

          {/* Visual Timeline */}
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle>Donation Journey</CardTitle></CardHeader>
            <CardContent>
              <div className="relative">
                {allStatuses.map((status, i) => {
                  const config = statusConfig[status];
                  const Icon = config.icon;
                  const isComplete = i <= currentStatusIdx;
                  const isCurrent = i === currentStatusIdx;
                  const historyEntry = data.statusHistory.find((h) => h.toStatus === status);

                  return (
                    <div key={status} className="flex gap-4 relative">
                      {/* Line connector */}
                      {i < allStatuses.length - 1 && (
                        <div className={cn("absolute left-5 top-10 w-0.5 h-full -ml-px", isComplete ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-800")} />
                      )}
                      {/* Icon */}
                      <motion.div
                        initial={isCurrent ? { scale: 0 } : {}}
                        animate={isCurrent ? { scale: 1 } : {}}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10",
                          isComplete ? "bg-emerald-100 dark:bg-emerald-950/50" : "bg-gray-100 dark:bg-gray-800",
                          isCurrent && "ring-4 ring-emerald-500/20"
                        )}
                      >
                        {isComplete ? <Icon className={cn("w-5 h-5", isCurrent ? config.color : "text-emerald-500")} /> :
                          <Icon className="w-5 h-5 text-gray-300 dark:text-gray-600" />}
                      </motion.div>
                      {/* Content */}
                      <div className={cn("pb-8 flex-1", !isComplete && "opacity-40")}>
                        <p className={cn("font-semibold text-sm", isComplete ? "text-gray-900 dark:text-white" : "text-gray-400")}>{status.replace(/_/g, " ")}</p>
                        {historyEntry && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-400">{formatDateTime(historyEntry.createdAt)}</p>
                            {historyEntry.note && <p className="text-xs text-gray-500 mt-0.5">{historyEntry.note}</p>}
                            <p className="text-xs text-gray-400">by {historyEntry.updatedBy.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* NGO Info */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <NGOLogo name={data.ngo.name} logo={data.ngo.logo} size="xl" />
              <div><p className="font-semibold text-gray-900 dark:text-white">{data.ngo.name}</p><p className="text-sm text-gray-400">{data.ngo.city}{data.ngo.phone && ` · ${data.ngo.phone}`}</p></div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle>{data.totalItems} Item(s)</CardTitle></CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{item.type.replace(/_/g, " ").toLowerCase()}</p>
                        <p className="text-xs text-gray-400">{item.category} · {item.size} · {item.season} · {item.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">×{item.quantity}</span>
                      {item.isDistributed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center"><Link href="/track"><Button variant="outline"><ArrowLeft className="w-4 h-4" /> Track Another</Button></Link></div>
        </div>
      </div>
      <Footer />
    </SessionProvider>
  );
}
