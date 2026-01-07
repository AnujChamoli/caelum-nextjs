"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/components/ui";
import {
  MdArticle,
  MdSearch,
  MdQuestionAnswer,
  MdLogout,
  MdDashboard,
} from "react-icons/md";

interface DashboardStats {
  blogs: number;
  seoPages: number;
  users?: number;
  faqs: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();

      if (!response.ok || !data.result) {
        console.error("Failed to fetch stats:", data.message);
        return;
      }

      setStats(data.result);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Auto-refresh when returning to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchStats();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    {
      title: "Blogs",
      description: "Manage blog posts and articles",
      icon: MdArticle,
      href: "/admin/blogs",
      count: stats?.blogs ?? 0,
      color: "bg-blue-500",
    },
    {
      title: "SEO Pages",
      description: "Manage SEO content pages",
      icon: MdSearch,
      href: "/admin/seo",
      count: stats?.seoPages ?? 0,
      color: "bg-green-500",
    },
    {
      title: "FAQs",
      description: "Manage frequently asked questions",
      icon: MdQuestionAnswer,
      href: "/admin/faqs",
      count: stats?.faqs ?? 0,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-color6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <MdDashboard className="text-color9 text-2xl" />
              <h1 className="text-xl font-bold text-color3">
                Admin Dashboard
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <MdLogout size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-color3">Welcome, Admin</h2>
          <p className="text-gray-600 mt-1">
            Manage your content and settings from here
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{item.title}</p>
                    <p className="text-3xl font-bold text-color3 mt-1">
                      {loading ? "..." : item.count}
                    </p>
                  </div>
                  <div className={`${item.color} p-3 rounded-lg`}>
                    <item.icon className="text-white text-2xl" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">{item.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-color3 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/blogs/new">
              <Button>+ New Blog Post</Button>
            </Link>
            <Link href="/admin/seo/new">
              <Button variant="outline">+ New SEO Page</Button>
            </Link>
            <Link href="/admin/faqs/new">
              <Button variant="outline">+ New FAQ</Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
