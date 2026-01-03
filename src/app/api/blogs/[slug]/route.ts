import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAdminAuth } from "@/lib/auth";
import { updateBlogSchema, validateData } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

//  GET /api/blogs/[slug]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const blog = await prisma.blog.findUnique({ where: { slug } });

    if (!blog) {
      return notFoundResponse("Blog not found");
    }

    return successResponse(blog, "Blog retrieved successfully");
  } catch (error) {
    return serverErrorResponse("Failed to fetch blog", error);
  }
}

// PUT /api/blogs/[slug] — Update including `isPublished`
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Verify admin authentication
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    const body = await request.json();

    // Validate input (optional, depends on schema)
    const validation = validateData(updateBlogSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    // Ensure blog exists
    const existingBlog = await prisma.blog.findUnique({ where: { slug } });
    if (!existingBlog) {
      return notFoundResponse("Blog not found");
    }

    // Update blog (including isPublished)
    const updatedBlog = await prisma.blog.update({
      where: { slug },
      data: {
        title: body.title ?? existingBlog.title,
        subtitle: body.subtitle ?? existingBlog.subtitle,
        description: body.description ?? existingBlog.description,
        content: body.content ?? existingBlog.content,
        image: body.image ?? existingBlog.image,
        isPublished:
          typeof body.isPublished === "boolean"
            ? body.isPublished
            : existingBlog.isPublished,
      },
    });

    return successResponse(updatedBlog, "Blog updated successfully");
  } catch (error) {
    return serverErrorResponse("Failed to update blog", error);
  }
}

// DELETE /api/blogs/[slug]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    const existingBlog = await prisma.blog.findUnique({ where: { slug } });
    if (!existingBlog) {
      return notFoundResponse("Blog not found");
    }

    await prisma.blog.delete({ where: { slug } });

    return successResponse(null, "Blog deleted successfully");
  } catch (error) {
    return serverErrorResponse("Failed to delete blog", error);
  }
}
