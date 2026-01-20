"use client";

import { Navbar, Sidebar } from "@/components/layout";
import { useAuth } from "@/hooks/useAuth";
import { Analytics } from "@vercel/analytics/next";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Analytics />
      <Sidebar />
      <div className="flex flex-col flex-grow h-full overflow-hidden">
        <Navbar />
        <main className="flex-grow bg-color5 overflow-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
