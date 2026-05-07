"use client";

import { SessionProvider } from "next-auth/react";
import { DashboardSidebar } from "@/components/layout/sidebar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <DashboardSidebar />
        <main className="lg:pl-72">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
