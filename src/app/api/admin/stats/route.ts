import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAdminAuth } from "@/lib/auth";
import {
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/lib/api-response";

// GET /api/admin/stats
export async function GET(request: NextRequest) {
  try {
    // Ensure only admins can access
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    //  Fetch counts from database
    const [blogs, seoPages, users] = await Promise.all([
      prisma.blog.count(),
      prisma.seoPage.count().catch(() => 0), // optional
      prisma.user.count().catch(() => 0), // optional
    ]);

    return successResponse(
      { blogs, seoPages, users },
      "Dashboard stats retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return serverErrorResponse("Failed to fetch dashboard stats", error);
  }
}
