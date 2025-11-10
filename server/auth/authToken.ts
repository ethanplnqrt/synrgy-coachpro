import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "synrgy-dev-secret";
export const AUTH_COOKIE_NAME = "synrgy_token";
export const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days

export function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export function buildCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  };
}

