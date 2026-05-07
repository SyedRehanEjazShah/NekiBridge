"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DonorSettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{session?.user?.name}</p>
                <p className="text-sm text-gray-400">{session?.user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <User className="w-5 h-5 text-gray-400" />
                <div><p className="text-xs text-gray-400">Name</p><p className="text-sm font-medium text-gray-900 dark:text-white">{session?.user?.name}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <Mail className="w-5 h-5 text-gray-400" />
                <div><p className="text-xs text-gray-400">Email</p><p className="text-sm font-medium text-gray-900 dark:text-white">{session?.user?.email}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <Shield className="w-5 h-5 text-gray-400" />
                <div><p className="text-xs text-gray-400">Role</p><p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{session?.user?.role?.toLowerCase().replace(/_/g, " ")}</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
