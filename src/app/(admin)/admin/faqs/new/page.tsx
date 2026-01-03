"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input, Select } from "@/components/ui";
import { MdArrowBack, MdSave } from "react-icons/md";

interface Blog {
  id: string;
  title: string;
}

export default function NewFaqPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    blogId: "",
  });

  //  Fetch blogs to optionally link FAQ to a blog
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");

      if (!response.ok) {
        console.error("Failed to fetch blogs:", response.statusText);
        return;
      }

      const data = await response.json();
      const blogsData = data.result || data.data || data.items || [];
      setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: formData.question,
          answer: formData.answer,
          // If blogId is empty string, send null
          blogId: formData.blogId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create FAQ");
      }

      // ✅ Redirect to FAQ list after success
      router.push("/admin/faqs");
      router.refresh();
    } catch (err) {
      console.error("Error creating FAQ:", err);
      setError(err instanceof Error ? err.message : "Failed to create FAQ");
    } finally {
      setLoading(false);
    }
  };

  // Dropdown options
  const blogOptions = [
    { value: "", label: "No blog (standalone FAQ)" },
    ...blogs.map((blog) => ({
      value: blog.id,
      label: blog.title,
    })),
  ];

  return (
    <div className="min-h-screen bg-color6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/faqs">
                <Button variant="ghost" size="sm">
                  <MdArrowBack size={20} />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-color3">New FAQ</h1>
            </div>
            <Button
              type="submit"
              form="faq-form"
              isLoading={loading}
              className="flex items-center gap-2"
            >
              <MdSave size={20} />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form id="faq-form" onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">FAQ Details</h2>
            <div className="space-y-4">
              <Input
                label="Question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder="Enter the question"
                required
              />

              <div>
                <label className="block text-sm font-medium text-color3 mb-2">
                  Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  placeholder="Enter the answer"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
                  required
                />
              </div>

              <Select
                label="Link to Blog (optional)"
                options={blogOptions}
                value={formData.blogId}
                onChange={(e) =>
                  setFormData({ ...formData, blogId: e.target.value })
                }
              />
            </div>
          </Card>
        </form>
      </main>
    </div>
  );
}
