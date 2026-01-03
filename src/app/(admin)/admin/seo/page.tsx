"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { MdAdd, MdEdit, MdDelete, MdArrowBack, MdSearch } from "react-icons/md";

interface SeoPage {
  id: number;
  slug: string;
  metaTitle: string;
  metaDescription: string | null;
  createdAt: string;
}

export default function AdminSeoPage() {
  const router = useRouter();
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
  try {
    const response = await fetch("/api/seo");
    const data = await response.json();
    console.log("API Response:", data);

    // FIX: use result or data key depending on API response
    const seoData = data.result || data.data || [];
    setPages(seoData);
  } catch (error) {
    console.error("Failed to fetch SEO pages:", error);
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this SEO page?")) return;

    try {
      const response = await fetch(`/api/seo/${slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPages(pages.filter((page) => page.slug !== slug));
      }
    } catch (error) {
      console.error("Failed to delete SEO page:", error);
    }
  };

  const filteredPages = pages.filter((page) => {
  const title = page.metaTitle || ""; // fallback if undefined
  const slug = page.slug || "";

  return (
    title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });


  return (
    <div className="min-h-screen bg-color6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <MdArrowBack size={20} />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-color3">
                Manage SEO Pages
              </h1>
            </div>
            <Link href="/admin/seo/new">
              <Button className="flex items-center gap-2">
                <MdAdd size={20} />
                New SEO Page
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search SEO pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
            />
          </div>
        </div>

        {/* SEO Pages Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredPages.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No SEO pages found</p>
              <Link href="/admin/seo/new">
                <Button>Create your first SEO page</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meta Title
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meta Description
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {page.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-color3 truncate max-w-xs">
                          {page.metaTitle}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {page.metaDescription || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(page.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/seo/${page.slug}/edit`}>
                            <Button variant="ghost" size="sm">
                              <MdEdit size={18} />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(page.slug)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <MdDelete size={18} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
