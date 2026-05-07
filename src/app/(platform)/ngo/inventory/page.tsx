"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Warehouse, Loader2, Package, Shirt, Snowflake, Sun, Cloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InventoryData {
  inventory: Array<{
    category: string; type: string; season: string; size: string; condition: string;
    _sum: { quantity: number | null }; _count: { id: number };
  }>;
  totals: { totalItems: number; uniqueTypes: number };
  byCategory: Array<{ category: string; _sum: { quantity: number | null } }>;
  bySeason: Array<{ season: string; _sum: { quantity: number | null } }>;
}

const catLabels: Record<string, string> = { MENS: "Men's", WOMENS: "Women's", KIDS_BOYS: "Boys", KIDS_GIRLS: "Girls", INFANT: "Infant", UNISEX: "Unisex" };
const catColors: Record<string, string> = { MENS: "bg-blue-500", WOMENS: "bg-pink-500", KIDS_BOYS: "bg-indigo-500", KIDS_GIRLS: "bg-purple-500", INFANT: "bg-amber-500", UNISEX: "bg-teal-500" };
const seasonIcons: Record<string, React.ElementType> = { SUMMER: Sun, WINTER: Snowflake, ALL_SEASON: Cloud };

export default function InventoryPage() {
  const [data, setData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ngo/inventory").then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  if (!data) return null;

  const maxCat = Math.max(...data.byCategory.map(c => c._sum.quantity || 0), 1);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">Inventory</h1>
        <p className="text-gray-500 mt-1">Track received items available for distribution</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Items in Stock", value: data.totals.totalItems, icon: Package, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
          { label: "Unique Types", value: data.totals.uniqueTypes, icon: Shirt, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
          { label: "Categories", value: data.byCategory.length, icon: Warehouse, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", s.bg)}><s.icon className={cn("w-6 h-6", s.color)} /></div>
                <div><p className="text-sm text-gray-500">{s.label}</p><p className="text-2xl font-extrabold font-heading text-gray-900 dark:text-white">{s.value.toLocaleString()}</p></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category Bar Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>By Category</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.byCategory.map((c) => {
              const qty = c._sum.quantity || 0;
              const pct = Math.round((qty / maxCat) * 100);
              return (
                <div key={c.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{catLabels[c.category] || c.category}</span>
                    <span className="text-gray-400">{qty} items</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.2, duration: 0.6 }}
                      className={cn("h-full rounded-full", catColors[c.category] || "bg-gray-500")} />
                  </div>
                </div>
              );
            })}
            {data.byCategory.length === 0 && <p className="text-gray-400 text-center py-4">No inventory items</p>}
          </CardContent>
        </Card>

        {/* By Season */}
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>By Season</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {data.bySeason.map((s) => {
                const Icon = seasonIcons[s.season] || Cloud;
                return (
                  <div key={s.season} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <Icon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-2xl font-extrabold font-heading text-gray-900 dark:text-white">{s._sum.quantity || 0}</p>
                    <p className="text-xs text-gray-400 capitalize">{s.season.replace(/_/g, " ").toLowerCase()}</p>
                  </div>
                );
              })}
              {data.bySeason.length === 0 && <p className="text-gray-400 text-center py-4 col-span-3">No items</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed table */}
      {data.inventory.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Detailed Inventory</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Category</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Type</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Season</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Size</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Condition</th>
                  <th className="text-right py-3 px-2 text-gray-400 font-medium">Qty</th>
                </tr></thead>
                <tbody>
                  {data.inventory.map((item, i) => (
                    <tr key={i} className="border-b border-gray-50 dark:border-gray-900">
                      <td className="py-2.5 px-2 capitalize text-gray-700 dark:text-gray-300">{catLabels[item.category] || item.category}</td>
                      <td className="py-2.5 px-2 capitalize text-gray-600">{item.type.replace(/_/g, " ").toLowerCase()}</td>
                      <td className="py-2.5 px-2 capitalize text-gray-600">{item.season.replace(/_/g, " ").toLowerCase()}</td>
                      <td className="py-2.5 px-2 text-gray-600">{item.size}</td>
                      <td className="py-2.5 px-2 capitalize text-gray-600">{item.condition.replace(/_/g, " ").toLowerCase()}</td>
                      <td className="py-2.5 px-2 text-right font-semibold text-gray-900 dark:text-white">{item._sum.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
