import React from 'react';
import { Button } from '../components/ui/button';
import { PageWrapper } from '../components/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useLocation } from 'wouter';
import { Users, Dumbbell, MessageSquare, Settings, Plus, TrendingUp, Utensils, Camera } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mockClients, mockPrograms } from '../lib/mockData';

export default function CoachDashboard() {
  const [, setLocation] = useLocation();
  const { data: user } = useAuth();

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with role banner */}
        <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Espace Coach 👨‍🏫</h1>
              <p className="text-orange-100 mt-2">
                Gère tes athlètes, crée des programmes personnalisés et suis leurs progrès.
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                Gestion Professionnelle
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-lift cursor-pointer" onClick={() => setLocation('/training')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Plus className="w-5 h-5" />
                Créer un programme IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Génère un programme d'entraînement personnalisé avec l'IA.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift cursor-pointer" onClick={() => setLocation('/nutrition')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Utensils className="w-5 h-5" />
                Plan alimentaire IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Crée des plans nutritionnels personnalisés par IA.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift cursor-pointer" onClick={() => setLocation('/coach/clients')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Users className="w-5 h-5" />
                Mes athlètes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gère tes athlètes et suis leur progression.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift cursor-pointer" onClick={() => setLocation('/scan')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Camera className="w-5 h-5" />
                Scan IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analysez repas et exercices avec l'intelligence artificielle.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Athlètes actifs</p>
                  <p className="text-2xl font-bold">{mockClients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Dumbbell className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Programmes créés</p>
                  <p className="text-2xl font-bold">{mockPrograms.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Progression moyenne</p>
                  <p className="text-2xl font-bold">72%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Messages IA</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Programs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Programmes récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPrograms.map((program) => (
                <div key={program.id} className="flex items-center justify-between p-3 border rounded-lg hover-lift">
                  <div>
                    <h3 className="font-medium">{program.title}</h3>
                    <p className="text-sm text-muted-foreground">Statut: {program.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{program.progress}</p>
                    <p className="text-xs text-muted-foreground">Progression</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}