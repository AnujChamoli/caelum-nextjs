"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Button, Input } from "@/components/ui";
import { MdAdd, MdEdit, MdDelete, MdArrowBack, MdSearch } from "react-icons/md";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  blogId: number | null;
  blog?: {
    title: string;
  };
  createdAt: string;
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch("/api/faqs");
      const data = await response.json();
      if (response.ok && (data.success || data.result || data.data)) {
        setFaqs(data.result || data.data || []);
      } else {
        console.error("Unexpected FAQ API response:", data);
      }
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const response = await fetch(`/api/faqs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFaqs((prev) => prev.filter((faq) => faq.id !== id));
      } else {
        console.error("Failed to delete FAQ");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
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
              <h1 className="text-xl font-bold text-color3">Manage FAQs</h1>
            </div>
            <Link href="/admin/faqs/new">
              <Button className="flex items-center gap-2">
                <MdAdd size={20} />
                New FAQ
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
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
            />
          </div>
        </div>

        {/* FAQs List */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredFaqs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No FAQs found</p>
            <Link href="/admin/faqs/new">
              <Button>Create your first FAQ</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <Card key={faq.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-color3 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {faq.answer}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>
                        Created: {new Date(faq.createdAt).toLocaleDateString()}
                      </span>
                      {faq.blogId && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Linked to Blog:{" "}
                          {faq.blog?.title || `#${faq.blogId}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/faqs/${faq.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <MdEdit size={18} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <MdDelete size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
