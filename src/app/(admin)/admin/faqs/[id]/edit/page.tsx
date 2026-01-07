"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input } from "@/components/ui";
import { MdArrowBack, MdSave, MdSearch, MdEdit, MdCheck } from "react-icons/md";
import { toast } from "react-toastify";

interface Blog {
  id: string;
  title: string;
  subtitle?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  blogId: string | null;
  blog?: Blog | null;
}

export default function EditFaqPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [faq, setFaq] = useState<FAQ | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    blogId: "",
    blog: null as Blog | null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Blog[]>([]);
  const [changingBlog, setChangingBlog] = useState(false);

  // 🔹 Fetch FAQ
  useEffect(() => {
    if (!id) return;
    fetchFaq();
  }, [id]);

  const fetchFaq = async () => {
    try {
      const response = await fetch(`/api/faqs/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch FAQ");

      const faqData = data.result || data.data;
      setFaq(faqData);
      setFormData({
        question: faqData.question || "",
        answer: faqData.answer || "",
        blogId: faqData.blogId || "",
        blog: faqData.blog || null,
      });
    } catch (err) {
      console.error("Error fetching FAQ:", err);
      setError("Failed to load FAQ details");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Debounced Blog Search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchBlogs(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const fetchBlogs = async (query: string) => {
    try {
      setSearching(true);
      const response = await fetch(`/api/blogs?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      const blogs = data.result || data.data || [];
      if (Array.isArray(blogs)) setSearchResults(blogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setSearching(false);
    }
  };

  // 🔹 Select Blog
  const selectBlog = (blog: Blog) => {
    setFormData((prev) => ({
      ...prev,
      blogId: blog.id,
      blog: blog,
    }));
    setSearchQuery("");
    setChangingBlog(false);
  };

  // 🔹 Enable blog change
  const handleChangeBlog = () => {
    setChangingBlog(true);
  };

  // 🔹 Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/faqs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          blogId: formData.blogId || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update FAQ");

      toast.success("FAQ updated successfully!");
      router.push("/admin/faqs");
      router.refresh();
    } catch (err) {
      console.error("Error updating FAQ:", err);
      toast.error(err instanceof Error ? err.message : "Error updating FAQ");
      setError(err instanceof Error ? err.message : "Failed to update FAQ");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Loading / Error states
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading FAQ...
      </div>
    );

  if (!faq)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        FAQ not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-color6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/admin/faqs">
              <Button variant="ghost" size="sm">
                <MdArrowBack size={20} />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-color3">
              Edit FAQ: {faq.question.slice(0, 40)}...
            </h1>
          </div>
          <Button
            type="submit"
            form="faq-edit-form"
            isLoading={saving}
            className="flex items-center gap-2"
          >
            <MdSave size={20} />
            Save
          </Button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
        )}

        <form id="faq-edit-form" onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">FAQ Details</h2>
            <div className="space-y-4">
              <Input
                label="Question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                required
                placeholder="Enter the FAQ question"
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
                  rows={6}
                  placeholder="Enter the FAQ answer"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-color1"
                  required
                />
              </div>

              {/* 🔹 Blog Linking */}
              <div>
                <label className="block text-sm font-medium text-color3 mb-2">
                  Linked Blog
                </label>

                {!changingBlog && formData.blog ? (
                  <div className="border border-gray-200 rounded-lg p-4 bg-white flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-color3 text-lg">
                        {formData.blog.title}
                      </h3>
                      {formData.blog.subtitle && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {formData.blog.subtitle}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleChangeBlog}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <MdEdit size={18} />
                      Change
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <MdSearch size={18} className="absolute left-3 top-3 text-gray-400" />
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
                      searchResults.length > 0 && (
                        <ul className="border border-gray-200 rounded-lg mt-2 bg-white shadow-sm max-h-56 overflow-y-auto">
                          {searchResults.map((blog) => (
                            <li
                              key={blog.id}
                              onClick={() => selectBlog(blog)}
                              className={`px-4 py-2 cursor-pointer border-b border-gray-100 flex justify-between items-center ${
                                blog.id === formData.blogId
                                  ? "bg-color1/10 font-semibold text-color3"
                                  : "hover:bg-color1/10"
                              }`}
                            >
                              <div>
                                <p className="text-color3">{blog.title}</p>
                                {blog.subtitle && (
                                  <p className="text-sm text-gray-600 line-clamp-1">
                                    {blog.subtitle}
                                  </p>
                                )}
                              </div>
                              {blog.id === formData.blogId && (
                                <MdCheck className="text-green-600" size={20} />
                              )}
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>
        </form>
      </main>
    </div>
  );
}
