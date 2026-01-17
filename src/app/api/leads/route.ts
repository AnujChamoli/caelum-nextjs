import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { verifyRequestAdminAuth } from "@/lib/auth";

/* =====================================================
   ADMIN — GET LEADS
   GET /api/leads?page=1&search=john
===================================================== */
export async function GET(req: Request) {
  try {
    const admin = await verifyRequestAdminAuth(req).catch(() => null);

    if (process.env.NODE_ENV === "production" && !admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin access" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const search = url.searchParams.get("search") || "";
    const limit = 10;
    const skip = (page - 1) * limit;

    const where: Prisma.LeadWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { state: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    console.log(`[API] Fetching leads - Found ${total} total, returning ${leads.length} for page ${page}`);

    return NextResponse.json({
      success: true,
      result: {
        leads,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching leads." },
      { status: 500 }
    );
  }
}

/* =====================================================
   PUBLIC — CREATE / VERIFY LEAD
   POST /api/leads
===================================================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, state, city, otp } = body;

    console.log("Received lead submission:", body);

    if (!phone || !name || !email) {
      return NextResponse.json(
        { success: false, message: "Phone, name, and email are required." },
        { status: 400 }
      );
    }

    // Check if lead already exists with this phone
    const existingLead = await prisma.lead.findUnique({
      where: { phone: String(phone) },
    });

    let lead;

    if (existingLead) {
      // Update existing lead
      lead = await prisma.lead.update({
        where: { phone: String(phone) },
        data: {
          name,
          email,
          state,
          city,
          otp: otp || existingLead.otp,
        },
      });
      console.log("Updated existing lead:", lead.id);
    } else {
      // Create new lead
      lead = await prisma.lead.create({
        data: {
          name,
          email,
          phone: String(phone),
          state,
          city,
          otp: otp || null,
          verified: false,
        },
      });
      console.log("Created new lead:", lead.id);
    }

    return NextResponse.json({
      success: true,
      message: "Lead saved successfully!",
      data: lead,
    });
  } catch (error) {
    console.error("Error creating/updating lead:", error);
    return NextResponse.json(
      { success: false, message: "Server error while saving lead." },
      { status: 500 }
    );
  }
}
