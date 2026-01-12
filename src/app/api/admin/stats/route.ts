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
    //  Verify admin authentication
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    // Fetch all key counts concurrently
    const [blogs, seoPages, blogFaqs, users] = await Promise.all([
      prisma.blog.count().catch(() => 0),
      prisma.seoPage.count().catch(() => 0),
      prisma.blogFaq.count().catch(() => 0), 
      prisma.lead.count().catch(() => 0),
    ]);

    //  Return data in standardized format
    return successResponse(
      { blogs, seoPages, faqs: blogFaqs, leads : users },
      "Dashboard stats retrieved successfully"
    );
  } catch (error) {
    console.error(" Error fetching admin stats:", error);
    return serverErrorResponse("Failed to fetch dashboard stats", error);
  }
}
