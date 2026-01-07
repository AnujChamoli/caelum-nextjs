"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input } from "@/components/ui";
import { UploadButton } from "@/utils/uploadthing"; 
import { MdArrowBack, MdSave } from "react-icons/md";
import { toast } from "react-toastify";

export default function EditSeoPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
    schemaMarkup: "",
    content: "",
  });

  // Fetch existing SEO page
  useEffect(() => {
    if (!slug) return;
    fetchSeoPage();
  }, [slug]);

  const fetchSeoPage = async () => {
    try {
      const response = await fetch(`/api/seo/${slug}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch SEO data");

      const seoData = data.result || data.data;
      if (!seoData) throw new Error("SEO page not found");

      setFormData({
        slug: seoData.slug || "",
        metaTitle: seoData.metaTitle || "",
        metaDescription: seoData.metaDescription || "",
        metaKeywords: seoData.metaKeywords || "",
        ogTitle: seoData.ogTitle || "",
        ogDescription: seoData.ogDescription || "",
        ogImage: seoData.ogImage || "",
        canonicalUrl: seoData.canonicalUrl || "",
        schemaMarkup: seoData.schemaMarkup || "",
        content: seoData.content || "",
      });
    } catch (err) {
      console.error("Error fetching SEO page:", err);
      setError("Failed to load SEO page.");
      toast.error("Failed to load SEO data");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      //  Validate JSON Schema
      if (formData.schemaMarkup) {
        try {
          JSON.parse(formData.schemaMarkup);
        } catch {
          throw new Error("Invalid JSON format in Schema Markup field");
        }
      }

      const response = await fetch(`/api/seo/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update SEO page");

      toast.success("SEO page updated successfully!");
      router.push("/admin/seo");
    } catch (err) {
      console.error("Error updating SEO:", err);
      setError(err instanceof Error ? err.message : "Failed to update SEO");
      toast.error(err instanceof Error ? err.message : "Error updating SEO");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading SEO data...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-color6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/seo">
                <Button variant="ghost" size="sm">
                  <MdArrowBack size={20} />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-color3">
                Edit SEO Page: {slug}
              </h1>
            </div>
            <Button
              type="submit"
              form="seo-edit-form"
              isLoading={saving}
              className="flex items-center gap-2"
            >
              <MdSave size={20} />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form id="seo-edit-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Page Info */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">Page Information</h2>
            <div className="space-y-4">
              <Input
                label="Page Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="/about-us or /services/web-dev"
              />
              <Input
                label="Meta Title"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                required
                placeholder="Page title for search engines"
              />
              <div>
                <label className="block text-sm font-medium text-color3 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="Brief description (150–160 characters)"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-color1"
                />
              </div>
              <Input
                label="Meta Keywords"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
                placeholder="keyword1, keyword2, keyword3"
              />
              <Input
                label="Canonical URL"
                name="canonicalUrl"
                value={formData.canonicalUrl}
                onChange={handleChange}
                placeholder="https://example.com/page"
              />
            </div>
          </Card>

          {/* Open Graph Section */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">
              Open Graph (Social Sharing)
            </h2>
            <div className="space-y-4">
              <Input
                label="OG Title"
                name="ogTitle"
                value={formData.ogTitle}
                onChange={handleChange}
                placeholder="Title for social sharing"
              />
              <div>
                <label className="block text-sm font-medium text-color3 mb-2">
                  OG Description
                </label>
                <textarea
                  name="ogDescription"
                  value={formData.ogDescription}
                  onChange={handleChange}
                  placeholder="Description for social sharing"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-color1"
                />
              </div>

              {/*  UploadThing */}
              <div>
                <label className="block text-sm font-medium text-color3 mb-2">
                  OG Image
                </label>
                {formData.ogImage ? (
                  <div className="relative w-full h-48 mb-4">
                    <img
                      src={formData.ogImage}
                      alt="OG Image Preview"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="absolute top-2 right-2 bg-white/80"
                      onClick={() => setFormData({ ...formData, ogImage: "" })}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]?.ufsUrl) {
                        setFormData({ ...formData, ogImage: res[0].ufsUrl });
                      }
                    }}
                    onUploadError={(error) => {
                      console.error("Upload failed:", error);
                      alert("Image upload failed. Please try again.");
                    }}
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Schema Markup */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">Schema Markup</h2>
            <div>
              <label className="block text-sm font-medium text-color3 mb-2">
                JSON-LD Schema
              </label>
              <textarea
                name="schemaMarkup"
                value={formData.schemaMarkup}
                onChange={handleChange}
                placeholder='{"@context": "https://schema.org", ...}'
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1 font-mono text-sm"
              />
            </div>
          </Card>

          {/* Page Content */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">Page Content</h2>
            <div>
              <label className="block text-sm font-medium text-color3 mb-2">
                Content (HTML)
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Page content (HTML supported)"
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
              />
            </div>
          </Card>
        </form>
      </main>
    </div>
  );
}
