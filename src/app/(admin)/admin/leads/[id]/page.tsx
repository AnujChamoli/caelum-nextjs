"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/components/ui";
import { MdArrowBack, MdDelete, MdCheckCircle } from "react-icons/md";
import { toast } from "react-toastify";

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

export default function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchLead() {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (!res.ok) throw new Error("Failed to fetch lead");
      const data = await res.json();
      const leadData: Lead =
        data.result?.lead || data.lead || data.result || data;
      setLead(leadData);
    } catch (err) {
      console.error("Error fetching lead:", err);
      toast.error("Failed to load lead.");
    } finally {
      setLoading(false);
    }
  }

  const handleVerify = async () => {
    if (!lead || lead.verified) return;
    if (!confirm("Mark this lead as verified?")) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: true }),
      });
      if (!res.ok) throw new Error("Verify failed");
      toast.success("Lead marked verified.");
      await fetchLead();
    } catch (err) {
      console.error(err);
      toast.error("Verification failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Permanently delete this lead?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Lead deleted.");
      router.push("/admin/leads");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-color6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/leads">
                <Button variant="ghost" size="sm">
                  <MdArrowBack size={20} />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-color3">Lead details</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : !lead ? (
            <div className="text-center text-gray-500">Lead not found</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-color3">
                    {lead.name}
                  </h2>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                  <p className="text-sm mt-1">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {lead.phone}
                    </code>
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    {lead.city}, {lead.state}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`px-2 py-1 rounded-full text-xs ${
                      lead.verified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {lead.verified ? "Verified" : "Pending"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(lead.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  <strong>OTP:</strong> {lead.otp || "-"}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4">
                {!lead.verified && (
                  <Button onClick={handleVerify} disabled={actionLoading}>
                    <MdCheckCircle className="mr-2" />
                    {actionLoading ? "Processing..." : "Mark Verified"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="text-red-600"
                  onClick={handleDelete}
                  disabled={actionLoading}
                >
                  <MdDelete className="mr-2" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/admin/leads")}
                >
                  Back to list
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
