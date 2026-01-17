"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button, DataTable } from "@/components/ui";
import { MdAdd, MdEdit, MdDelete, MdArrowBack } from "react-icons/md";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";

interface Blog {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  readTime: number | null;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // 🔹 Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        console.error("Failed to fetch blogs:", response.statusText);
        toast.error("Failed to fetch blogs.");
        return;
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Adapt to your backend format
      const blogsData =
        data.result || data.data || data.items || data.results || data.blogs || [];
      setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Error loading blogs.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete blog by slug
  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
      if (!response.ok) {
        toast.error("Failed to delete blog.");
        return;
      }

      // Optimistically remove from UI
      setBlogs((prev) => prev.filter((blog) => blog.slug !== slug));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error("Error deleting blog.");
    }
  };

  // 🔹 Define table columns
  const columns: ColumnDef<Blog>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <p className="font-medium text-color3 truncate max-w-xs">
          {row.getValue("title")}
        </p>
      ),
    },
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
      accessorKey: "isPublished",
      header: "Status",
      cell: ({ row }) => {
        const isPublished = row.getValue("isPublished") as boolean;
        return (
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              isPublished
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
        );
      },
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/blogs/${row.original.slug}/edit`)}
            className="text-blue-600 hover:bg-blue-50"
          >
            <MdEdit size={18} />
          </Button>
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
              <h1 className="text-xl font-bold text-color3">Manage Blogs</h1>
            </div>
            <Link href="/admin/blogs/new">
              <Button className="flex items-center gap-2">
                <MdAdd size={20} />
                New Blog
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : blogs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No blogs found</p>
            <Link href="/admin/blogs/new">
              <Button>Create your first blog</Button>
            </Link>
          </Card>
        ) : (
          <Card className="p-6">
            <DataTable
              columns={columns}
              data={blogs}
              searchKey="title"
              searchPlaceholder="Search blogs by title..."
            />
          </Card>
        )}
      </main>
    </div>
  );
}
