"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/components/ui";
import { MdArrowBack, MdSearch, MdDelete, MdVisibility } from "react-icons/md";

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

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Debounce search (simple)
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1); // reset to first page when searching
      fetchLeads(1, searchQuery);
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    fetchLeads(page, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchLeads(pageNum = 1, search = "") {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      q.set("page", String(pageNum));
      if (search) q.set("search", search);

      const res = await fetch(`/api/leads?${q.toString()}`);
      const data = await res.json();
      const result = data.result || {}; // safe fallback

      setLeads(result.leads || []);
      setPagination(result.pagination || null);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    // prevent owner row click
    e?.stopPropagation();

    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Delete failed.");
        return;
      }

      // remove from UI
      setLeads((prev) => prev.filter((l) => l.id !== id));
      // optionally refetch to update pagination
      fetchLeads(page, searchQuery);
    } catch (error) {
      console.error("Failed to delete lead:", error);
      alert("Delete failed.");
    }
  };

  const goToLead = (id: string) => {
    router.push(`/admin/leads/${id}`);
  };

  const goToPage = (p: number) => {
    if (!pagination) return;
    if (p < 1 || p > pagination.totalPages) return;
    setPage(p);
  };

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
              <h1 className="text-xl font-bold text-color3">Manage Leads</h1>
            </div>
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
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
            />
          </div>
        </div>

        {/* Leads Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verified
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
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => goToLead(lead.id)}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-color3 truncate max-w-xs">{lead.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 truncate max-w-xs">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{lead.phone}</code>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{lead.city}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{lead.state}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${lead.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {lead.verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Delete — stopPropagation to avoid row click */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDelete(lead.id, e)}
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

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} — {pagination.total} leads
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => goToPage(page - 1)} disabled={page <= 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => goToPage(page + 1)} disabled={page >= pagination.totalPages}>Next</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}