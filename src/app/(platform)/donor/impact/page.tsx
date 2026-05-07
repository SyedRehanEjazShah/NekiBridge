"use client";

import { motion } from "framer-motion";
import { BarChart3, Package, Heart, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ImpactPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">Impact Report</h1>
        <p className="text-gray-500 mt-1">See the difference you&apos;re making</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white overflow-hidden relative">
          <div className="absolute inset-0 pattern-bg opacity-20" />
          <CardContent className="p-8 relative z-10 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-white/80" />
            <h2 className="text-2xl font-extrabold font-heading mb-2">Your Generosity Matters</h2>
            <p className="text-white/70 max-w-md mx-auto">
              Every garment you donate creates a ripple effect of kindness.
              Keep donating to build a more detailed impact report!
            </p>
            <p className="urdu-text text-white/50 mt-3 text-sm">
              آپ کی ہر سخاوت نیکی کی لہر پیدا کرتی ہے
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Package, title: "Clothing Impact", desc: "Total items donated and distributed to families in need", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
          { icon: Users, title: "Lives Touched", desc: "Number of beneficiaries reached through your donations", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
          { icon: TrendingUp, title: "Growth Trend", desc: "Your donation frequency and volume over time", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
          { icon: BarChart3, title: "Category Breakdown", desc: "Distribution of clothing types you've donated", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-0 shadow-sm h-full">
              <CardContent className="p-6 flex items-start gap-4">
                <div className={`p-3 rounded-xl ${item.bg}`}><item.icon className={`w-6 h-6 ${item.color}`} /></div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                  <p className="text-xs text-gray-400 mt-2 italic">Detailed charts coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
