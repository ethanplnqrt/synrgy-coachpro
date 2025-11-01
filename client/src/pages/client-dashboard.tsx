import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Dumbbell, 
  Utensils, 
  MessageSquare, 
  Camera, 
  TrendingUp, 
  User,
  Calendar,
  Target,
  Heart,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'wouter';

export default function ClientDashboard() {
  const { data: user } = useAuth();
  const [, setLocation] = useLocation();
  const [dailyMetrics, setDailyMetrics] = useState({
    weight: 75.2,
    sleep: 7.5,
    energy: 4,
    hunger: 3,
    mood: 8
  });

  // Mock coach data
  const coach = {
    name: 'Alexandre Dubois',
    avatar: 'https://ui-avatars.com/api/?name=Alexandre+Dubois&background=FF6B3D&color=fff',
    status: 'online'
  };

  // Mock programs
  const hasTrainingPlan = true;
  const hasNutritionPlan = true;
  const nextSession = 'Demain 14h00';

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              💪 Bienvenue {user?.fullName || 'Client'}, ton coach Alexandre t'attend déjà.
            </h1>
            <p className="text-muted-foreground mt-2">
              Voici ton espace personnel et ta progression
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
              <img 
                src={coach.avatar} 
                alt={coach.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">{coach.name}</p>
                <Badge className="badge-success">
                  {coach.status}
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prochaine séance</p>
                  <p className="text-xl font-bold text-foreground">{nextSession}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Semaine actuelle</p>
                  <p className="text-xl font-bold text-foreground">3/4 séances</p>
                </div>
                <Target className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Poids actuel</p>
                  <p className="text-xl font-bold text-foreground">{dailyMetrics.weight} kg</p>
                </div>
                <TrendingUp className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Messages</p>
                  <p className="text-xl font-bold text-foreground">2</p>
                </div>
                <MessageSquare className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Programs Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Mon programme d'entraînement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasTrainingPlan ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-surface rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">Séance du jour</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Push Day - Pecs & Triceps • {nextSession}
                      </p>
                      <div className="flex gap-2">
                        <Badge className="badge-primary">4 exercices</Badge>
                        <Badge className="badge-secondary">60 min</Badge>
                      </div>
                    </div>
                    <Button 
                      className="w-full btn-primary"
                      onClick={() => setLocation('/dashboard/client/training')}
                    >
                      Voir le programme complet
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Aucun programme assigné pour le moment</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Mon plan nutritionnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasNutritionPlan ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-surface rounded-lg">
                        <p className="text-2xl font-bold text-primary">2500</p>
                        <p className="text-xs text-muted-foreground">kcal/jour</p>
                      </div>
                      <div className="text-center p-3 bg-surface rounded-lg">
                        <p className="text-2xl font-bold text-secondary">150g</p>
                        <p className="text-xs text-muted-foreground">protéines</p>
                      </div>
                      <div className="text-center p-3 bg-surface rounded-lg">
                        <p className="text-2xl font-bold text-info">300g</p>
                        <p className="text-xs text-muted-foreground">glucides</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full btn-secondary"
                      onClick={() => setLocation('/dashboard/client/nutrition')}
                    >
                      Voir les repas détaillés
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Aucun plan nutritionnel assigné</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions & Daily Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Données du jour
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">Poids</span>
                  </div>
                  <span className="font-semibold text-primary">{dailyMetrics.weight} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-secondary" />
                    <span className="text-sm text-foreground">Humeur</span>
                  </div>
                  <Badge className="badge-success">{dailyMetrics.mood}/10</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-warning" />
                    <span className="text-sm text-foreground">Énergie</span>
                  </div>
                  <Badge className="badge-warning">{dailyMetrics.energy}/5</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full btn-primary"
                  onClick={() => setLocation('/dashboard/client/chat')}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contacter mon coach
                </Button>
                <Button 
                  className="w-full btn-secondary"
                  onClick={() => setLocation('/progress-photos')}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Photo de progression
                </Button>
                <Button 
                  className="w-full btn-secondary"
                  onClick={() => setLocation('/dashboard/client/progress')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Voir ma progression
                </Button>
              </CardContent>
            </Card>

            <Card className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Ton coach est là</h3>
                <p className="text-sm text-muted-foreground">
                  N'hésite pas à lui poser des questions !
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}