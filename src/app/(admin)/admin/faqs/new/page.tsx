"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input } from "@/components/ui";
import { MdArrowBack, MdSave, MdSearch } from "react-icons/md";

interface Blog {
  id: string;
  title: string;
}

export default function NewFaqPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    blogId: "",
  });

  //  Fetch blogs dynamically when searching
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchBlogs(searchQuery);
      } else {
        setBlogs([]);
      }
    }, 400); // wait 400ms before fetching (debounce)
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchBlogs = async (query: string) => {
    try {
      setSearching(true);
      const response = await fetch(`/api/blogs?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      const blogsData = data.result || data.data || [];
      if (Array.isArray(blogsData)) setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setSearching(false);
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
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          blogId: formData.blogId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create FAQ");
      }

      router.push("/admin/faqs");
      router.refresh();
    } catch (err) {
      console.error("Error creating FAQ:", err);
      setError(err instanceof Error ? err.message : "Failed to create FAQ");
    } finally {
      setLoading(false);
    }
  };

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
                placeholder="Enter the FAQ question"
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
                  placeholder="Write the answer for this question"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
                  required
                />
              </div>

              {/* 🔹 Searchable Blog Selector */}
              <div>
                <label className="block text-sm font-medium text-color3 mb-2">
                  Link to Blog (optional)
                </label>
                <div className="relative">
                  <MdSearch
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blogs by title..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
                  />
                </div>

                {searching ? (
                  <p className="text-sm text-gray-500 mt-2">Searching...</p>
                ) : (
                  searchQuery.trim().length >= 2 &&
                  blogs.length > 0 && (
                    <ul className="border border-gray-200 rounded-lg mt-2 bg-white shadow-sm max-h-48 overflow-y-auto">
                      {blogs.map((blog) => (
                        <li
                          key={blog.id}
                          className={`px-4 py-2 cursor-pointer hover:bg-color1/10 ${
                            formData.blogId === blog.id ? "bg-color1/10" : ""
                          }`}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              blogId: blog.id,
                            })
                          }
                        >
                          {blog.title}
                        </li>
                      ))}
                    </ul>
                  )
                )}

                {formData.blogId && (
                  <div className="mt-2 text-sm text-color3">
                    Linked to blog ID:{" "}
                    <span className="font-semibold">{formData.blogId}</span>{" "}
                    <button
                      type="button"
                      className="text-red-600 underline ml-2"
                      onClick={() => setFormData({ ...formData, blogId: "" })}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </form>
      </main>
    </div>
  );
}
