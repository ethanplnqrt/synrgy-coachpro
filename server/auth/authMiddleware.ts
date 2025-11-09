import type { Request, Response, NextFunction } from "express";
import { AUTH_COOKIE_NAME, verifyToken } from "./authToken.js";
import { findUserById, toPublicUser } from "./userStore.js";

export interface AuthenticatedRequest extends Request {
  user?: ReturnType<typeof toPublicUser>;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  const user = findUserById(payload.userId);
  if (!user) {
    return res.status(401).json({ success: false, error: "User not found" });
  }

  req.user = toPublicUser(user);
  next();
}

// Alias for new routes consistency
export const requireAuth = authenticate;
