"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button, DataTable } from "@/components/ui";
import { MdArrowBack, MdDelete } from "react-icons/md";
import { ColumnDef } from "@tanstack/react-table";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  otp?: string | null;
  verified: boolean;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();

      console.log("API Response:", data);

      if (!res.ok) {
        setError(data.message || "Failed to fetch leads");
        setLeads([]);
        return;
      }

      const result = data.result || {};
      const leadsData = result.leads || [];
      
      console.log("Fetched leads:", leadsData);
      setLeads(leadsData);
      
      if (leadsData.length === 0) {
        setError("No leads found");
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      setError("Network error while fetching leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Delete failed.");
        return;
      }

      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      console.error("Failed to delete lead:", error);
      alert("Delete failed.");
    }
  };

  // 🔹 Define table columns
  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <p className="font-medium text-color3 truncate max-w-xs">{row.getValue("name")}</p>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <p className="text-sm text-gray-700 truncate max-w-xs">{row.getValue("email")}</p>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{row.getValue("phone")}</code>
      ),
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => (
        <p className="text-sm text-gray-700">{row.getValue("city")}</p>
      ),
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <p className="text-sm text-gray-700">{row.getValue("state")}</p>
      ),
    },
    {
      accessorKey: "verified",
      header: "Verified",
      cell: ({ row }) => {
        const verified = row.getValue("verified") as boolean;
        return (
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {verified ? "Verified" : "Pending"}
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
            onClick={() => router.push(`/admin/leads/${row.original.id}`)}
            className="text-blue-600 hover:bg-blue-50"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
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
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <MdArrowBack size={20} />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-color3">Manage Leads</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLeads}
              disabled={loading}
              className="ml-4"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Card className="p-4 mb-4 border-l-4 border-orange-500 bg-orange-50">
            <p className="text-orange-800 font-semibold">{error}</p>
          </Card>
        )}
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : leads.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No leads found</p>
            <Button
              onClick={fetchLeads}
              variant="outline"
            >
              Refresh to Check Again
            </Button>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="mb-4 text-sm text-gray-600">
              Total Leads: <span className="font-bold text-color3">{leads.length}</span>
            </div>
            <DataTable
              columns={columns}
              data={leads}
              searchKey="email"
              searchPlaceholder="Search by name, email or phone..."
            />
          </Card>
        )}
      </main>
    </div>
  );
}