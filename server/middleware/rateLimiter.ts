/**
 * 🛡️ RATE LIMITER MIDDLEWARE
 * 
 * Minimal stubs for rate limiting
 */

import type { Request, Response, NextFunction } from "express";

export function apiLimiter(req: Request, res: Response, next: NextFunction) {
  // Disabled in development
  next();
}

export function authLimiter(req: Request, res: Response, next: NextFunction) {
  // Disabled in development
  next();
}

