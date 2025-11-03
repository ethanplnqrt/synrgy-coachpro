import express from "express";
import { authenticate, type AuthenticatedRequest } from "../auth/authMiddleware.js";
import {
  getPaymentMode,
  getUserSubscription,
  createSubscription,
  updateSubscriptionStatus,
  getReferralByCode,
  useReferralCode,
  createReferralCode,
  getCoachReferrals,
  type Subscription,
} from "../utils/paymentStore.js";
import { stripe, isStripeConfigured, STRIPE_PRICES, STRIPE_WEBHOOK_SECRET } from "../utils/stripe.js";
import type Stripe from "stripe";
import { updateSubscription as updateUserSubscription } from "../services/subscriptionService.js";

const router = express.Router();

// Plans available
const PLANS = [
  {
    id: "athlete",
    name: "Athlète Indépendant",
    price: 19,
    priceId: "price_athlete_monthly", // Stripe price ID (if live)
    interval: "month",
    description: "Coach IA personnel, programmes, nutrition",
    role: "athlete",
  },
  {
    id: "client",
    name: "Client Accompagné",
    price: 29,
    priceId: "price_client_monthly",
    interval: "month",
    description: "Suivi par un coach professionnel",
    role: "client",
  },
  {
    id: "coach",
    name: "Coach Professionnel",
    price: 49,
    priceId: "price_coach_monthly",
    interval: "month",
    description: "Gestion clients illimitée avec IA",
    role: "coach",
  },
];

// Get all plans
router.get("/plans", (_req, res) => {
  const mode = getPaymentMode();
  res.json({
    success: true,
    mode,
    plans: PLANS,
  });
});

// Get payment mode
router.get("/mode", (_req, res) => {
  const mode = getPaymentMode();
  res.json({
    success: true,
    mode,
    message: mode === "mock" 
      ? "Mode test activé - paiements simulés" 
      : "Stripe configuré - paiements réels",
  });
});

// Get user subscription status
router.get("/status", authenticate, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const subscription = getUserSubscription(user.id);

  res.json({
    success: true,
    subscription,
    hasActiveSubscription: !!subscription,
  });
});

// Create subscription (mock or Stripe)
router.post("/subscribe", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { planId, referralCode } = req.body;
  const mode = getPaymentMode();

  // Validate plan
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) {
    return res.status(400).json({
      success: false,
      error: "Invalid plan ID",
    });
  }

  // Check referral code
  let discount = 0;
  let referral = null;
  if (referralCode) {
    referral = getReferralByCode(referralCode);
    if (referral) {
      discount = referral.discount;
      useReferralCode(referralCode, user.id, user.fullName || user.email);
    }
  }

  if (mode === "mock") {
    // Mock mode: create subscription immediately
    const subscription = createSubscription({
      userId: user.id,
      planId: plan.id,
      status: "active",
      startDate: new Date().toISOString(),
      referralCode: referralCode || undefined,
      discount: discount || undefined,
    });

    return res.json({
      success: true,
      mode: "mock",
      subscription,
      message: `Abonnement ${plan.name} activé en mode test (${discount > 0 ? `${plan.price * (1 - discount / 100)}€` : `${plan.price}€`}/mois)`,
    });
  } else {
    // Stripe mode: return checkout URL
    // TODO: Implement Stripe Checkout Session
    return res.json({
      success: true,
      mode: "stripe",
      checkoutUrl: `/api/payments/stripe-checkout?planId=${planId}&referralCode=${referralCode || ""}`,
      message: "Redirection vers Stripe...",
    });
  }
});

// Cancel subscription
router.post("/cancel", authenticate, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const subscription = updateSubscriptionStatus(user.id, "canceled");

  if (!subscription) {
    return res.status(404).json({
      success: false,
      error: "No active subscription found",
    });
  }

  res.json({
    success: true,
    subscription,
    message: "Abonnement annulé",
  });
});

// ===== REFERRAL SYSTEM =====

// Get coach's referral codes
router.get("/referrals", authenticate, (req: AuthenticatedRequest, res) => {
  const user = req.user!;

  if (user.role !== "coach") {
    return res.status(403).json({
      success: false,
      error: "Only coaches can create referral codes",
    });
  }

  const referrals = getCoachReferrals(user.id);
  res.json({
    success: true,
    referrals,
  });
});

// Create referral code (coach only)
router.post("/referrals/create", authenticate, (req: AuthenticatedRequest, res) => {
  const user = req.user!;

  if (user.role !== "coach") {
    return res.status(403).json({
      success: false,
      error: "Only coaches can create referral codes",
    });
  }

  const referral = createReferralCode(user.id, user.fullName || user.email);
  res.json({
    success: true,
    referral,
  });
});

// Validate referral code
router.post("/referrals/validate", (_req, res) => {
  const { code } = _req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Referral code required",
    });
  }

  const referral = getReferralByCode(code);
  
  if (!referral) {
    return res.json({
      success: true,
      valid: false,
      message: "Code invalide",
    });
  }

  res.json({
    success: true,
    valid: true,
    discount: referral.discount,
    coachName: referral.coachName,
    message: `Code valide ! -${referral.discount}% offert par ${referral.coachName}`,
  });
});

// ===== STRIPE INTEGRATION =====

// Create Stripe Checkout Session
router.post("/checkout", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { plan, referralCode } = req.body;

  if (!isStripeConfigured() || !stripe) {
    return res.status(503).json({
      success: false,
      error: "Stripe not configured - use mock mode instead",
    });
  }

  // Validate plan
  const planData = PLANS.find(p => p.id === plan);
  if (!planData) {
    return res.status(400).json({
      success: false,
      error: "Invalid plan",
    });
  }

  // Explicit price mapping for better error handling
  const priceMap: Record<string, string> = {
    coach: process.env.STRIPE_PRICE_COACH || "",
    client: process.env.STRIPE_PRICE_CLIENT || "",
    athlete: process.env.STRIPE_PRICE_ATHLETE || "",
  };

  // Get Stripe price ID based on plan
  const priceId = priceMap[plan];
  
  if (!priceId || priceId.trim() === "") {
    console.error(`❌ [Stripe Checkout] Price ID missing for plan: ${plan}`);
    console.error(`   → STRIPE_PRICE_${plan.toUpperCase()} is not configured in .env`);
    console.error(`   → Run: npm run fix:stripe to auto-configure`);
    return res.status(400).json({
      success: false,
      error: `Stripe Price ID not configured for plan: ${plan}. Please contact support.`,
    });
  }

  console.log(`💳 Creating Stripe Checkout for plan: ${plan.toUpperCase()}`);
  console.log(`   → Price ID: ${priceId}`);
  console.log(`   → User: ${user.email}`);

  try {
    // Check referral discount
    let couponId: string | undefined;
    let referralDiscount: number | undefined;
    if (referralCode) {
      const referral = getReferralByCode(referralCode);
      if (referral) {
        referralDiscount = referral.discount;
        // Create or get coupon for this referral
        try {
          const coupon = await stripe.coupons.create({
            percent_off: referral.discount,
            duration: "forever",
            name: `Referral ${referral.code}`,
          });
          couponId = coupon.id;
        } catch (error) {
          console.error("Coupon creation error:", error);
        }
      }
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      discounts: couponId ? [{ coupon: couponId }] : undefined,
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/subscription/success`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/subscription/cancel`,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        planId: plan,
        referralCode: referralCode || "",
      },
    });

    console.log(`\n✅ Stripe Checkout session created successfully`);
    console.log(`   → Plan: ${plan.toUpperCase()}`);
    console.log(`   → Price ID: ${priceId}`);
    console.log(`   → Session ID: ${session.id}`);
    console.log(`   → User: ${user.email}`);
    if (referralCode && referralDiscount) {
      console.log(`   → Referral Code: ${referralCode} (-${referralDiscount}%)`);
    }
    console.log("");

    return res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create checkout session",
    });
  }
});

// Stripe Webhook
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!isStripeConfigured() || !stripe) {
    return res.status(503).send("Stripe not configured");
  }

  const signature = req.headers["stripe-signature"] as string;

  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    return res.status(400).send("Missing signature or webhook secret");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error("⚠️  Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  console.log(`🔔 Webhook Stripe reçu: ${event.type}`);

  // Handle events
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        const referralCode = session.metadata?.referralCode;
        const customerEmail = session.customer_email || session.customer_details?.email;

        if (!userId || !planId) {
          console.error("❌ Missing userId or planId in session metadata");
          break;
        }

        // Create subscription in local store
        const subscription = createSubscription({
          userId,
          planId,
          status: "active",
          startDate: new Date().toISOString(),
          stripeSubscriptionId: session.subscription as string,
          referralCode: referralCode || undefined,
          discount: session.total_details?.amount_discount ? 
            Math.round((session.total_details.amount_discount / (session.amount_total || 1)) * 100) : 
            undefined,
        });

        // Mark referral as used
        if (referralCode) {
          try {
            useReferralCode(referralCode, userId, customerEmail || userId);
            console.log(`📢 Code parrainage ${referralCode} utilisé par ${customerEmail}`);
          } catch (error) {
            console.error("Erreur lors de l'utilisation du code de parrainage:", error);
          }
        }

        console.log(`✅ Subscription activée pour ${customerEmail || userId} (plan: ${planId.toUpperCase()})`);
        console.log(`   → Subscription ID: ${subscription.id}`);
        console.log(`   → Stripe Sub ID: ${session.subscription}`);
        if (subscription.discount) {
          console.log(`   → Réduction: -${subscription.discount}%`);
        }

        // Update user subscription in unified service
        try {
          await updateUserSubscription(
            userId,
            customerEmail || userId,
            planId,
            "active",
            {
              stripeSubscriptionId: session.subscription as string,
              referralCode: referralCode || undefined,
              discount: subscription.discount,
            }
          );
        } catch (error) {
          console.error("Error updating subscription in service:", error);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const subscriptionId = typeof invoice.subscription === "string" 
          ? invoice.subscription 
          : invoice.subscription?.id;
        
        if (subscriptionId) {
          console.log(`✅ Paiement récurrent réussi : ${subscriptionId}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const customerEmail = subscription.metadata?.email || userId;

        if (!userId) {
          console.error("❌ Missing userId in subscription metadata");
          break;
        }

        const updatedSub = updateSubscriptionStatus(userId, "canceled");
        
        if (updatedSub) {
          console.log(`❌ Subscription annulée pour userId: ${userId}`);
          console.log(`   → Subscription ID: ${updatedSub.id}`);
          console.log(`   → Plan: ${updatedSub.planId.toUpperCase()}`);
          console.log(`   → Date fin: ${updatedSub.endDate}`);

          // Update user subscription in unified service
          try {
            await updateUserSubscription(
              userId,
              customerEmail || userId,
              updatedSub.planId,
              "canceled",
              {
                stripeSubscriptionId: updatedSub.stripeSubscriptionId,
              }
            );
          } catch (error) {
            console.error("Error updating subscription in service:", error);
          }
        } else {
          console.warn(`⚠️  Aucun abonnement actif trouvé pour userId: ${userId}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          console.warn("⚠️  Missing userId in subscription metadata (update event)");
          break;
        }

        const existing = getUserSubscription(userId);
        
        // If subscription becomes active and wasn't before
        if (subscription.status === "active" && existing && existing.status !== "active") {
          updateSubscriptionStatus(userId, "active");
          console.log(`✅ Subscription réactivée pour userId: ${userId}`);
          console.log(`   → Plan: ${existing.planId.toUpperCase()}`);
        }
        // If subscription becomes inactive
        else if (subscription.status !== "active" && existing && existing.status === "active") {
          updateSubscriptionStatus(userId, "canceled");
          console.log(`⚠️  Subscription désactivée (status: ${subscription.status}) pour userId: ${userId}`);
        }
        break;
      }

      default:
        console.log(`ℹ️  Événement non géré : ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    res.status(500).send(`Webhook Error: ${error.message}`);
  }
});

// Get payment status for a user
router.get("/status/:userId", authenticate, async (req: AuthenticatedRequest, res) => {
  const { userId } = req.params;
  const currentUser = req.user!;

  // Only allow users to check their own status (or coaches for their clients)
  if (currentUser.id !== userId && currentUser.role !== "coach") {
    return res.status(403).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const subscription = getUserSubscription(userId);

  if (!subscription) {
    return res.json({
      success: true,
      active: false,
      plan: null,
      lastPayment: null,
    });
  }

  // If Stripe subscription, get details from Stripe
  let lastPayment = subscription.startDate;
  
  if (isStripeConfigured() && stripe && subscription.stripeSubscriptionId) {
    try {
      const stripeSubscription: any = await stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId
      );
      
      if (stripeSubscription.current_period_start) {
        lastPayment = new Date(stripeSubscription.current_period_start * 1000).toISOString();
      }
    } catch (error) {
      console.error("Error fetching Stripe subscription:", error);
    }
  }

  return res.json({
    success: true,
    active: subscription.status === "active",
    plan: subscription.planId,
    lastPayment,
    discount: subscription.discount,
    referralCode: subscription.referralCode,
  });
});

export default router;


