"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const campaigns = [
  {
    id: "1",
    title: "Winter Relief Drive 2025",
    titleUrdu: "سردیوں کی امداد مہم",
    ngoName: "Edhi Foundation",
    city: "Nationwide",
    urgency: "CRITICAL",
    targetItems: 5000,
    collectedItems: 3200,
    daysLeft: 18,
    needs: ["Blankets", "Sweaters", "Shawls", "Jackets"],
  },
  {
    id: "2",
    title: "Eid Clothing for Orphans",
    titleUrdu: "یتیموں کے لیے عید کے کپڑے",
    ngoName: "Akhuwat Foundation",
    city: "Lahore",
    urgency: "HIGH",
    targetItems: 2000,
    collectedItems: 800,
    daysLeft: 32,
    needs: ["Shalwar Kameez", "Shoes", "Dupattas"],
  },
  {
    id: "3",
    title: "School Uniform Drive",
    titleUrdu: "سکول یونیفارم مہم",
    ngoName: "Al-Khidmat Foundation",
    city: "Peshawar",
    urgency: "MEDIUM",
    targetItems: 1500,
    collectedItems: 600,
    daysLeft: 45,
    needs: ["School Uniforms", "Shoes", "Socks"],
  },
];

const urgencyColors: Record<string, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-900" },
  HIGH: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-900" },
  MEDIUM: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-900" },
  LOW: { bg: "bg-gray-50 dark:bg-gray-950/30", text: "text-gray-600 dark:text-gray-400", border: "border-gray-200 dark:border-gray-900" },
};

export function ActiveCampaigns() {
  return (
    <section className="py-24 bg-gray-50/50 dark:bg-gray-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Urgent Needs
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-gray-900 dark:text-white mb-4">
            Active <span className="text-gradient">Campaigns</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            These NGOs urgently need your help. Every item counts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((campaign, i) => {
            const progress = Math.round((campaign.collectedItems / campaign.targetItems) * 100);
            const colors = urgencyColors[campaign.urgency];

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white dark:bg-gray-900 rounded-2xl border ${colors.border} p-6 hover:shadow-xl transition-all hover:-translate-y-1`}
              >
                {/* Urgency badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`status-badge ${colors.bg} ${colors.text}`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {campaign.urgency}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    {campaign.daysLeft} days left
                  </span>
                </div>

                <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white mb-1">
                  {campaign.title}
                </h3>
                <p className="urdu-text text-xs text-emerald-500 mb-3">{campaign.titleUrdu}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{campaign.ngoName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {campaign.city}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">
                      <span className="font-semibold text-gray-900 dark:text-white">{campaign.collectedItems.toLocaleString()}</span>
                      /{campaign.targetItems.toLocaleString()} items
                    </span>
                    <span className="font-semibold text-emerald-600">{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Needs tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {campaign.needs.map((need) => (
                    <span
                      key={need}
                      className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs"
                    >
                      {need}
                    </span>
                  ))}
                </div>

                <Link href={`/donor/donate?campaign=${campaign.id}`}>
                  <Button className="w-full" size="sm">
                    <Target className="w-4 h-4" />
                    Contribute Now
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
