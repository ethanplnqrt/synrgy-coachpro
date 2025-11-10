import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Zap, Users, Brain, ArrowLeft, Info, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [referralDiscount, setReferralDiscount] = useState<number>(0);
  const [validatingCode, setValidatingCode] = useState(false);

  // Get payment mode
  const { data: modeData } = useQuery({
    queryKey: ["payment-mode"],
    queryFn: async () => {
      const res = await fetch("/api/payments/mode");
      return res.json();
    },
  });

  const paymentMode = modeData?.mode || "mock";

  // Validate referral code
  const validateReferral = async () => {
    if (!referralCode.trim()) return;
    
    setValidatingCode(true);
    try {
      const res = await fetch("/api/referrals/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: referralCode }),
      });
      const data = await res.json();

      if (data.valid) {
        setReferralDiscount(data.discount);
        toast({
          title: "Code valide !",
          description: data.message,
        });
      } else {
        setReferralDiscount(0);
        toast({
          title: "Code invalide",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error validating referral:", error);
    } finally {
      setValidatingCode(false);
    }
  };

  // Subscribe to plan
  const handleSubscribe = async (planId: string) => {
    if (!user) {
      setLocation("/login");
      return;
    }

    // Choose endpoint based on payment mode
    const endpoint = paymentMode === "stripe" 
      ? "/api/payments/checkout" 
      : "/api/payments/subscribe";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          plan: planId, // Stripe uses "plan", mock uses "planId"
          planId,       // Include both for compatibility
          referralCode: referralCode.trim() || undefined 
        }),
      });
      
      const data = await res.json();

      if (data.success) {
        // Mock mode: immediate activation
        if (paymentMode === "mock" || data.mode === "mock") {
          toast({
            title: "Abonnement activé !",
            description: data.message || "Votre abonnement est maintenant actif",
          });
          // Redirect to dashboard
          const dashboardPath = 
            planId === "coach" ? "/coach/dashboard" :
            planId === "client" ? "/client/dashboard" :
            "/athlete/dashboard";
          setTimeout(() => setLocation(dashboardPath), 1000);
        } 
        // Stripe mode: redirect to checkout
        else if (data.url) {
          toast({
            title: "Redirection vers le paiement...",
            description: "Vous allez être redirigé vers Stripe",
          });
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        }
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Impossible de créer l'abonnement",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion au serveur",
        variant: "destructive",
      });
    }
  };

  const plans = [
    {
      id: "athlete",
      name: "Athlète Indépendant",
      role: "athlete",
      price: 19,
      period: "/mois",
      description: "Pour les sportifs autonomes qui veulent progresser avec l'IA",
      badge: "Le plus populaire",
      badgeVariant: "default" as const,
      gradient: "from-blue-500 to-cyan-500",
      icon: Brain,
      features: [
        "Coach IA personnel illimité",
        "Création de programmes d'entraînement",
        "Plans nutrition personnalisés",
        "Suivi de progression",
        "Historique complet",
        "Analytics de performance",
        "Support par email",
      ],
    },
    {
      id: "client",
      name: "Client Accompagné",
      role: "client",
      price: 29,
      period: "/mois",
      description: "Pour être suivi par un coach professionnel",
      badge: "Recommandé",
      badgeVariant: "secondary" as const,
      gradient: "from-green-500 to-emerald-500",
      icon: Users,
      features: [
        "Tout du plan Athlète",
        "Coach humain dédié",
        "Programme personnalisé par coach",
        "Communication directe avec coach",
        "Feedback en temps réel",
        "Ajustements professionnels",
        "Accompagnement individualisé",
        "Suivi rapproché",
      ],
    },
    {
      id: "coach",
      name: "Coach Professionnel",
      role: "coach",
      price: 49,
      period: "/mois",
      description: "Pour les coachs qui veulent gérer leurs clients avec l'IA",
      badge: "Pro",
      badgeVariant: "default" as const,
      gradient: "from-orange-500 to-red-500",
      icon: Zap,
      features: [
        "Tout du plan Client",
        "Gestion illimitée de clients",
        "Création de programmes assistée IA",
        "Analytics coach avancés",
        "Tableau de bord professionnel",
        "Invitations clients",
        "Templates de programmes",
        "Support prioritaire",
        "API d'intégration",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Choisis ta formule
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Que tu sois athlète solo, client d'un coach ou coach professionnel,
              trouve la formule adaptée à tes besoins.
            </p>

            {/* Payment mode indicator */}
            <Alert className="mt-8 max-w-2xl mx-auto border-primary/20">
              {paymentMode === "mock" ? (
                <>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Mode test activé</strong> - Les paiements sont simulés. 
                    Aucune carte bancaire requise. Abonnement activé immédiatement.
                  </AlertDescription>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Paiement sécurisé via Stripe</strong> - Vous serez redirigé vers notre 
                    page de paiement sécurisée. Vos données bancaires sont protégées.
                  </AlertDescription>
                </>
              )}
            </Alert>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="relative h-full hover:shadow-xl transition-shadow border-2">
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant={plan.badgeVariant} className="px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pt-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {plan.description}
                  </CardDescription>

                  <div className="mb-6">
                    {referralDiscount > 0 && selectedPlan === plan.id ? (
                      <div>
                        <div className="text-sm line-through text-muted-foreground">
                          {plan.price}€{plan.period}
                        </div>
                        <div>
                          <span className="text-5xl font-bold text-green-600">
                            {(plan.price * (1 - referralDiscount / 100)).toFixed(0)}€
                          </span>
                          <span className="text-muted-foreground text-lg">{plan.period}</span>
                          <Badge variant="default" className="ml-2 bg-green-600">
                            -{referralDiscount}%
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="text-5xl font-bold">{plan.price}€</span>
                        <span className="text-muted-foreground text-lg">{plan.period}</span>
                      </>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Referral code input (only for selected plan) */}
                  {selectedPlan === plan.id && (
                    <div className="mb-4 space-y-2">
                      <Label htmlFor={`referral-${plan.id}`}>Code de parrainage (optionnel)</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`referral-${plan.id}`}
                          placeholder="SYNRGY-XXX"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                          disabled={validatingCode}
                        />
                        <Button
                          variant="outline"
                          onClick={validateReferral}
                          disabled={validatingCode || !referralCode.trim()}
                        >
                          {validatingCode ? "..." : "Valider"}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      if (selectedPlan === plan.id) {
                        handleSubscribe(plan.id);
                      } else {
                        setSelectedPlan(plan.id);
                        // Reset referral code when changing plan
                        setReferralCode("");
                        setReferralDiscount(0);
                      }
                    }}
                  >
                    {selectedPlan === plan.id ? (
                      paymentMode === "stripe" ? "Payer avec Stripe" : "S'abonner maintenant"
                    ) : (
                      "Choisir cette formule"
                    )}
                  </Button>
                  
                  {selectedPlan === plan.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        setSelectedPlan(null);
                        setReferralCode("");
                        setReferralDiscount(0);
                      }}
                    >
                      Annuler
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-20"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Questions fréquentes
          </h2>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quelle est la différence entre les rôles ?</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-2"><strong>Athlète :</strong> Tu es autonome avec l'IA comme coach virtuel.</p>
                <p className="mb-2"><strong>Client :</strong> Tu es suivi par un coach humain qui crée tes programmes.</p>
                <p><strong>Coach :</strong> Tu gères plusieurs clients avec l'aide de l'IA.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je changer de formule plus tard ?</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Oui ! Tu peux upgrader ou downgrader ton abonnement à tout moment depuis tes paramètres.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">L'IA remplace-t-elle un vrai coach ?</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Non. L'IA est un assistant intelligent pour les athlètes solo ou un outil pour les coachs.
                Pour un suivi humain personnalisé, choisis la formule "Client accompagné".
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mes données sont-elles sécurisées ?</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Absolument. Authentification JWT, cookies httpOnly, isolation des données par utilisateur,
                et mots de passe cryptés avec bcrypt.
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h3 className="text-3xl font-bold mb-4">
            Prêt à commencer ton parcours ?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Crée ton compte en 30 secondes
          </p>
          <Button
            size="lg"
            className="text-lg px-12 py-6"
            onClick={() => setLocation("/login")}
          >
            S'inscrire gratuitement
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
