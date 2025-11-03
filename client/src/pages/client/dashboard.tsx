import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/PageWrapper";
import { CodexAssistant } from "@/components/CodexAssistant";
import { ClientReferralInfo } from "@/components/ClientReferralInfo";
import { MessageSquare, Dumbbell, Utensils, TrendingUp, Calendar, Target, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const todayStats = [
    { label: "Séances cette semaine", value: "0/3", icon: Dumbbell, color: "text-orange-600" },
    { label: "Calories cible", value: "0", icon: Utensils, color: "text-green-600" },
    { label: "Progression", value: "0%", icon: TrendingUp, color: "text-blue-600" },
  ];

  return (
    <PageWrapper>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Bonjour, {user?.fullName || user?.email}
          </h1>
          <p className="text-muted-foreground text-lg">
            Ton programme personnalisé t'attend
          </p>
        </div>

        {/* Referral Info */}
        <ClientReferralInfo />

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {todayStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coach Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ton Coach</CardTitle>
            <CardDescription>Communique avec ton coach professionnel</CardDescription>
          </CardHeader>
          <CardContent>
            {user?.coachId ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Coach assigné</p>
                  <p className="text-sm text-muted-foreground">ID: {user.coachId}</p>
                </div>
                <Button onClick={() => setLocation("/client/chat")}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contacter
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">Aucun coach assigné</p>
                <p className="text-sm text-muted-foreground">
                  Ton coach te sera assigné prochainement
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-32"
            onClick={() => setLocation("/client/training")}
          >
            <div className="text-center">
              <Dumbbell className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold">Mon entraînement</p>
              <p className="text-xs text-muted-foreground">Voir le programme</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-32"
            onClick={() => setLocation("/client/nutrition")}
          >
            <div className="text-center">
              <Utensils className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold">Ma nutrition</p>
              <p className="text-xs text-muted-foreground">Plan alimentaire</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-32"
            onClick={() => setLocation("/client/progress")}
          >
            <div className="text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold">Ma progression</p>
              <p className="text-xs text-muted-foreground">Stats & photos</p>
            </div>
          </Button>
        </div>

        {/* Today's Program */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Programme du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun programme pour aujourd'hui</p>
              <p className="text-sm mt-2">Ton coach créera ton programme bientôt</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Codex Assistant */}
      <CodexAssistant role="client" />
    </PageWrapper>
  );
}
