"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Loader2, Plus, X, Calendar, Target, MapPin, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDate, PAKISTAN_CITIES } from "@/lib/utils";

interface Campaign {
  id: string; title: string; titleUrdu: string | null; description: string;
  targetItems: number; collectedItems: number; startDate: string; endDate: string;
  isActive: boolean; city: string; urgencyLevel: string;
}

const urgencyColors: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  HIGH: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  LOW: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [titleUrdu, setTitleUrdu] = useState("");
  const [description, setDescription] = useState("");
  const [targetItems, setTargetItems] = useState(100);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [city, setCity] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");

  const fetchCampaigns = () => {
    setLoading(true);
    fetch("/api/ngo/campaigns").then(r => r.json()).then(d => setCampaigns(d.campaigns || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/ngo/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, titleUrdu, description, targetItems, startDate, endDate, city, urgencyLevel: urgency }),
      });
      setShowForm(false);
      setTitle(""); setTitleUrdu(""); setDescription(""); setTargetItems(100); setStartDate(""); setEndDate(""); setCity(""); setUrgency("MEDIUM");
      fetchCampaigns();
    } finally { setSubmitting(false); }
  };

  const toggleCampaign = async (id: string, isActive: boolean) => {
    await fetch("/api/ngo/campaigns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: id, isActive: !isActive }),
    });
    fetchCampaigns();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">Campaigns</h1>
          <p className="text-gray-500 mt-1">Create and manage donation drives</p>
        </div>
        <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> New Campaign</Button>
      </div>

      {/* Create Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[90vh]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Campaign</h2>
                  <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5"><Label>Campaign Title</Label><Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Winter Clothing Drive 2026" /></div>
                  <div className="space-y-1.5"><Label>Title (Urdu)</Label><Input value={titleUrdu} onChange={e => setTitleUrdu(e.target.value)} placeholder="سردیوں کی لباس مہم" className="text-right" dir="rtl" /></div>
                  <div className="space-y-1.5"><Label>Description</Label><textarea className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm min-h-[80px]" required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the campaign..." /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Target Items</Label><Input type="number" min={1} required value={targetItems} onChange={e => setTargetItems(parseInt(e.target.value))} /></div>
                    <div className="space-y-1.5"><Label>Urgency</Label>
                      <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={urgency} onChange={e => setUrgency(e.target.value)}>
                        <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option>
                      </select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                    <div className="space-y-1.5"><Label>End Date</Label><Input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
                  </div>
                  <div className="space-y-1.5"><Label>City</Label>
                    <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={city} onChange={e => setCity(e.target.value)}>
                      <option value="">Select city</option>{PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select></div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Megaphone className="w-4 h-4" /> Create Campaign</>}
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Campaigns Grid */}
      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div> : campaigns.length === 0 ? (
        <div className="text-center py-20"><Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 mb-4">No campaigns yet</p><Button onClick={() => setShowForm(true)}>Create Your First Campaign</Button></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((c, i) => {
            const progress = Math.round((c.collectedItems / c.targetItems) * 100);
            const isExpired = new Date(c.endDate) < new Date();
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={cn("border-0 shadow-sm hover:shadow-lg transition-all", !c.isActive && "opacity-60")}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white truncate">{c.title}</h3>
                          <span className={cn("status-badge text-xs", urgencyColors[c.urgencyLevel])}>{c.urgencyLevel}</span>
                        </div>
                        {c.titleUrdu && <p className="urdu-text text-xs text-gray-400">{c.titleUrdu}</p>}
                      </div>
                      <button onClick={() => toggleCampaign(c.id, c.isActive)}
                        className={cn("text-xs px-2 py-1 rounded-md font-medium", c.isActive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30" : "bg-gray-100 text-gray-500 dark:bg-gray-800")}>
                        {c.isActive ? "Active" : "Paused"}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{c.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.city}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(c.startDate)} - {formatDate(c.endDate)}</span>
                      {isExpired && <span className="text-red-500 font-medium">Expired</span>}
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">{c.collectedItems} / {c.targetItems} items</span>
                      <span className="font-semibold text-emerald-600">{progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", progress >= 100 ? "bg-emerald-500" : progress >= 70 ? "bg-blue-500" : "bg-amber-500")} style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
