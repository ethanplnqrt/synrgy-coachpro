import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/PageWrapper";
import { CodexAssistant } from "@/components/CodexAssistant";
import { ReferralStats } from "@/components/ReferralStats";
import { Users, TrendingUp, Calendar, MessageSquare, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function CoachDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const stats = [
    { label: "Clients actifs", value: "0", icon: Users, color: "text-blue-600" },
    { label: "Programmes créés", value: "0", icon: Calendar, color: "text-green-600" },
    { label: "Messages", value: "0", icon: MessageSquare, color: "text-orange-600" },
    { label: "Taux de rétention", value: "0%", icon: TrendingUp, color: "text-purple-600" },
  ];

  return (
    <PageWrapper>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Bienvenue, Coach {user?.fullName || user?.email}
            </h1>
            <p className="text-muted-foreground text-lg">
              Gérez vos clients et programmes depuis votre tableau de bord
            </p>
          </div>
          <Button onClick={() => setLocation("/coach/clients")} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un client
          </Button>
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
            <CardDescription>Gérez votre activité coaching</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-24" onClick={() => setLocation("/coach/clients")}>
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Mes clients</p>
              </div>
            </Button>
            <Button variant="outline" className="h-24" onClick={() => setLocation("/coach/programs")}>
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Créer un programme</p>
              </div>
            </Button>
            <Button variant="outline" className="h-24" onClick={() => setLocation("/coach/analytics")}>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Analytics</p>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Referral System */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Programme de Parrainage</h2>
          <ReferralStats />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières interactions avec vos clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune activité pour le moment</p>
              <p className="text-sm mt-2">Commencez par ajouter vos premiers clients</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Codex Assistant */}
      <CodexAssistant role="coach" />
    </PageWrapper>
  );
}
