"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button, DataTable } from "@/components/ui";
import { MdAdd, MdEdit, MdDelete, MdArrowBack } from "react-icons/md";
import { ColumnDef } from "@tanstack/react-table";

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

  // 🔹 Define table columns
  const columns: ColumnDef<SeoPage>[] = [
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
          {row.getValue("slug")}
        </code>
      ),
    },
    {
      accessorKey: "metaTitle",
      header: "Meta Title",
      cell: ({ row }) => (
        <p className="font-medium text-color3 truncate max-w-xs">
          {row.getValue("metaTitle")}
        </p>
      ),
    },
    {
      accessorKey: "metaDescription",
      header: "Meta Description",
      cell: ({ row }) => (
        <p className="text-sm text-gray-500 truncate max-w-xs">
          {(row.getValue("metaDescription") as string) || "-"}
        </p>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/seo/${row.original.slug}/edit`}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              <MdEdit size={18} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.slug)}
            className="text-red-600 hover:bg-red-50"
          >
            <MdDelete size={18} />
          </Button>
        </div>
      ),
    },
  ];


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
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : pages.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No SEO pages found</p>
            <Link href="/admin/seo/new">
              <Button>Create your first SEO page</Button>
            </Link>
          </Card>
        ) : (
          <Card className="p-6">
            <DataTable
              columns={columns}
              data={pages}
              searchKey="slug"
              searchPlaceholder="Search by slug or title..."
            />
          </Card>
        )}
      </main>
    </div>
  );
}
