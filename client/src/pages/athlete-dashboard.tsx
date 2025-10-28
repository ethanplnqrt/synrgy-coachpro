import React from 'react';
import { Button } from '../components/ui/button';
import { PageWrapper } from '../components/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { useLocation } from 'wouter';
import { Dumbbell, MessageSquare, Calendar, Target, Trophy, Clock, Utensils, Heart, Camera } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mockPrograms } from '../lib/mockData';

export default function AthleteDashboard() {
  const [, setLocation] = useLocation();
  const { data: user } = useAuth();

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with role banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Espace Athlète 🏋️‍♀️</h1>
              <p className="text-blue-100 mt-2">
                Suis ton programme d'entraînement, ton plan nutritionnel et tes progrès.
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                Coaching Personnel
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-lift cursor-pointer" onClick={() => setLocation('/training')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Dumbbell className="w-5 h-5" />
                Voir mon programme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Consulte ton programme d'entraînement personnalisé.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift cursor-pointer" onClick={() => setLocation('/nutrition')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Utensils className="w-5 h-5" />
                Mon plan alimentaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Plan nutritionnel personnalisé généré par IA.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift cursor-pointer" onClick={() => setLocation('/athlete/chat')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <MessageSquare className="w-5 h-5" />
                Coach IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pose tes questions à ton coach IA personnel.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift cursor-pointer" onClick={() => setLocation('/scan')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Camera className="w-5 h-5" />
                Scan IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analysez vos repas et exercices avec l'IA.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Objectifs atteints</p>
                  <p className="text-2xl font-bold">3/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Séances cette semaine</p>
                  <p className="text-2xl font-bold">4/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Calories brûlées</p>
                  <p className="text-2xl font-bold">2,847</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Série actuelle</p>
                  <p className="text-2xl font-bold">12j</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Program Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Progression de mon programme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPrograms.map((program) => (
                <div key={program.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{program.title}</h3>
                    <span className="text-sm font-medium text-green-600">{program.progress}</span>
                  </div>
                  <Progress value={parseInt(program.progress)} className="h-2" />
                  <p className="text-sm text-muted-foreground">Statut: {program.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Workout */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Séance d'aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Dumbbell className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-medium">Force & Endurance</h3>
                    <p className="text-sm text-muted-foreground">45 min • Intermédiaire</p>
                  </div>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Commencer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}