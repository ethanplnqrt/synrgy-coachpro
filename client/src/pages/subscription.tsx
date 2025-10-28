import { useStripe, Elements, PaymentElement, useElements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Check, Crown, Zap, Users, Calendar, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../../shared/schema";
import { useAppConfig } from "../lib/config";

// Stripe integration - using Replit's Stripe blueprint
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/coach/dashboard",
      },
    });

    if (error) {
      toast({
        title: "Paiement échoué",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Paiement réussi",
        description: "Vous êtes maintenant abonné à CoachPro !",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || !elements}
        className="w-full"
        size="lg"
        data-testid="button-confirm-payment"
      >
        <Crown className="w-4 h-4 mr-2" />
        Confirmer le paiement
      </Button>
    </form>
  );
};

function SubscriptionContent() {
  const { data: config } = useAppConfig();
  const [clientSecret, setClientSecret] = useState("");
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      // In TEST_MODE, skip API and set demo secret
      if (config?.testMode) {
        if (mounted) setClientSecret("demo_secret_key");
      } else {
        try {
          const res = await apiRequest("POST", "/api/get-or-create-subscription", {});
          const data = await res.json();
          if (mounted) setClientSecret(data.clientSecret || "");
        } catch (error) {
          console.error("Error creating subscription:", error);
        }
      }
      // Load Stripe instance
      try {
        const s = await loadStripe(stripePublicKey);
        if (mounted) setStripeInstance(s);
      } catch (_e) {
        if (mounted) setStripeInstance(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const features = [
    {
      icon: Users,
      title: "Clients illimités",
      description: "Gérez autant de clients que vous le souhaitez",
    },
    {
      icon: Calendar,
      title: "Programmes illimités",
      description: "Créez des programmes personnalisés sans limites",
    },
    {
      icon: MessageSquare,
      title: "Coach IA avancé",
      description: "Accès complet à l'assistant IA pour vos clients",
    },
    {
      icon: Zap,
      title: "Analyses avancées",
      description: "Statistiques détaillées de progression",
    },
  ];

  if (user?.isPro) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Vous êtes déjà abonné Pro</h2>
            <p className="text-muted-foreground mb-4">
              Profitez de toutes les fonctionnalités premium de CoachPro
            </p>
            <Badge variant="default" className="text-sm">
              Abonnement actif
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="font-medium">Chargement de Stripe...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
          Passez à CoachPro
        </h1>
        <p className="text-muted-foreground">
          Débloquez toutes les fonctionnalités et développez votre activité de coaching
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Features */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Fonctionnalités Pro
              </CardTitle>
              <CardDescription>
                Tout ce dont vous avez besoin pour gérer votre activité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6 bg-gradient-to-r from-green-500/10 to-transparent border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 text-green-600 dark:text-green-400 p-2 rounded-full">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Garantie satisfait ou remboursé</p>
                  <p className="text-xs text-muted-foreground">
                    Annulez à tout moment, remboursement sous 30 jours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Abonnement mensuel</CardTitle>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-bold">29€</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              {stripeInstance ? (
                <Elements stripe={stripeInstance} options={{ clientSecret }}>
                  <SubscribeForm />
                </Elements>
              ) : (
                <div className="text-center text-sm text-muted-foreground">Chargement de Stripe...</div>
              )}
              <p className="text-xs text-muted-foreground text-center mt-4">
                Paiement sécurisé par Stripe. Vos données sont protégées.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Subscription() {
  return <SubscriptionContent />;
}
