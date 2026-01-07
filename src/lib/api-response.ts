import { NextResponse } from "next/server";

// Standard API response helpers
export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      status: true,
      message: message || "Success",
      result: data,
    },
    { status }
  );
}

export function createdResponse<T>(data: T, message?: string) {
  return NextResponse.json(
    {
      status: true,
      message: message || "Created successfully",
      result: data,
    },
    { status: 201 }
  );
}

export function errorResponse(message: string, status = 400, error?: unknown) {
  console.error("API Error:", error || message);
  return NextResponse.json(
    {
      status: false,
      message,
      error: error instanceof Error ? error.message : message,
    },
    { status }
  );
}

export function notFoundResponse(message = "Resource not found") {
  return NextResponse.json(
    {
      status: false,
      message,
      error: "Not Found",
    },
    { status: 404 }
  );
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json(
    {
      status: false,
      message,
      error: "Unauthorized",
    },
    { status: 401 }
  );
}

export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json(
    {
      status: false,
      message,
      error: "Forbidden",
    },
    { status: 403 }
  );
}

export function validationErrorResponse(message: string) {
  return NextResponse.json(
    {
      status: false,
      message,
      error: "Validation Error",
    },
    { status: 422 }
  );
}

export function serverErrorResponse(
  message = "Internal server error",
  error?: unknown
) {
  console.error("Server Error:", error);
  return NextResponse.json(
    {
      status: false,
      message,
      error: "Internal Server Error",
    },
    { status: 500 }
  );
}

// Pagination helper
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message?: string
) {
  return NextResponse.json(
    {
      status: true,
      message: message || "Success",
      result: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    { status: 200 }
  );
}

// Parse pagination params from URL
export function getPaginationParams(url: URL): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("limit") || "10"))
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}


// badRequestResponse helper  

export function badRequestResponse(message: string, data: any = null) {
  return new Response(
    JSON.stringify({
      success: false,
      message,
      data,
    }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );
}
