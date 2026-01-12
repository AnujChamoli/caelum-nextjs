import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAdminAuth } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/leads/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      return notFoundResponse("Lead not found");
    }

    return successResponse(lead, "Lead retrieved successfully");
  } catch (error) {
    return serverErrorResponse("Failed to fetch lead", error);
  }
}

// PATCH /api/leads/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require admin
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    const body = await request.json().catch(() => ({}));
    const updateData: Record<string, any> = {};

    // Allow updating a handful of safe fields
    if (typeof body.name === "string") updateData.name = body.name;
    if (typeof body.email === "string") updateData.email = body.email;
    if (typeof body.phone === "string") updateData.phone = body.phone;
    if (typeof body.state === "string") updateData.state = body.state;
    if (typeof body.city === "string") updateData.city = body.city;
    if (typeof body.otp === "string") updateData.otp = body.otp;
    if (typeof body.verified === "boolean") updateData.verified = body.verified;

    if (Object.keys(updateData).length === 0) {
      return errorResponse("No valid fields provided to update", 400);
    }

    // Ensure lead exists
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("Lead not found");
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    return successResponse(updated, "Lead updated successfully");
  } catch (error: any) {
    // Prisma unique constraint or other DB error
    return serverErrorResponse("Failed to update lead", error);
  }
}

// DELETE /api/leads/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require admin
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("Lead not found");
    }

    await prisma.lead.delete({ where: { id } });

    return successResponse(null, "Lead deleted successfully");
  } catch (error) {
    return serverErrorResponse("Failed to delete lead", error);
  }
}