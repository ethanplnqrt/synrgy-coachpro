/**
 * 💳 CHECKOUT PAGE
 * 
 * Redirect to Stripe Checkout
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const plan = searchParams.get('plan');

  useEffect(() => {
    if (!plan) {
      setError("Plan non spécifié");
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    if (!user) {
      // Not logged in → redirect to signup
      navigate(`/signup?role=${plan}`);
      return;
    }

    // User is logged in → create checkout session
    handleCheckout();
  }, [plan, user]);

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          plan,
          userId: user?.id,
          email: user?.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Erreur de redirection vers Stripe");
      setTimeout(() => navigate('/'), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-[#0D1117]">
      <div className="text-center p-8 rounded-2xl bg-[#121418]/60 backdrop-blur-md border border-white/10">
        {error ? (
          <>
            <div className="text-red-400 text-2xl mb-4">⚠️ Erreur</div>
            <p className="text-gray-400">{error}</p>
            <p className="text-sm text-gray-500 mt-4">Redirection...</p>
          </>
        ) : (
          <>
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
            <h1 className="text-3xl font-semibold mb-4">Redirection vers Stripe...</h1>
            <p className="text-gray-400">
              Vous allez être redirigé vers notre page de paiement sécurisée.
            </p>
            <p className="text-sm text-gray-500 mt-4">Veuillez patienter ⏳</p>
          </>
        )}
      </div>
    </div>
  );
}

