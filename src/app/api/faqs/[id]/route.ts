import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAdminAuth } from "@/lib/auth";
import { updateFaqSchema, validateData } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  serverErrorResponse,
  badRequestResponse, // ✅ now available
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ✅ GET /api/faqs/[id] - Get a single FAQ
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const faq = await prisma.blogFaq.findUnique({
      where: { id },
      include: {
        blog: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            image: true,
          },
        },
      },
    });

    if (!faq) return notFoundResponse("FAQ not found");

    return successResponse(faq, "FAQ retrieved successfully");
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return serverErrorResponse("Failed to fetch FAQ", error);
  }
}

// ✅ PUT /api/faqs/[id] - Update FAQ
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const admin = await verifyRequestAdminAuth(request);
    if (!admin) return unauthorizedResponse("Admin authentication required");

    const body = await request.json();
    const validation = validateData(updateFaqSchema, body);

    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    const { question, answer, blogId } = validation.data;

    // Check if FAQ exists
    const existingFaq = await prisma.blogFaq.findUnique({ where: { id } });
    if (!existingFaq) return notFoundResponse("FAQ not found");

    // Validate blog existence if provided
    if (blogId) {
      const blogExists = await prisma.blog.findUnique({ where: { id: blogId } });
      if (!blogExists) {
        return badRequestResponse("Linked blog not found");
      }
    }

    const updatedFaq = await prisma.blogFaq.update({
      where: { id },
      data: {
        question,
        answer,
        blogId: blogId ?? existingFaq.blogId,
        updatedAt: new Date(),
      },
      include: {
        blog: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            image: true,
          },
        },
      },
    });

    return successResponse(updatedFaq, "FAQ updated successfully");
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return serverErrorResponse("Failed to update FAQ", error);
  }
}

// ✅ DELETE /api/faqs/[id] - Delete FAQ
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const admin = await verifyRequestAdminAuth(request);
    if (!admin) return unauthorizedResponse("Admin authentication required");

    const existingFaq = await prisma.blogFaq.findUnique({ where: { id } });
    if (!existingFaq) return notFoundResponse("FAQ not found");

    await prisma.blogFaq.delete({ where: { id } });

    return successResponse(null, "FAQ deleted successfully");
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return serverErrorResponse("Failed to delete FAQ", error);
  }
}
