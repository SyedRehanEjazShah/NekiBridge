"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Building2, MapPin, Phone, Globe, Shield, Star, Package, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface NGOInfo {
  ngo: {
    name: string; slug: string; city: string; address: string; phone: string | null;
    email: string | null; website: string | null; isVerified: boolean; rating: number;
    reviewCount: number; totalReceived: number; totalDistributed: number; foundedYear: number | null;
  };
}

export default function NGOSettingsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<NGOInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/ngo").then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  const ngo = data?.ngo;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your NGO profile and account</p>
      </div>

      {/* Admin Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Admin Account</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{session?.user?.name}</p>
                <p className="text-sm text-gray-400">{session?.user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"><User className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-400">Name</p><p className="text-sm font-medium text-gray-900 dark:text-white">{session?.user?.name}</p></div></div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"><Shield className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-400">Role</p><p className="text-sm font-medium text-gray-900 dark:text-white">NGO Admin</p></div></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* NGO Profile */}
      {ngo && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle>Organization Profile</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Building2, label: "Organization", value: ngo.name },
                { icon: MapPin, label: "Location", value: `${ngo.address}, ${ngo.city}` },
                { icon: Phone, label: "Phone", value: ngo.phone || "Not set" },
                { icon: Mail, label: "Email", value: ngo.email || "Not set" },
                { icon: Globe, label: "Website", value: ngo.website || "Not set" },
                { icon: Star, label: "Rating", value: `${ngo.rating} (${ngo.reviewCount} reviews)` },
                { icon: Package, label: "Total Received", value: `${ngo.totalReceived.toLocaleString()} items` },
                { icon: Heart, label: "Distributed", value: `${ngo.totalDistributed.toLocaleString()} items` },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <item.icon className="w-5 h-5 text-gray-400 shrink-0" />
                  <div><p className="text-xs text-gray-400">{item.label}</p><p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p></div>
                </div>
              ))}
              <div className="pt-3 flex items-center gap-2">
                {ngo.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 text-sm font-medium"><Shield className="w-4 h-4" /> Verified Organization</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 text-sm font-medium">Verification Pending</span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
