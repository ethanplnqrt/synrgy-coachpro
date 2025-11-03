#!/usr/bin/env tsx

/**
 * Fix Stripe Price IDs in .env
 * 
 * Vérifie les Price IDs configurés et les corrige automatiquement
 * en interrogeant l'API Stripe
 */

import dotenv from "dotenv";
import { promises as fs } from "fs";
import { join } from "path";
import Stripe from "stripe";

// Load .env
const envPath = join(process.cwd(), ".env");
dotenv.config({ path: envPath });

interface PriceMapping {
  plan: string;
  priceId: string;
  productName: string;
  amount: number;
  currency: string;
  interval: string;
}

async function main() {
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║                                                                ║");
  console.log("║   🔧 CORRECTION DES STRIPE PRICE IDs                          ║");
  console.log("║                                                                ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  // 1. Vérifier la clé Stripe
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    console.error("❌ STRIPE_SECRET_KEY non trouvée dans .env");
    console.log("   → Exécuter ./setup-stripe-env.sh\n");
    process.exit(1);
  }

  console.log(`✅ Clé Stripe trouvée : ${stripeSecretKey.substring(0, 20)}...`);
  const isTestMode = stripeSecretKey.includes("_test_");
  console.log(`   Mode : ${isTestMode ? "TEST" : "PRODUCTION"}\n`);

  // 2. Initialiser Stripe
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-10-29.clover",
    typescript: true,
  });

  // 3. Lister tous les prices disponibles
  console.log("🔍 Récupération des Price IDs depuis Stripe...\n");
  
  try {
    const prices = await stripe.prices.list({
      limit: 100,
      active: true,
      expand: ["data.product"],
    });

    console.log(`   → ${prices.data.length} price(s) actif(s) trouvé(s)\n`);

    // 4. Mapper les prices par produit
    const priceMapping: PriceMapping[] = [];

    for (const price of prices.data) {
      const product = price.product as Stripe.Product;
      if (!product || typeof product === "string") continue;

      const productName = product.name.toLowerCase();
      const amount = price.unit_amount ? price.unit_amount / 100 : 0;

      let plan = "";
      if (productName.includes("coach") || productName.includes("pro") || amount === 49) {
        plan = "coach";
      } else if (productName.includes("client") || amount === 29) {
        plan = "client";
      } else if (productName.includes("athlete") || productName.includes("athlète") || amount === 19) {
        plan = "athlete";
      }

      if (plan && price.recurring?.interval === "month") {
        priceMapping.push({
          plan,
          priceId: price.id,
          productName: product.name,
          amount,
          currency: price.currency,
          interval: price.recurring.interval,
        });
      }
    }

    // Afficher les prices trouvés
    console.log("📋 Price IDs détectés dans Stripe :\n");
    priceMapping.forEach((mapping) => {
      console.log(`   ${mapping.plan.toUpperCase().padEnd(10)} → ${mapping.priceId}`);
      console.log(`      Product: ${mapping.productName}`);
      console.log(`      Prix: ${mapping.amount}€/${mapping.interval}\n`);
    });

    // 5. Vérifier les IDs actuels dans .env
    console.log("🔍 Vérification des IDs actuels dans .env...\n");
    
    const currentIds = {
      coach: process.env.STRIPE_PRICE_COACH,
      client: process.env.STRIPE_PRICE_CLIENT,
      athlete: process.env.STRIPE_PRICE_ATHLETE,
    };

    const issues: string[] = [];
    const updates: { [key: string]: string } = {};

    for (const [plan, currentId] of Object.entries(currentIds)) {
      const correctMapping = priceMapping.find((m) => m.plan === plan);
      
      if (!currentId) {
        console.log(`   ❌ STRIPE_PRICE_${plan.toUpperCase()} : MANQUANT`);
        issues.push(`STRIPE_PRICE_${plan.toUpperCase()} manquant`);
        if (correctMapping) {
          updates[`STRIPE_PRICE_${plan.toUpperCase()}`] = correctMapping.priceId;
        }
      } else if (correctMapping && currentId !== correctMapping.priceId) {
        console.log(`   ⚠️  STRIPE_PRICE_${plan.toUpperCase()} : INCORRECT`);
        console.log(`      Actuel : ${currentId}`);
        console.log(`      Correct: ${correctMapping.priceId}`);
        issues.push(`STRIPE_PRICE_${plan.toUpperCase()} incorrect`);
        updates[`STRIPE_PRICE_${plan.toUpperCase()}`] = correctMapping.priceId;
      } else if (!correctMapping) {
        console.log(`   ⚠️  STRIPE_PRICE_${plan.toUpperCase()} : Aucun price trouvé dans Stripe`);
        issues.push(`Aucun price ${plan} trouvé dans Stripe`);
      } else {
        console.log(`   ✅ STRIPE_PRICE_${plan.toUpperCase()} : OK (${correctMapping.amount}€)`);
      }
    }

    console.log("");

    // 6. Mettre à jour .env si nécessaire
    if (Object.keys(updates).length > 0) {
      console.log("🔧 Mise à jour du fichier .env...\n");

      let envContent = await fs.readFile(envPath, "utf-8");

      for (const [key, value] of Object.entries(updates)) {
        const regex = new RegExp(`^${key}=.*$`, "m");
        if (envContent.match(regex)) {
          envContent = envContent.replace(regex, `${key}=${value}`);
          console.log(`   ✅ ${key} mis à jour → ${value}`);
        } else {
          envContent += `\n${key}=${value}`;
          console.log(`   ✅ ${key} ajouté → ${value}`);
        }
      }

      await fs.writeFile(envPath, envContent, "utf-8");
      console.log("\n✅ Fichier .env mis à jour avec succès !\n");
    } else if (issues.length === 0) {
      console.log("✅ Tous les Price IDs sont corrects ! Aucune modification nécessaire.\n");
    } else {
      console.log("⚠️  Problèmes détectés mais aucune correction disponible.\n");
      console.log("Actions recommandées :");
      console.log("  1. Créer les produits manquants dans Stripe Dashboard");
      console.log("  2. Relancer ce script\n");
    }

    // 7. Résumé final
    console.log("╔════════════════════════════════════════════════════════════════╗");
    console.log("║                                                                ║");
    console.log(`║   ${Object.keys(updates).length > 0 ? "✅" : issues.length === 0 ? "✅" : "⚠️"} ${Object.keys(updates).length > 0 ? "Price IDs corrigés" : issues.length === 0 ? "Vérification OK" : "Action requise"}                                          ║`);
    console.log("║                                                                ║");
    console.log("╚════════════════════════════════════════════════════════════════╝\n");

    if (Object.keys(updates).length > 0) {
      console.log("🎯 Prochaine étape :");
      console.log("   → Redémarrer le serveur : npm run dev:server\n");
    } else if (issues.length > 0) {
      console.log("⚠️  Certains Price IDs sont manquants dans Stripe.");
      console.log("   → Créer les produits dans https://dashboard.stripe.com/test/products\n");
      process.exit(1);
    }

    process.exit(0);

  } catch (error: any) {
    console.error("\n❌ Erreur lors de la connexion à Stripe :");
    console.error(`   ${error.message}\n`);
    
    if (error.type === "StripeAuthenticationError") {
      console.log("💡 Solution :");
      console.log("   → Vérifier que STRIPE_SECRET_KEY est correcte dans .env");
      console.log("   → Récupérer la clé depuis https://dashboard.stripe.com/test/apikeys\n");
    }
    
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Erreur fatale :", error);
  process.exit(1);
});

