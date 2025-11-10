import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageWrapper } from "@/components/PageWrapper";
import { Check, Crown, Zap, Users, Calendar, MessageSquare, AlertCircle, XCircle, Gift } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface SubscriptionInfo {
  id: string;
  plan: string;
  status: "active" | "canceled" | "expired" | "past_due";
  startDate: string;
  renewalDate?: string;
  endDate?: string;
  referralCode?: string;
  discount?: number;
}

export default function Subscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Get subscription status
  const { data: statusData, isLoading } = useQuery({
    queryKey: ["subscription-status", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user logged in");
      const res = await fetch(`/api/subscriptions/${user.id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch subscription");
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Cancel subscription
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("No user logged in");
      const res = await fetch(`/api/subscriptions/cancel/${user.id}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to cancel subscription");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-status", user?.id] });
      toast({
        title: "Abonnement annulé",
        description: "Ton abonnement a été annulé avec succès",
      });
    },
  });

  const subscription: SubscriptionInfo | null = statusData?.subscription || null;
  const hasActiveSubscription = statusData?.active || false;

  const getPlanInfo = (planId: string) => {
    const plans: Record<string, { name: string; price: number; features: string[] }> = {
      athlete: {
        name: "Athlète Indépendant",
        price: 19,
        features: [
          "Coach IA personnel illimité",
          "Création de programmes",
          "Plans nutrition personnalisés",
          "Suivi de progression",
          "Check-ins quotidiens",
        ],
      },
      client: {
        name: "Client Accompagné",
        price: 29,
        features: [
          "Tout du plan Athlète",
          "Coach humain dédié",
          "Programme personnalisé",
          "Communication directe",
          "Feedback en temps réel",
        ],
      },
      coach: {
        name: "Coach Professionnel",
        price: 49,
        features: [
          "Gestion illimitée de clients",
          "Création de programmes assistée IA",
          "Analytics coach avancés",
          "Tableau de bord professionnel",
          "Codes de parrainage",
        ],
      },
    };
    return plans[planId] || plans.athlete;
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Chargement...</p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="w-8 h-8" />
            Mon abonnement
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérer ton abonnement Synrgy
          </p>
        </div>

        {hasActiveSubscription && subscription ? (
          <>
            {/* Active Subscription */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{getPlanInfo(subscription.plan).name}</CardTitle>
                    <CardDescription>
                      Actif depuis le {new Date(subscription.startDate).toLocaleDateString("fr-FR")}
                      {subscription.renewalDate && (
                        <> · Renouvellement le {new Date(subscription.renewalDate).toLocaleDateString("fr-FR")}</>
                      )}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="default" 
                    className={subscription.status === "active" ? "bg-green-600" : subscription.status === "canceled" ? "bg-red-600" : "bg-orange-600"}
                  >
                    {subscription.status === "active" ? <Check className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {subscription.status === "active" ? "Actif" : subscription.status === "canceled" ? "Annulé" : "Expiré"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  {subscription.discount && subscription.discount > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-green-600">
                        {(getPlanInfo(subscription.plan).price * (1 - subscription.discount / 100)).toFixed(0)}€
                      </span>
                      <span className="text-sm line-through text-muted-foreground">
                        {getPlanInfo(subscription.plan).price}€
                      </span>
                      <Badge variant="default" className="bg-green-600">
                        -{subscription.discount}%
                      </Badge>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">
                      {getPlanInfo(subscription.plan).price}€
                    </span>
                  )}
                  <span className="text-muted-foreground">/mois</span>
                </div>

                {subscription.referralCode && (
                  <Alert>
                    <Gift className="h-4 w-4" />
                    <AlertDescription>
                      Code de parrainage utilisé : <strong>{subscription.referralCode}</strong>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="pt-4">
                  <h4 className="font-semibold mb-3">Fonctionnalités incluses</h4>
                  <ul className="space-y-2">
                    {getPlanInfo(subscription.plan).features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/pricing")}
                    className="flex-1"
                  >
                    Changer de formule
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Es-tu sûr de vouloir annuler ton abonnement ?")) {
                        cancelMutation.mutate();
                      }
                    }}
                    disabled={cancelMutation.isPending}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {cancelMutation.isPending ? "Annulation..." : "Annuler l'abonnement"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* No Active Subscription */}
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Tu n'as pas d'abonnement actif. Souscris à une formule pour débloquer toutes les fonctionnalités Synrgy.
              </AlertDescription>
            </Alert>

            <Card>
              <CardContent className="py-12 text-center">
                <Crown className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Débloque tout le potentiel de Synrgy
                </h3>
                <p className="text-muted-foreground mb-6">
                  Choisis la formule adaptée à tes besoins
                </p>
                <Button
                  size="lg"
                  onClick={() => setLocation("/pricing")}
                >
                  Voir les formules
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Questions fréquentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Puis-je changer de formule ?</h4>
              <p className="text-sm text-muted-foreground">
                Oui ! Tu peux upgrader ou downgrader ton abonnement à tout moment depuis cette page.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Comment annuler mon abonnement ?</h4>
              <p className="text-sm text-muted-foreground">
                Tu peux annuler ton abonnement à tout moment depuis cette page. L'annulation prend effet immédiatement.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Les paiements sont-ils sécurisés ?</h4>
              <p className="text-sm text-muted-foreground">
                Absolument. En mode test, les paiements sont simulés. En mode production, nous utilisons Stripe pour des paiements 100% sécurisés.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
