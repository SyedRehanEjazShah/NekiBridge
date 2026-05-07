"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Package, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TrackPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!code.trim()) { setError("Please enter a tracking code"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/donations/track/${code.trim()}`);
      if (!res.ok) { setError("Donation not found. Please check the tracking code."); setLoading(false); return; }
      router.push(`/track/${code.trim()}`);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <SessionProvider>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white mb-3">Track Your Donation</h1>
          <p className="text-gray-500 mb-8">Enter your tracking code to see the current status</p>

          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 text-sm">{error}</div>}

          <div className="flex gap-3">
            <Input placeholder="e.g. NB-2025-ABC12" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="text-center font-mono text-lg h-14" onKeyDown={(e) => e.key === "Enter" && handleTrack()} />
            <Button size="lg" className="h-14 px-8" onClick={handleTrack} disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Track</>}
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-4">Tracking codes look like: NB-2025-XXXXX</p>
        </motion.div>
      </div>
      <Footer />
    </SessionProvider>
  );
}
