import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function ClientReferralInfo() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
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

  if (isLoading || !data?.subscription || !data.subscription.referralCode) {
    return null;
  }

  const discount = data.subscription.discount || 0;
  const referralCode = data.subscription.referralCode;

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Gift className="w-5 h-5" />
          Réduction Active
        </CardTitle>
        <CardDescription>
          Vous bénéficiez d'une réduction grâce au code de parrainage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="bg-green-600 text-lg px-3 py-1">
              -{discount}%
            </Badge>
            <div className="flex-1">
              <p className="font-semibold text-green-900">
                Économies sur votre abonnement
              </p>
              <p className="text-sm text-green-700">
                Code utilisé : <span className="font-mono font-bold">{referralCode}</span>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-4 p-3 bg-white/60 rounded-lg border border-green-200">
            <Sparkles className="w-4 h-4 text-green-600 mt-0.5" />
            <p className="text-xs text-green-700">
              Cette réduction est appliquée automatiquement à chaque renouvellement de votre abonnement.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

