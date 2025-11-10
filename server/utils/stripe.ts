import Stripe from "stripe";

// Stripe instance (will be initialized after dotenv)
let stripeInstance: Stripe | null = null;

// Initialize Stripe - MUST be called after dotenv.config()
export function initializeStripe(): Stripe | null {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
  
  if (!stripeSecretKey) {
    return null;
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: "2025-10-29.clover",
      typescript: true,
    });
  }

  return stripeInstance;
}

// Get Stripe instance
export const stripe = new Proxy({} as Stripe | null, {
  get(target, prop) {
    if (!stripeInstance) {
      stripeInstance = initializeStripe();
    }
    return stripeInstance ? (stripeInstance as any)[prop] : null;
  }
}) as Stripe | null;

// Check if Stripe is configured
export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.trim() !== "");
}

// Price IDs from environment (3 formules)
export const STRIPE_PRICES = {
  coach: process.env.STRIPE_PRICE_COACH || process.env.STRIPE_PRICE_PRO || "",
  client: process.env.STRIPE_PRICE_CLIENT || process.env.STRIPE_PRICE_BASIC || "",
  athlete: process.env.STRIPE_PRICE_ATHLETE || process.env.STRIPE_PRICE_BASIC || "",
};

// Public key (for frontend if needed)
export const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY || "";

// Webhook secret
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Verify Stripe configuration - to be called AFTER dotenv.config()
export function verifyStripeConfig() {
  console.log("\n🔐 Vérification de la configuration Stripe...\n");

  const checks = {
    "Public Key": !!process.env.STRIPE_PUBLIC_KEY,
    "Secret Key": !!process.env.STRIPE_SECRET_KEY,
    "Webhook Secret": !!process.env.STRIPE_WEBHOOK_SECRET,
    "Coach Price": !!process.env.STRIPE_PRICE_COACH,
    "Client Price": !!process.env.STRIPE_PRICE_CLIENT,
    "Athlete Price": !!process.env.STRIPE_PRICE_ATHLETE,
  };

  let allConfigured = true;
  const missing: string[] = [];

  console.log("✅ Clés Stripe détectées :");
  Object.entries(checks).forEach(([key, value]) => {
    if (value) {
      console.log(`   • ${key.padEnd(20, ".")} OK`);
    } else {
      console.log(`   ✗ ${key.padEnd(20, ".")} MANQUANT`);
      allConfigured = false;
      missing.push(key);
    }
  });

  console.log("");

  if (allConfigured && stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY || "";
    const isTestMode = secretKey.includes("_test_");
    console.log(`✅ Stripe connecté (mode ${isTestMode ? "test" : "production"})`);
    console.log("✅ Webhook actif");
  } else if (!stripe) {
    console.log("ℹ️  Stripe en mode mock (clé secrète non configurée)");
    console.log("   → Les paiements seront simulés localement");
  } else {
    console.log("⚠️  Configuration Stripe incomplète");
    missing.forEach(key => {
      const envVar = key.toUpperCase().replace(/ /g, "_");
      console.log(`   → ${key}: Ajouter STRIPE_${envVar} dans .env`);
    });
    console.log("\n   Connecte-toi à https://dashboard.stripe.com/test/products");
  }

  console.log("");
}

