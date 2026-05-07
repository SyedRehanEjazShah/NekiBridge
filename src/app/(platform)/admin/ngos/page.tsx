"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, ShieldCheck, ShieldOff, Loader2, MapPin, Star,
  Package, Heart, Mail, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

interface NGO {
  id: string; name: string; slug: string; city: string; isVerified: boolean;
  rating: number; reviewCount: number; totalReceived: number; totalDistributed: number;
  createdAt: string; admin: { name: string; email: string };
}

export default function AdminNGOsPage() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchNGOs = () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (filter !== "all") p.set("verified", filter === "verified" ? "true" : "false");
    fetch(`/api/admin/ngos?${p}`).then(r => r.json()).then(d => setNgos(d.ngos || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNGOs(); }, [filter]);

  const toggleVerify = async (ngoId: string, current: boolean) => {
    setToggling(ngoId);
    await fetch("/api/admin/ngos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ngoId, isVerified: !current }),
    });
    setToggling(null);
    fetchNGOs();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">NGO Management</h1>
        <p className="text-gray-500 mt-1">Verify and manage registered organizations</p>
      </div>

      <div className="flex gap-2">
        {["all", "verified", "unverified"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize",
              filter === f ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200")}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div> : ngos.length === 0 ? (
        <div className="text-center py-20"><Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No NGOs found</p></div>
      ) : (
        <div className="space-y-3">
          {ngos.map((ngo, i) => (
            <motion.div key={ngo.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold shrink-0">{ngo.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-gray-900 dark:text-white">{ngo.name}</h3>
                        {ngo.isVerified ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldOff className="w-4 h-4 text-gray-300" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ngo.city}</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{ngo.rating} ({ngo.reviewCount})</span>
                        <span className="flex items-center gap-1"><Package className="w-3 h-3" />{ngo.totalReceived.toLocaleString()} recv</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{ngo.totalDistributed.toLocaleString()} dist</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <User className="w-3 h-3" />{ngo.admin.name} · <Mail className="w-3 h-3" />{ngo.admin.email} · Joined {formatDate(ngo.createdAt)}
                      </div>
                    </div>
                    <Button onClick={() => toggleVerify(ngo.id, ngo.isVerified)} disabled={toggling === ngo.id}
                      variant={ngo.isVerified ? "outline" : "default"} size="sm" className="shrink-0">
                      {toggling === ngo.id ? <Loader2 className="w-4 h-4 animate-spin" /> : ngo.isVerified ? <><ShieldOff className="w-4 h-4" /> Revoke</> : <><ShieldCheck className="w-4 h-4" /> Verify</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
