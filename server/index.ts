// Load environment variables FIRST (development only)
import path from "path";

// Only load .env in development (Render injects variables directly in production)
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dotenv = require("dotenv");
  const envPath = path.resolve(process.cwd(), ".env");
  const result = dotenv.config({ path: envPath, override: false });
  
  if (result.error) {
    console.warn(`⚠️  Erreur lors du chargement du .env: ${result.error.message}`);
  } else {
    console.log(`✅ Fichier .env chargé depuis : ${envPath} (development mode)\n`);
  }
} else {
  console.log(`🚀 Production mode: Using Render environment variables\n`);
}

// Debug: Check Stripe keys immediately after environment setup
console.log("🔍 Vérification immédiate des variables Stripe dans process.env...");

// Flexible fallback for Stripe price variables (support both naming conventions)
const STRIPE_COACH_PRICE = process.env.STRIPE_COACH_PRICE || process.env.STRIPE_PRICE_COACH;
const STRIPE_CLIENT_PRICE = process.env.STRIPE_CLIENT_PRICE || process.env.STRIPE_PRICE_CLIENT;
const STRIPE_ATHLETE_PRICE = process.env.STRIPE_ATHLETE_PRICE || process.env.STRIPE_PRICE_ATHLETE;

const stripeVarsCheck = {
  "Public Key": process.env.STRIPE_PUBLIC_KEY,
  "Secret Key": process.env.STRIPE_SECRET_KEY,
  "Webhook Secret": process.env.STRIPE_WEBHOOK_SECRET,
  "Coach Price": STRIPE_COACH_PRICE,
  "Client Price": STRIPE_CLIENT_PRICE,
  "Athlete Price": STRIPE_ATHLETE_PRICE,
};

Object.entries(stripeVarsCheck).forEach(([key, value]) => {
  console.log(`   ${key.padEnd(20, ".")}: ${value ? "✅ LOADED" : "❌ MISSING"}`);
});
console.log("");

// NOW import other modules (they will use the loaded env vars)
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Routes - Only import routes that exist
import authPrismaRouter from "./routes/auth.js"; // Prisma + JWT auth
import chatRouter from "./routes/chat.js";
// import nutritionRouter from "./routes/nutrition.js"; // Temporarily disabled for deployment
import goalsRouter from "./routes/goals.js";
import paymentsRouter from "./routes/payments.js";
import subscriptionsRouter from "./routes/subscriptions.js";
import referralsRouter from "./routes/referrals.js";
import plansRouter from "./routes/plans.js";
import checkinsRouter from "./routes/checkins.js";
import codexRouter from "./routes/codex.js";
import stripeRouter from "./routes/stripe.js";
// Services & Utils
import { PrismaClient } from "@prisma/client";
import { verifyReferralSystem } from "./services/referralService.js";
import { initializeStripe, verifyStripeConfig } from "./utils/stripe.js";
import { logStripeStatus } from "./services/stripeService.js";
import { corsConfig } from "./middleware/security.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter.js";

const app = express();
const prisma = new PrismaClient();

// Environment check
const isProduction = process.env.NODE_ENV === 'production';
console.log(`🚀 Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);

// Initialize Stripe with loaded env vars
initializeStripe();

// Verify Stripe configuration (after dotenv loaded)
verifyStripeConfig();

// Log Stripe status
logStripeStatus().catch(err => {
  console.error('⚠️  Stripe verification failed:', err.message);
});

// Connect to Prisma
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL via Prisma");
  } catch (err) {
    console.error("❌ Prisma connection failed:", err);
  }
})();

// Verify referral system on startup
verifyReferralSystem().catch(console.error);

// Security middleware
app.use(corsConfig);

// Rate limiting (disabled in development)
if (process.env.NODE_ENV === 'production') {
  app.use('/api/', apiLimiter);
  console.log("✅ Rate limiting enabled (production mode)");
} else {
  console.log("⚠️  Rate limiting disabled (development mode)");
}

// Stripe webhook (must be before body parser)
app.use("/api/stripe/webhook", stripeRouter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authLimiter, authPrismaRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/chat", chatRouter);
// app.use("/api/nutrition", nutritionRouter); // Temporarily disabled for deployment
app.use("/api/goals", goalsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/referrals", referralsRouter);
app.use("/api/plans", plansRouter);
app.use("/api/checkins", checkinsRouter);
app.use("/api/codex", codexRouter);

app.get("/api/health", (_req, res) =>
  res.json({ 
    ok: true,
    status: "ok", 
    mode: isProduction ? "production" : "development", 
    version: process.env.npm_package_version || "4.4.4",
    timestamp: new Date().toISOString(),
  })
);

// Serve React build from /dist
const rootDir = path.resolve();
const distDir = path.join(rootDir, "dist");

app.use(express.static(distDir));

// Fallback to index.html for all non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Synrgy API running on port ${PORT}`);
});