import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Utensils, 
  Clock, 
  Target,
  CheckCircle2,
  Info
} from 'lucide-react';
import { PageWrapper } from '../../components/PageWrapper';

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: string[];
}

export default function ClientNutrition() {
  // Mock nutrition data
  const dailyTargets = {
    calories: 2500,
    protein: 150,
    carbs: 300,
    fat: 90
  };

  const meals: Meal[] = [
    {
      id: '1',
      name: 'Petit-déjeuner',
      time: '08:00',
      calories: 450,
      protein: 25,
      carbs: 45,
      fat: 18,
      foods: ['Flocons d\'avoine', 'Banane', 'Lait d\'amande', 'Miel']
    },
    {
      id: '2',
      name: 'Déjeuner',
      time: '13:00',
      calories: 650,
      protein: 45,
      carbs: 60,
      fat: 25,
      foods: ['Poulet grillé', 'Riz complet', 'Brocolis', 'Huile d\'olive']
    },
    {
      id: '3',
      name: 'Goûter',
      time: '16:00',
      calories: 300,
      protein: 20,
      carbs: 35,
      fat: 10,
      foods: ['Fromage blanc', 'Fruits rouges', 'Noix']
    },
    {
      id: '4',
      name: 'Dîner',
      time: '20:00',
      calories: 700,
      protein: 50,
      carbs: 70,
      fat: 30,
      foods: ['Saumon', 'Patate douce', 'Salade verte', 'Avocat']
    }
  ];

  const currentTotals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">
            Mon plan nutritionnel
          </h1>
          <p className="text-muted-foreground mt-2">
            Plan personnalisé par ton coach Alexandre
          </p>
        </motion.div>

        {/* Daily Targets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objectifs du jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-surface rounded-lg">
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="text-2xl font-bold text-primary">{currentTotals.calories}/{dailyTargets.calories}</p>
                </div>
                <div className="text-center p-4 bg-surface rounded-lg">
                  <p className="text-sm text-muted-foreground">Protéines</p>
                  <p className="text-2xl font-bold text-secondary">{currentTotals.protein}g/{dailyTargets.protein}g</p>
                </div>
                <div className="text-center p-4 bg-surface rounded-lg">
                  <p className="text-sm text-muted-foreground">Glucides</p>
                  <p className="text-2xl font-bold text-info">{currentTotals.carbs}g/{dailyTargets.carbs}g</p>
                </div>
                <div className="text-center p-4 bg-surface rounded-lg">
                  <p className="text-sm text-muted-foreground">Lipides</p>
                  <p className="text-2xl font-bold text-warning">{currentTotals.fat}g/{dailyTargets.fat}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Meals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {meals.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {meal.name}
                    </CardTitle>
                    <Badge className="badge-primary">
                      {meal.time}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Calories</p>
                      <p className="font-semibold text-foreground">{meal.calories}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Protéines</p>
                      <p className="font-semibold text-secondary">{meal.protein}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Glucides</p>
                      <p className="font-semibold text-info">{meal.carbs}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lipides</p>
                      <p className="font-semibold text-warning">{meal.fat}g</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-medium text-foreground mb-2">Aliments :</p>
                    <div className="flex flex-wrap gap-2">
                      {meal.foods.map((food, idx) => (
                        <Badge key={idx} variant="outline" className="border-border">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card bg-info/10 border-info/30">
            <CardContent className="p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-info flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground mb-1">💡 Conseil de ton coach</p>
                <p className="text-sm text-muted-foreground">
                  Hydrate-toi bien entre les repas. Pense à boire au moins 2L d'eau par jour pour optimiser ta récupération.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
