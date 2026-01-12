import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Normal authenticated user routes
const protectedPaths = [
  "/dashboard",
  "/lesson-planner",
  "/monica-chat",
  "/investor",
];

// Admin routes
const adminPaths = ["/admin"];

// Admin public routes
const adminPublicPaths = ["/admin/login", "/admin/register"];

// Auth pages for normal users
const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userToken = request.cookies.get("auth-token")?.value;
  const adminToken = request.cookies.get("admin-auth-token")?.value;

  // ------------------------
  // USER ROUTE PROTECTION
  // ------------------------
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  const isAuthPath = authPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath && !userToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath && userToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ------------------------
  // ADMIN ROUTE PROTECTION
  // ------------------------
  const isAdminPath = adminPaths.some((path) =>
    pathname.startsWith(path)
  );

  const isAdminPublicPath = adminPublicPaths.some((path) =>
    pathname.startsWith(path)
  );

  // If accessing /admin (except /admin/login & /admin/register)
  if (isAdminPath && !isAdminPublicPath) {
    if (!adminToken) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in admins away from /admin/login
  if (pathname.startsWith("/admin/login") && adminToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

// ------------------------
// MATCHER
// ------------------------
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)",
  ],
};
