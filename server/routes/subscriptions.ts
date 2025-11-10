import { Router } from "express";
import { authenticate, type AuthenticatedRequest } from "../auth/authMiddleware.js";
import {
  getSubscriptionByUserId,
  getAllSubscriptions,
  cancelSubscription,
  checkExpiredSubscriptions,
} from "../services/subscriptionService.js";
import { stripe, isStripeConfigured } from "../utils/stripe.js";

const router = Router();

/**
 * GET /api/subscriptions/:userId
 * Get subscription status for a user
 */
router.get("/:userId", authenticate, async (req: AuthenticatedRequest, res) => {
  const { userId } = req.params;
  const currentUser = req.user!;

  // Authorization: User can only see their own subscription, or coach can see their clients
  if (currentUser.id !== userId && currentUser.role !== "coach") {
    return res.status(403).json({
      success: false,
      error: "Unauthorized - You can only view your own subscription",
    });
  }

  try {
    const subscription = await getSubscriptionByUserId(userId);

    if (!subscription) {
      return res.json({
        success: true,
        active: false,
        plan: null,
        status: null,
        message: "No active subscription",
      });
    }

    // Check if subscription is expired
    await checkExpiredSubscriptions();
    
    // Re-fetch after expiration check
    const updatedSubscription = await getSubscriptionByUserId(userId);
    
    if (!updatedSubscription) {
      return res.json({
        success: true,
        active: false,
        plan: null,
        status: null,
        message: "No active subscription",
      });
    }

    return res.json({
      success: true,
      active: updatedSubscription.status === "active",
      subscription: {
        id: updatedSubscription.id,
        plan: updatedSubscription.plan,
        status: updatedSubscription.status,
        startDate: updatedSubscription.startDate,
        renewalDate: updatedSubscription.renewalDate,
        endDate: updatedSubscription.endDate,
        discount: updatedSubscription.discount,
        referralCode: updatedSubscription.referralCode,
      },
    });
  } catch (error: any) {
    console.error("Error fetching subscription:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch subscription",
    });
  }
});

/**
 * POST /api/subscriptions/cancel/:userId
 * Cancel user subscription
 */
router.post("/cancel/:userId", authenticate, async (req: AuthenticatedRequest, res) => {
  const { userId } = req.params;
  const currentUser = req.user!;

  // Authorization: User can only cancel their own subscription
  if (currentUser.id !== userId) {
    return res.status(403).json({
      success: false,
      error: "Unauthorized - You can only cancel your own subscription",
    });
  }

  try {
    const subscription = await getSubscriptionByUserId(userId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "No active subscription found",
      });
    }

    if (subscription.status === "canceled") {
      return res.json({
        success: true,
        message: "Subscription already canceled",
        subscription: {
          plan: subscription.plan,
          status: subscription.status,
          endDate: subscription.endDate,
        },
      });
    }

    // Cancel in Stripe if we have a Stripe subscription ID
    if (isStripeConfigured() && stripe && subscription.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        console.log(`🚫 Stripe subscription canceled: ${subscription.stripeSubscriptionId}`);
      } catch (stripeError: any) {
        console.error("Stripe cancellation error:", stripeError);
        // Continue with local cancellation even if Stripe fails
      }
    }

    // Cancel locally
    const canceledSubscription = await cancelSubscription(userId, currentUser.email);

    if (!canceledSubscription) {
      return res.status(500).json({
        success: false,
        error: "Failed to cancel subscription",
      });
    }

    return res.json({
      success: true,
      message: "Subscription canceled successfully",
      subscription: {
        plan: canceledSubscription.plan,
        status: canceledSubscription.status,
        endDate: canceledSubscription.endDate,
      },
    });
  } catch (error: any) {
    console.error("Error canceling subscription:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to cancel subscription",
    });
  }
});

/**
 * GET /api/subscriptions/all
 * Get all subscriptions (admin/coach only)
 */
router.get("/", authenticate, async (req: AuthenticatedRequest, res) => {
  const currentUser = req.user!;

  // Authorization: Only coach can see all subscriptions
  if (currentUser.role !== "coach") {
    return res.status(403).json({
      success: false,
      error: "Unauthorized - Admin access required",
    });
  }

  try {
    const subscriptions = await getAllSubscriptions();

    // Check for expired subscriptions
    await checkExpiredSubscriptions();
    
    // Re-fetch after expiration check
    const updatedSubscriptions = await getAllSubscriptions();

    return res.json({
      success: true,
      count: updatedSubscriptions.length,
      subscriptions: updatedSubscriptions.map(sub => ({
        id: sub.id,
        userId: sub.userId,
        plan: sub.plan,
        status: sub.status,
        startDate: sub.startDate,
        renewalDate: sub.renewalDate,
        endDate: sub.endDate,
        discount: sub.discount,
        referralCode: sub.referralCode,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching all subscriptions:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch subscriptions",
    });
  }
});

export default router;

