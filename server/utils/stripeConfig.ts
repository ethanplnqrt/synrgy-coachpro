/**
 * 💳 STRIPE CONFIGURATION UTILITY
 * 
 * Environment-based Stripe price resolution
 */

/**
 * Get Stripe price IDs based on environment
 * Supports both STRIPE_COACH_PRICE and STRIPE_PRICE_COACH naming conventions
 */
export function getStripePrices() {
  const isLive = process.env.NODE_ENV === 'production';
  
  return {
    client: isLive
      ? process.env.STRIPE_PRICE_CLIENT_LIVE || process.env.STRIPE_CLIENT_PRICE || process.env.STRIPE_PRICE_CLIENT
      : process.env.STRIPE_CLIENT_PRICE || process.env.STRIPE_PRICE_CLIENT,
    coach: isLive
      ? process.env.STRIPE_PRICE_COACH_LIVE || process.env.STRIPE_COACH_PRICE || process.env.STRIPE_PRICE_COACH
      : process.env.STRIPE_COACH_PRICE || process.env.STRIPE_PRICE_COACH,
  };
}

/**
 * Get Stripe publishable key based on environment
 */
export function getStripePublishableKey() {
  const isLive = process.env.NODE_ENV === 'production';
  
  return isLive
    ? process.env.STRIPE_PUBLIC_KEY_LIVE || process.env.STRIPE_PUBLIC_KEY
    : process.env.STRIPE_PUBLIC_KEY;
}

/**
 * Get Stripe secret key based on environment
 */
export function getStripeSecretKey() {
  const isLive = process.env.NODE_ENV === 'production';
  
  return isLive
    ? process.env.STRIPE_SECRET_KEY_LIVE || process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY;
}

/**
 * Validate Stripe configuration
 */
export function validateStripeConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const prices = getStripePrices();
  
  if (!getStripeSecretKey()) {
    errors.push('Missing STRIPE_SECRET_KEY');
  }
  
  if (!getStripePublishableKey()) {
    errors.push('Missing STRIPE_PUBLIC_KEY');
  }
  
  if (!prices.client) {
    errors.push('Missing STRIPE_PRICE_CLIENT');
  }
  
  if (!prices.coach) {
    errors.push('Missing STRIPE_PRICE_COACH');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

