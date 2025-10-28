import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Check, Star, Zap, Crown, CreditCard, Shield, Clock } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

export default function PricingPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: "athlete",
      name: "Athlète",
      price: 19,
      period: "mois",
      features: [
        "Programme d'entraînement IA",
        "Plan nutritionnel personnalisé",
        "Suivi des progrès",
        "Chat avec Coach IA",
        "Scan photo/QR",
        "Défis et gamification",
        "Mode hors ligne"
      ],
      icon: <Zap className="w-6 h-6" />,
      color: "text-blue-500"
    },
    {
      id: "coach",
      name: "Coach Pro",
      price: 49,
      period: "mois",
      features: [
        "Tout d'Athlète",
        "Gestion illimitée de clients",
        "Analytics avancés",
        "Marque blanche",
        "Support prioritaire",
        "API personnalisée",
        "Formations exclusives"
      ],
      popular: true,
      icon: <Crown className="w-6 h-6" />,
      color: "text-purple-500"
    },
    {
      id: "trial",
      name: "Essai 7 jours",
      price: 0,
      period: "gratuit",
      features: [
        "Accès complet",
        "Toutes les fonctionnalités",
        "Aucune carte requise",
        "Annulation facile",
        "Support inclus"
      ],
      icon: <Clock className="w-6 h-6" />,
      color: "text-green-500"
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'abonnement');
      }

      const result = await response.json();
      
      if (result.success) {
        setLocation('/coach/dashboard');
      } else {
        setError(result.error || 'Erreur lors de l\'abonnement');
      }
    } catch (err) {
      setError('Erreur lors de l\'abonnement');
    } finally {
      setIsLoading(false);
    }
  };

  const mockSubscribe = (planId: string) => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      setLocation('/coach/dashboard');
    }, 2000);
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            💳 Tarifs et Abonnements
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto mb-4 ${plan.color}`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4">
                  {config?.testMode ? (
                    <Button 
                      onClick={() => mockSubscribe(plan.id)}
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Essayer (Démo)
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleSubscribe(plan.id)}
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          S'abonner
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Garantie satisfait ou remboursé</h3>
                <p className="text-sm text-muted-foreground">
                  Annulez votre abonnement à tout moment dans les 30 premiers jours 
                  et récupérez votre argent, sans questions posées.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2 text-destructive">Erreur</h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation('/coach/dashboard')} variant="outline">
            Retour au dashboard
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

