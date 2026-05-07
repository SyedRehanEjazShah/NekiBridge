"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Loader2, Search, Shield, Package, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

interface User {
  id: string; name: string; email: string; role: string; phone: string | null;
  isActive: boolean; createdAt: string;
  donorProfile: { city: string; totalDonations: number; totalItems: number } | null;
  _count: { donations: number };
}

const roleColors: Record<string, string> = {
  DONOR: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  NGO_ADMIN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  PLATFORM_ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (filter !== "all") p.set("role", filter);
    if (search) p.set("search", search);
    fetch(`/api/admin/users?${p}`).then(r => r.json()).then(d => { setUsers(d.users || []); setTotal(d.pagination?.total || 0); }).finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      const p = new URLSearchParams();
      if (filter !== "all") p.set("role", filter);
      if (search) p.set("search", search);
      fetch(`/api/admin/users?${p}`).then(r => r.json()).then(d => { setUsers(d.users || []); setTotal(d.pagination?.total || 0); }).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-500 mt-1">{total} total users on the platform</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by name or email..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["all", "DONOR", "NGO_ADMIN", "PLATFORM_ADMIN"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("px-3 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                filter === f ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200")}>
              {f === "all" ? "All" : f === "DONOR" ? "Donors" : f === "NGO_ADMIN" ? "NGO Admins" : "Admins"}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div> : users.length === 0 ? (
        <div className="text-center py-20"><Users className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No users found</p></div>
      ) : (
        <div className="overflow-x-auto">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">City</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Donations</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Joined</th>
                </tr></thead>
                <tbody>
                  {users.map((u, i) => (
                    <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{u.name.charAt(0)}</div>
                          <div><p className="font-medium text-gray-900 dark:text-white">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                        </div>
                      </td>
                      <td className="py-3 px-4"><span className={cn("status-badge text-xs", roleColors[u.role])}>{u.role.replace(/_/g, " ")}</span></td>
                      <td className="py-3 px-4 text-gray-500">{u.donorProfile?.city || "—"}</td>
                      <td className="py-3 px-4 text-gray-500">{u._count.donations || u.donorProfile?.totalDonations || 0}</td>
                      <td className="py-3 px-4 text-gray-400">{formatDate(u.createdAt)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
