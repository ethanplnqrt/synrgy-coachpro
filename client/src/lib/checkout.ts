/**
 * 💳 CHECKOUT UTILITIES
 * 
 * Stripe checkout flow
 */

import { loadStripe } from '@stripe/stripe-js';

let stripePromise: ReturnType<typeof loadStripe> | null = null;

/**
 * Get or initialize Stripe instance
 */
async function getStripe() {
  if (!stripePromise) {
    // Fetch public key from backend
    try {
      const res = await fetch('/api/stripe/config');
      const { publicKey } = await res.json();
      stripePromise = loadStripe(publicKey);
    } catch (error) {
      console.error('Failed to load Stripe config:', error);
      throw new Error('Stripe configuration unavailable');
    }
  }
  return stripePromise;
}

/**
 * Start checkout flow for a plan
 */
export async function startCheckout(plan: 'client' | 'coach'): Promise<void> {
  try {
    // Check if user is logged in
    const token = document.cookie
      .split(';')
      .find((c) => c.trim().startsWith('synrgy_token='));

    if (!token) {
      // Not logged in → redirect to signup
      window.location.href = `/signup?role=${plan}`;
      return;
    }

    // Get current user
    const userRes = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    if (!userRes.ok) {
      // Auth failed → redirect to login
      window.location.href = `/login?redirect=/checkout&plan=${plan}`;
      return;
    }

    const { user } = await userRes.json();

    // Create checkout session
    const checkoutRes = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        plan,
        userId: user.id,
        email: user.email,
      }),
    });

    if (!checkoutRes.ok) {
      const error = await checkoutRes.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const { sessionId } = await checkoutRes.json();

    // Redirect to Stripe Checkout
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('Checkout error:', error);
    alert(`Erreur: ${error.message}`);
  }
}

