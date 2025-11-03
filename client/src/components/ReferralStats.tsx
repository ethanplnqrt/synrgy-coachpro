import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Users, TrendingUp, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ReferralStats {
  totalClients: number;
  totalCommissions: number;
  totalSavings: number;
}

interface ReferralData {
  code: string;
  stats: ReferralStats;
  referrals: Array<{
    code: string;
    discount: number;
    commission: number;
    usageCount: number;
    isActive: boolean;
    createdAt: string;
  }>;
}

export function ReferralStats() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery<{ success: boolean; data?: ReferralData }>({
    queryKey: ["referral-stats"],
    queryFn: async () => {
      const res = await fetch("/api/referrals/my", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch referral stats");
      return res.json();
    },
  });

  const referralData = data?.data;

  const copyCode = () => {
    if (referralData?.code) {
      navigator.clipboard.writeText(referralData.code);
      setCopied(true);
      toast({
        title: "Code copié !",
        description: "Le code de parrainage a été copié dans le presse-papiers",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  if (!referralData) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Code de parrainage */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Code de Parrainage
          </CardTitle>
          <CardDescription>
            Partagez ce code avec vos clients pour leur offrir -20% sur leur abonnement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-background rounded-lg border-2 border-primary/30 px-4 py-3">
              <p className="text-2xl font-bold text-primary font-mono tracking-wider">
                {referralData.code}
              </p>
            </div>
            <Button
              onClick={copyCode}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier
                </>
              )}
            </Button>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">-20%</Badge>
              <span>Réduction client</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-600">+10%</Badge>
              <span>Commission coach</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Clients Référés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{referralData.stats.totalClients}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {referralData.stats.totalClients === 0
                ? "Aucun client référé"
                : referralData.stats.totalClients === 1
                ? "1 client actif"
                : `${referralData.stats.totalClients} clients actifs`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Commissions Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {referralData.stats.totalCommissions.toFixed(2)}€
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Cumulées depuis le début
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Économies Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {referralData.stats.totalSavings.toFixed(2)}€
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Économisés par vos clients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comment ça marche */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comment ça marche ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <p className="font-medium">Partagez votre code</p>
              <p className="text-muted-foreground">Envoyez votre code SYNRGY-XXXX à vos clients potentiels</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <p className="font-medium">Ils s'abonnent avec -20%</p>
              <p className="text-muted-foreground">Votre client entre le code lors du paiement et obtient 20% de réduction</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <p className="font-medium">Vous recevez 10% de commission</p>
              <p className="text-muted-foreground">Pour chaque paiement, vous recevez 10% du montant (ou 1 mois gratuit après 10 clients)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

