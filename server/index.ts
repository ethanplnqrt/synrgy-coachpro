// Load environment variables FIRST
import dotenv from "dotenv";
import path from "path";

// Force load .env from project root
const envPath = path.resolve(process.cwd(), ".env");
const result = dotenv.config({ path: envPath, override: true });

// Verify .env loaded
if (result.error) {
  console.warn(`⚠️  Erreur lors du chargement du .env: ${result.error.message}`);
} else {
  console.log(`✅ Fichier .env chargé depuis : ${envPath}\n`);
}

// Debug: Check Stripe keys immediately after dotenv
console.log("🔍 Vérification immédiate des variables Stripe dans process.env...");
const stripeVarsCheck = {
  "Public Key": process.env.STRIPE_PUBLIC_KEY,
  "Secret Key": process.env.STRIPE_SECRET_KEY,
  "Webhook Secret": process.env.STRIPE_WEBHOOK_SECRET,
  "Coach Price": process.env.STRIPE_PRICE_COACH,
  "Client Price": process.env.STRIPE_PRICE_CLIENT,
  "Athlete Price": process.env.STRIPE_PRICE_ATHLETE,
};

Object.entries(stripeVarsCheck).forEach(([key, value]) => {
  console.log(`   ${key.padEnd(20, ".")}: ${value ? "✅ LOADED" : "❌ MISSING"}`);
});
console.log("");

// NOW import other modules (they will use the loaded env vars)
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import authRouter from "./auth/authRoutes.js";
import chatRouter from "./routes/chat.js";
import nutritionRouter from "./routes/nutrition.js";
import goalsRouter from "./routes/goals.js";
import paymentsRouter from "./routes/payments.js";
import subscriptionsRouter from "./routes/subscriptions.js";
import referralsRouter from "./routes/referrals.js";
import plansRouter from "./routes/plans.js";
import checkinsRouter from "./routes/checkins.js";
import codexRouter from "./routes/codex.js";
import { loadDB } from "./utils/db.js";
import { verifyReferralSystem } from "./services/referralService.js";
import { initializeStripe, verifyStripeConfig } from "./utils/stripe.js";

const app = express();

// Ensure database exists on startup
loadDB();

// Initialize Stripe with loaded env vars
initializeStripe();

// Verify Stripe configuration (after dotenv loaded)
verifyStripeConfig();

// Verify referral system on startup
verifyReferralSystem().catch(console.error);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("*", cors({ origin: "http://localhost:5173", credentials: true }));
// Webhook route needs raw body for Stripe signature verification
app.use("/api/payments/webhook", bodyParser.raw({ type: "application/json" }));

app.use(bodyParser.json());
app.use(cookieParser());

// API routes (priority)
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/referrals", referralsRouter);
app.use("/api/plans", plansRouter);
app.use("/api/checkins", checkinsRouter);
app.use("/api/codex", codexRouter);

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", mode: "production", version: "v1.0" })
);

// Serve React build from /dist
const __dirname = process.cwd();
const distDir = path.join(__dirname, "dist");

app.use(express.static(distDir));

// Fallback to index.html for all non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Synrgy live on http://localhost:${PORT}`);
});