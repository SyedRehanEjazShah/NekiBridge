"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Key, Server, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">Admin Settings</h1>
        <p className="text-gray-500 mt-1">Platform configuration and admin profile</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Admin Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{session?.user?.name}</p>
                <p className="text-sm text-gray-400">{session?.user?.email}</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 text-xs font-medium mt-1">
                  <Shield className="w-3 h-3" /> Platform Admin
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>System Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Server, label: "Framework", value: "Next.js 15 + React 19" },
              { icon: Database, label: "Database", value: "SQLite + Prisma ORM" },
              { icon: Key, label: "Authentication", value: "NextAuth v5 (Credentials)" },
              { icon: Shield, label: "Authorization", value: "Role-based (Donor / NGO / Admin)" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <item.icon className="w-5 h-5 text-gray-400 shrink-0" />
                <div><p className="text-xs text-gray-400">{item.label}</p><p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
