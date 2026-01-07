"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { MdArrowBack, MdSave } from "react-icons/md";
import { Button, Input, Card } from "@/components/ui";
import { UploadButton } from "@/utils/uploadthing";

interface Blog {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  image: string | null;
  isPublished: boolean;
  createdAt: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    content: "",
    image: "",
    isPublished: false,
  });

  // 🔹 Fetch blog
  useEffect(() => {
    if (slug) fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch blog");
      const data = await response.json();
      const blogData = data.result || data.data || data.blog;

      if (!blogData) {
        toast.error("Blog not found");
        return;
      }

      setBlog(blogData);
      setForm({
        title: blogData.title || "",
        subtitle: blogData.subtitle || "",
        description: blogData.description || "",
        content: blogData.content || "",
        image: blogData.image || "",
        isPublished: blogData.isPublished || false,
      });
    } catch (err) {
      toast.error("Error loading blog");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({ ...prev, [target.name]: target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [target.name]: target.value }));
    }
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to update blog");

      toast.success("Blog updated successfully!");
      router.push("/admin/blogs");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading blog...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-color6">
      {/* 🔹 Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/admin/blogs">
              <Button variant="ghost" size="sm">
                <MdArrowBack size={20} />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-color3">
              Edit Blog: {blog.title}
            </h1>
          </div>
        </div>
      </header>

      {/* 🔹 Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter blog title"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <Input
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                placeholder="Enter subtitle"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short blog description"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-color1"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                placeholder="Write your blog content here..."
                rows={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-color1"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Cover Image
              </label>

              {form.image ? (
                <div className="relative w-full h-48 mb-4">
                  <img
                    src={form.image}
                    alt="Blog Cover"
                    className="w-full h-full object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="absolute top-2 right-2 bg-white/80"
                    onClick={() => setForm({ ...form, image: "" })}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]?.ufsUrl) {
                      setForm((prev) => ({
                        ...prev,
                        image: res[0].ufsUrl,
                      }));
                      toast.success("Image uploaded!");
                    }
                  }}
                  onUploadError={(error) => {
                    console.error("Upload failed:", error);
                    toast.error("Image upload failed. Please try again.");
                  }}
                />
              )}
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">Published</span>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={saving}
            >
              <MdSave size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
