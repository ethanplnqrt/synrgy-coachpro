import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/PageWrapper";
import { CodexAssistant } from "@/components/CodexAssistant";
import { Brain, Dumbbell, Utensils, TrendingUp, Zap, Plus, MessageSquare } from "lucide-react";
import { useLocation } from "wouter";

export default function AthleteDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const stats = [
    { label: "Séances cette semaine", value: "0", icon: Dumbbell, color: "text-orange-600" },
    { label: "Calories moyennes", value: "0", icon: Utensils, color: "text-green-600" },
    { label: "Progression", value: "0%", icon: TrendingUp, color: "text-blue-600" },
    { label: "Streak", value: "0 jours", icon: Zap, color: "text-purple-600" },
  ];

  return (
    <PageWrapper>
      <div className="p-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Hey {user?.fullName || user?.email} ! 👋
              </h1>
              <p className="text-lg text-muted-foreground">
                Prêt à progresser aujourd'hui ? Ton coach IA est là pour toi.
              </p>
            </div>
            <Brain className="w-20 h-20 text-primary opacity-50" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat) => (
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Crée et gère ton entraînement</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4">
            <Button
              variant="default"
              className="h-24 bg-gradient-to-br from-orange-500 to-red-500"
              onClick={() => setLocation("/athlete/training/create")}
            >
              <div className="text-center">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Créer programme</p>
              </div>
            </Button>

            <Button
              variant="default"
              className="h-24 bg-gradient-to-br from-green-500 to-emerald-500"
              onClick={() => setLocation("/athlete/nutrition/create")}
            >
              <div className="text-center">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Créer plan nutrition</p>
              </div>
            </Button>

            <Button
              variant="default"
              className="h-24 bg-gradient-to-br from-purple-500 to-blue-500"
              onClick={() => setLocation("/athlete/ai")}
            >
              <div className="text-center">
                <Brain className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Assistant IA</p>
              </div>
            </Button>

            <Button
              variant="default"
              className="h-24 bg-gradient-to-br from-blue-500 to-cyan-500"
              onClick={() => setLocation("/athlete/chat")}
            >
              <div className="text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Chat IA</p>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* AI Coach Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Ton Coach IA Synrgy</CardTitle>
                <CardDescription>Assistant intelligent personnalisé</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              Discute avec ton coach IA pour obtenir des conseils personnalisés sur l'entraînement,
              la nutrition, la récupération et la progression. Il apprend de tes habitudes et s'adapte à toi.
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={() => setLocation("/athlete/chat")}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Démarrer une conversation
            </Button>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Entraînement</CardTitle>
              <CardDescription>Tes programmes et performances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun programme actif</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setLocation("/athlete/training/create")}
                >
                  Créer mon premier programme
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nutrition</CardTitle>
              <CardDescription>Tes plans alimentaires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun plan nutrition actif</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setLocation("/athlete/nutrition/create")}
                >
                  Créer mon plan nutrition
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Codex Assistant */}
      <CodexAssistant role="athlete" />
    </PageWrapper>
  );
}
