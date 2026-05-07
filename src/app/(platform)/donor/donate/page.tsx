"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Package, Truck, ClipboardCheck, ArrowRight, ArrowLeft,
  Plus, Trash2, Loader2, CheckCircle2, Star, MapPin, Calendar, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { NGOLogo } from "@/components/ui/ngo-logo";
import {
  cn, PAKISTAN_CITIES, CLOTHING_CATEGORIES, CLOTHING_TYPES,
  CLOTHING_SEASONS, CLOTHING_CONDITIONS, CLOTHING_SIZES,
} from "@/lib/utils";

interface NGO {
  id: string; name: string; slug: string; city: string;
  rating: number; reviewCount: number; isVerified: boolean;
  currentNeeds: string; description: string; logo: string | null;
}

interface DonationItem {
  category: string; type: string; season: string;
  condition: string; size: string; quantity: number;
  description: string;
}

const steps = [
  { label: "Select NGO", icon: Building2 },
  { label: "Add Items", icon: Package },
  { label: "Pickup", icon: Truck },
  { label: "Review", icon: ClipboardCheck },
];

const emptyItem: DonationItem = {
  category: "", type: "", season: "", condition: "", size: "", quantity: 1, description: "",
};

export default function DonatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loadingNgos, setLoadingNgos] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ trackingCode: string } | null>(null);
  const [error, setError] = useState("");
  const [ngoSearch, setNgoSearch] = useState("");

  // Form state
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);
  const [items, setItems] = useState<DonationItem[]>([{ ...emptyItem }]);
  const [pickupMethod, setPickupMethod] = useState("DONOR_DROPOFF");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/ngos?limit=50&verified=true")
      .then((r) => r.json())
      .then((d) => setNgos(d.ngos || []))
      .finally(() => setLoadingNgos(false));
  }, []);

  const addItem = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (idx: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== idx));
  };
  const updateItem = (idx: number, field: keyof DonationItem, value: string | number) => {
    setItems(items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const filteredNgos = ngoSearch
    ? ngos.filter((n) => n.name.toLowerCase().includes(ngoSearch.toLowerCase()) || n.city.toLowerCase().includes(ngoSearch.toLowerCase()))
    : ngos;

  const canProceed = () => {
    if (step === 1) return selectedNgo !== null;
    if (step === 2) return items.every((item) => item.category && item.type && item.season && item.condition && item.size && item.quantity > 0);
    if (step === 3) return pickupMethod !== "";
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ngoId: selectedNgo?.id,
          pickupMethod,
          scheduledDate: scheduledDate || undefined,
          scheduledTimeSlot: scheduledTime || undefined,
          pickupAddress: pickupAddress || undefined,
          notes: notes || undefined,
          items,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setSuccess({ trackingCode: result.donation.trackingCode });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit donation");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white mb-3">Donation Submitted!</h2>
        <p className="text-gray-500 mb-2">Your tracking code is:</p>
        <p className="text-2xl font-mono font-bold text-emerald-600 mb-6 bg-emerald-50 dark:bg-emerald-950/30 inline-block px-6 py-3 rounded-xl">{success.trackingCode}</p>
        <p className="text-sm text-gray-400 mb-8">Save this code to track your donation status</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push("/donor/my-donations")}>View My Donations</Button>
          <Button variant="outline" onClick={() => router.push(`/track/${success.trackingCode}`)}>Track Now</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">Make a Donation</h1>
        <p className="text-gray-500 mt-1">Follow the steps to donate your clothes</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all font-semibold text-sm",
                step > i + 1 ? "bg-emerald-500 text-white" :
                step === i + 1 ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30" :
                "bg-gray-100 dark:bg-gray-800 text-gray-400"
              )}>
                {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={cn("text-xs font-medium hidden sm:block", step === i + 1 ? "text-emerald-600" : "text-gray-400")}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-0.5 flex-1 mx-2 rounded-full", step > i + 1 ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-800")} />
            )}
          </div>
        ))}
      </div>

      {error && <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 text-sm">{error}</div>}

      <AnimatePresence mode="wait">
        {/* Step 1: Select NGO */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <Input placeholder="Search NGOs..." value={ngoSearch} onChange={(e) => setNgoSearch(e.target.value)} className="pl-10" />
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {loadingNgos ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                    {filteredNgos.map((ngo) => (
                      <button
                        key={ngo.id}
                        onClick={() => setSelectedNgo(ngo)}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
                          selectedNgo?.id === ngo.id
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                            : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                        )}
                      >
                        <NGOLogo name={ngo.name} logo={ngo.logo} size="md" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1"><span className="font-semibold text-sm text-gray-900 dark:text-white truncate">{ngo.name}</span>{ngo.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5"><MapPin className="w-3 h-3" />{ngo.city}<Star className="w-3 h-3 text-amber-400 fill-amber-400" />{ngo.rating}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Add Items */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            {items.map((item, idx) => (
              <Card key={idx} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Item {idx + 1}</h3>
                    {items.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5"><Label className="text-xs">Category</Label>
                      <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={item.category} onChange={(e) => updateItem(idx, "category", e.target.value)}>
                        <option value="">Select</option>{CLOTHING_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select></div>
                    <div className="space-y-1.5"><Label className="text-xs">Type</Label>
                      <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={item.type} onChange={(e) => updateItem(idx, "type", e.target.value)}>
                        <option value="">Select</option>{CLOTHING_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select></div>
                    <div className="space-y-1.5"><Label className="text-xs">Season</Label>
                      <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={item.season} onChange={(e) => updateItem(idx, "season", e.target.value)}>
                        <option value="">Select</option>{CLOTHING_SEASONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select></div>
                    <div className="space-y-1.5"><Label className="text-xs">Condition</Label>
                      <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={item.condition} onChange={(e) => updateItem(idx, "condition", e.target.value)}>
                        <option value="">Select</option>{CLOTHING_CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select></div>
                    <div className="space-y-1.5"><Label className="text-xs">Size</Label>
                      <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={item.size} onChange={(e) => updateItem(idx, "size", e.target.value)}>
                        <option value="">Select</option>{CLOTHING_SIZES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select></div>
                    <div className="space-y-1.5"><Label className="text-xs">Qty</Label>
                      <Input type="number" min={1} max={100} value={item.quantity} onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)} /></div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addItem} className="w-full"><Plus className="w-4 h-4" /> Add Another Item</Button>
          </motion.div>
        )}

        {/* Step 3: Pickup Method */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "DONOR_DROPOFF", label: "Drop Off", desc: "Visit NGO center", icon: Building2 },
                    { value: "NGO_PICKUP", label: "Home Pickup", desc: "NGO collects from you", icon: Truck },
                    { value: "COURIER", label: "Courier", desc: "Ship via courier", icon: Package },
                  ].map((m) => (
                    <button key={m.value} onClick={() => setPickupMethod(m.value)}
                      className={cn("p-4 rounded-xl border-2 text-left transition-all",
                        pickupMethod === m.value ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : "border-gray-100 dark:border-gray-800 hover:border-gray-200")}>
                      <m.icon className={cn("w-6 h-6 mb-2", pickupMethod === m.value ? "text-emerald-600" : "text-gray-400")} />
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{m.label}</p>
                      <p className="text-xs text-gray-400">{m.desc}</p>
                    </button>
                  ))}
                </div>
                {pickupMethod === "NGO_PICKUP" && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label className="text-xs">Preferred Date</Label>
                        <div className="relative"><Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input type="date" className="pl-10" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} /></div></div>
                      <div className="space-y-1.5"><Label className="text-xs">Time Slot</Label>
                        <select className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}>
                          <option value="">Any time</option><option value="9:00 AM - 12:00 PM">Morning (9-12)</option><option value="12:00 PM - 3:00 PM">Afternoon (12-3)</option><option value="3:00 PM - 6:00 PM">Evening (3-6)</option>
                        </select></div>
                    </div>
                    <div className="space-y-1.5"><Label className="text-xs">Pickup Address</Label><Input placeholder="Full address for pickup" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} /></div>
                  </div>
                )}
                <div className="space-y-1.5"><Label className="text-xs">Notes (optional)</Label>
                  <textarea className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm min-h-[80px]" placeholder="Any special instructions..." value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Donation Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <div><p className="text-xs text-gray-400">Donating to</p><p className="font-semibold text-gray-900 dark:text-white">{selectedNgo?.name}</p></div>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{items.length} Item(s) — {items.reduce((s, i) => s + i.quantity, 0)} total pieces</p>
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 text-sm border-b border-gray-50 dark:border-gray-900 last:border-0">
                        <span className="text-gray-600 dark:text-gray-300 capitalize">{CLOTHING_TYPES.find(t=>t.value===item.type)?.label || item.type} ({item.size})</span>
                        <span className="text-gray-400">×{item.quantity} · {CLOTHING_CATEGORIES.find(c=>c.value===item.category)?.label} · {item.season}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div><p className="text-xs text-gray-400">Pickup Method</p><p className="font-semibold text-gray-900 dark:text-white capitalize">{pickupMethod.replace(/_/g, " ").toLowerCase()}</p></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && <Button variant="outline" size="lg" onClick={() => setStep(step - 1)} className="flex-1 sm:flex-none"><ArrowLeft className="w-4 h-4" /> Back</Button>}
        <div className="flex-1" />
        {step < 4 ? (
          <Button size="lg" onClick={() => setStep(step + 1)} disabled={!canProceed()} className="flex-1 sm:flex-none">
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button size="lg" onClick={handleSubmit} disabled={submitting} className="flex-1 sm:flex-none">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit Donation <CheckCircle2 className="w-4 h-4" /></>}
          </Button>
        )}
      </div>
    </div>
  );
}
