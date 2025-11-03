import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Copy, Check, Gift, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";

interface Referral {
  id: string;
  code: string;
  coachId: string;
  coachName: string;
  createdAt: string;
  usedBy: Array<{
    userId: string;
    userName: string;
    usedAt: string;
  }>;
  discount: number;
}

export default function CoachReferrals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  // Get referrals
  const { data: referralsData, isLoading } = useQuery({
    queryKey: ["referrals"],
    queryFn: async () => {
      const res = await fetch("/api/payments/referrals", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch referrals");
      return res.json();
    },
  });

  // Create referral code
  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/payments/referrals/create", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create referral");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      toast({
        title: "Code créé !",
        description: "Ton code de parrainage est prêt à être partagé",
      });
    },
  });

  const referrals: Referral[] = referralsData?.referrals || [];
  const mainReferral = referrals[0]; // Coaches have one main referral code

  const copyCode = () => {
    if (mainReferral) {
      navigator.clipboard.writeText(mainReferral.code);
      setCopied(true);
      toast({
        title: "Code copié !",
        description: "Partage-le avec tes futurs clients",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalUses = mainReferral?.usedBy.length || 0;
  const thisMonthUses = mainReferral?.usedBy.filter((use) => {
    const useDate = new Date(use.usedAt);
    const now = new Date();
    return (
      useDate.getMonth() === now.getMonth() &&
      useDate.getFullYear() === now.getFullYear()
    );
  }).length || 0;

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Gift className="w-8 h-8" />
            Mes parrainages
          </h1>
          <p className="text-muted-foreground mt-2">
            Invite tes clients avec ton code et offre-leur une réduction
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total utilisations</p>
                  <p className="text-2xl font-bold">{totalUses}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ce mois-ci</p>
                  <p className="text-2xl font-bold">{thisMonthUses}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Réduction offerte</p>
                  <p className="text-2xl font-bold">{mainReferral?.discount || 20}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Referral Code */}
        {mainReferral ? (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Ton code de parrainage</CardTitle>
              <CardDescription>
                Offre {mainReferral.discount}% de réduction à tes nouveaux clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted p-4 rounded-lg">
                  <p className="text-3xl font-mono font-bold text-center">
                    {mainReferral.code}
                  </p>
                </div>
                <Button onClick={copyCode} size="lg">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copié !" : "Copier"}
                </Button>
              </div>

              <Alert>
                <Gift className="h-4 w-4" />
                <AlertDescription>
                  Partage ce code avec tes clients lors de leur inscription. Ils bénéficieront
                  automatiquement de la réduction sur leur abonnement.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Crée ton code de parrainage
              </h3>
              <p className="text-muted-foreground mb-6">
                Génère un code unique pour inviter tes clients
              </p>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                {createMutation.isPending ? "Création..." : "Créer mon code"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Usage History */}
        {mainReferral && mainReferral.usedBy.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Historique des utilisations</CardTitle>
              <CardDescription>
                Tous les clients qui ont utilisé ton code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mainReferral.usedBy
                  .sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime())
                  .map((use, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{use.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(use.usedAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="default">-{mainReferral.discount}%</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {mainReferral && mainReferral.usedBy.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucune utilisation pour l'instant</p>
              <p className="text-sm mt-2">Partage ton code pour commencer !</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}
