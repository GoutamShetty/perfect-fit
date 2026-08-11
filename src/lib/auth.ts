import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/constants";

const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-secret-change-me";
export { AUTH_COOKIE };

export type AdminTokenPayload = {
  id: string;
  email: string;
};

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

/** Read + verify the admin from the request cookie. Returns null if unauthenticated. */
export function getAdminFromRequest(req: NextRequest): AdminTokenPayload | null {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/** For server components / route handlers using the cookies() store. */
export async function getAdminFromCookies(): Promise<AdminTokenPayload | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
