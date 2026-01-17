"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Button, DataTable } from "@/components/ui";
import { MdAdd, MdEdit, MdDelete, MdArrowBack } from "react-icons/md";
import { ColumnDef } from "@tanstack/react-table";

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

  // 🔹 Define table columns
  const columns: ColumnDef<FAQ>[] = [
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => (
        <p className="font-medium text-color3 line-clamp-2 text-sm">
          {row.getValue("question")}
        </p>
      ),
    },
    {
      accessorKey: "blogId",
      header: "Linked Blog",
      cell: ({ row }) => {
        const faq = row.original;
        return (
          <span className="text-sm">
            {faq.blogId ? (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs inline-block">
                {faq.blog?.title || `#${faq.blogId}`}
              </span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
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
          <Link href={`/admin/faqs/${row.original.id}/edit`}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 p-1">
              <MdEdit size={16} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:bg-red-50 p-1"
          >
            <MdDelete size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-color6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
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

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : faqs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No FAQs found</p>
            <Link href="/admin/faqs/new">
              <Button>Create your first FAQ</Button>
            </Link>
          </Card>
        ) : (
          <Card className="p-6">
            <DataTable
              columns={columns}
              data={faqs}
              searchKey="question"
              searchPlaceholder="Search FAQs by question..."
            />
          </Card>
        )}
      </main>
    </div>
  );
}
