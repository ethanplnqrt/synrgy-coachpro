/**
 * 💳 STRIPE ROUTES
 * 
 * Checkout sessions and webhook handling
 */

import express from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { getStripePrices, getStripePublishableKey, getStripeSecretKey } from "../utils/stripeConfig.js";

const router = express.Router();
const stripe = new Stripe(getStripeSecretKey() as string, {
  apiVersion: "2025-10-29.clover",
});
const prisma = new PrismaClient();

/**
 * POST /api/stripe/create-checkout
 * Create Stripe checkout session
 */
router.post("/create-checkout", async (req, res) => {
  try {
    const { plan, userId, email } = req.body;

    // Validate input
    if (!plan || !userId || !email) {
      return res.status(400).json({ error: "Missing required data (plan, userId, email)" });
    }

    // Get price ID from environment (auto-detects LIVE/TEST)
    const prices = getStripePrices();
    const priceId = plan === "coach" ? prices.coach : prices.client;

    if (!priceId) {
      return res.status(500).json({ error: `Stripe price ID not configured for plan: ${plan}` });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      customer_email: email,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
        plan,
      },
    });

    console.log(`✅ Stripe checkout session created for user ${userId} (${plan}): ${session.id}`);
    
    return res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({
      error: "Failed to create checkout session",
      details: error.message,
    });
  }
});

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;

    if (!sig) {
      console.error("⚠️ Webhook: Missing stripe-signature header");
      return res.status(400).send("Missing signature");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle event
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const plan = session.metadata?.plan;

          console.log(`✅ Payment successful for user ${userId} (${plan})`);

          // Update user subscription in database
          if (userId) {
            await prisma.user.update({
              where: { id: parseInt(userId) },
              data: {
                // You can add subscription fields to User model
                // subscriptionStatus: 'active',
                // subscriptionPlan: plan,
              },
            });
          }
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`🔄 Subscription updated: ${subscription.id}`);
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`❌ Subscription cancelled: ${subscription.id}`);
          break;
        }

        default:
          console.log(`ℹ️ Unhandled event type: ${event.type}`);
      }

      return res.json({ received: true });
    } catch (error: any) {
      console.error("⚠️ Webhook handler error:", error);
      return res.status(500).json({ error: "Webhook handler failed" });
    }
  }
);

/**
 * GET /api/stripe/config
 * Get Stripe configuration for frontend
 */
router.get("/config", (req, res) => {
  const prices = getStripePrices();
  
  res.json({
    publishableKey: getStripePublishableKey(),
    priceClient: prices.client,
    priceCoach: prices.coach,
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;

