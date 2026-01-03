"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/components/ui";
import { MdAdd, MdEdit, MdDelete, MdArrowBack, MdSearch } from "react-icons/md";
import { toast } from "react-toastify";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  // 🔹 Filter blogs by search
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
            />
          </div>
        </div>

        {/* Blogs Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No blogs found</p>
              <Link href="/admin/blogs/new">
                <Button>Create your first blog</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-color3 truncate max-w-xs">
                          {blog.title}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {blog.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            blog.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {blog.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/blogs/${blog.slug}/edit`)}
                          >
                            <MdEdit size={18} />
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(blog.slug)}
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
