import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { JWTPayload, AdminJWTPayload } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const ADMIN_JWT_SECRET =
  process.env.ADMIN_JWT_SECRET || "your-admin-secret-key";
const TOKEN_EXPIRY = "7d";
const ADMIN_TOKEN_EXPIRY = "24h";

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT Token management
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function generateAdminToken(payload: AdminJWTPayload): string {
  return jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: ADMIN_TOKEN_EXPIRY });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function verifyAdminToken(token: string): AdminJWTPayload | null {
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET) as AdminJWTPayload;
  } catch {
    return null;
  }
}

// Cookie management
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function setAdminAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("admin-auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");
  return token?.value || null;
}

export async function getAdminAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-auth-token");
  return token?.value || null;
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

export async function clearAdminAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin-auth-token");
}

// Get current user from token
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentAdmin(): Promise<AdminJWTPayload | null> {
  const token = await getAdminAuthToken();
  if (!token) return null;
  return verifyAdminToken(token);
}

// Auth middleware helpers
export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json(
    { status: false, message, error: "Unauthorized" },
    { status: 401 }
  );
}

export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json(
    { status: false, message, error: "Forbidden" },
    { status: 403 }
  );
}

// Extract token from Authorization header
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

// Verify request authentication
export async function verifyRequestAuth(
  request: Request
): Promise<JWTPayload | null> {
  // First try Authorization header
  const authHeader = request.headers.get("Authorization");
  const bearerToken = extractBearerToken(authHeader);

  if (bearerToken) {
    return verifyToken(bearerToken);
  }

  // Fall back to cookie
  return getCurrentUser();
}

export async function verifyRequestAdminAuth(
  request: Request
): Promise<AdminJWTPayload | null> {
  // First try Authorization header
  const authHeader = request.headers.get("Authorization");
  const bearerToken = extractBearerToken(authHeader);

  if (bearerToken) {
    return verifyAdminToken(bearerToken);
  }

  // Fall back to cookie
  return getCurrentAdmin();
}
