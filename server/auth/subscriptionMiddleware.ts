import { type Response, type NextFunction } from "express";
import { type AuthenticatedRequest } from "./authMiddleware.js";
import { getUserSubscription } from "../utils/paymentStore.js";

/**
 * Middleware to check if user has an active subscription
 * Optional: can be added to routes that require a paid subscription
 */
export function requireSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  const subscription = getUserSubscription(user.id);

  if (!subscription || subscription.status !== "active") {
    return res.status(403).json({
      success: false,
      error: "Active subscription required",
      subscriptionRequired: true,
    });
  }

  next();
}

/**
 * Middleware to attach subscription info to request (non-blocking)
 */
export function attachSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = req.user;

  if (user) {
    const subscription = getUserSubscription(user.id);
    (req as any).subscription = subscription;
  }

  next();
}

