/**
 * 🔐 AUTHENTICATION MIDDLEWARE - PRISMA + JWT
 * 
 * Middleware for protecting routes with JWT authentication
 */

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "synrgy_secret_key_change_in_production";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    fullName: string | null;
  };
}

/**
 * Middleware to authenticate requests using JWT from cookie
 */
export async function authenticatePrisma(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.synrgy_token;

  if (!token) {
    return res.status(401).json({ error: "Non autorisé - Token manquant" });
  }

  try {
    // Verify JWT token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur introuvable" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

// Alias for consistency
export const requireAuthPrisma = authenticatePrisma;

