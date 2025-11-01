import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Utensils, Camera, Search, Plus, Target, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: FoodItem[];
}

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function MacrosPage() {
  const { data: user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [targets, setTargets] = useState({
    calories: 2500,
    protein: 150,
    carbs: 300,
    fat: 85
  });
  const [currentTotals, setCurrentTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  // Mock data
  useEffect(() => {
    const mockMeals: Meal[] = [
      {
        id: '1',
        name: 'Petit-déjeuner',
        time: '08:00',
        calories: 450,
        protein: 25,
        carbs: 45,
        fat: 18,
        foods: [
          { id: '1', name: 'Flocons d\'avoine', quantity: 50, unit: 'g', calories: 190, protein: 7, carbs: 34, fat: 3 },
          { id: '2', name: 'Banane', quantity: 1, unit: 'pièce', calories: 105, protein: 1, carbs: 27, fat: 0 },
          { id: '3', name: 'Lait d\'amande', quantity: 250, unit: 'ml', calories: 40, protein: 1, carbs: 2, fat: 3 },
          { id: '4', name: 'Miel', quantity: 15, unit: 'g', calories: 45, protein: 0, carbs: 12, fat: 0 }
        ]
      },
      {
        id: '2',
        name: 'Déjeuner',
        time: '13:00',
        calories: 650,
        protein: 45,
        carbs: 60,
        fat: 25,
        foods: [
          { id: '5', name: 'Poulet grillé', quantity: 150, unit: 'g', calories: 250, protein: 46, carbs: 0, fat: 6 },
          { id: '6', name: 'Riz complet', quantity: 80, unit: 'g', calories: 280, protein: 6, carbs: 58, fat: 2 },
          { id: '7', name: 'Brocolis', quantity: 100, unit: 'g', calories: 35, protein: 3, carbs: 7, fat: 0 },
          { id: '8', name: 'Huile d\'olive', quantity: 10, unit: 'ml', calories: 90, protein: 0, carbs: 0, fat: 10 }
        ]
      },
      {
        id: '3',
        name: 'Goûter',
        time: '16:00',
        calories: 200,
        protein: 15,
        carbs: 20,
        fat: 8,
        foods: [
          { id: '9', name: 'Fromage blanc', quantity: 150, unit: 'g', calories: 120, protein: 15, carbs: 8, fat: 3 },
          { id: '10', name: 'Fruits rouges', quantity: 100, unit: 'g', calories: 50, protein: 1, carbs: 12, fat: 0 },
          { id: '11', name: 'Noix', quantity: 15, unit: 'g', calories: 90, protein: 2, carbs: 2, fat: 9 }
        ]
      }
    ];
    setMeals(mockMeals);

    // Calculate totals
    const totals = mockMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    setCurrentTotals(totals);
  }, []);

  const macroData = [
    { name: 'Protéines', value: currentTotals.protein, color: '#4ADE80' },
    { name: 'Glucides', value: currentTotals.carbs, color: '#60A5FA' },
    { name: 'Lipides', value: currentTotals.fat, color: '#F59E0B' }
  ];

  const weeklyData = [
    { day: 'Lun', calories: 2400, protein: 140, carbs: 280, fat: 80 },
    { day: 'Mar', calories: 2500, protein: 150, carbs: 300, fat: 85 },
    { day: 'Mer', calories: 2300, protein: 135, carbs: 260, fat: 75 },
    { day: 'Jeu', calories: 2600, protein: 160, carbs: 320, fat: 90 },
    { day: 'Ven', calories: 2450, protein: 145, carbs: 290, fat: 82 },
    { day: 'Sam', calories: 2200, protein: 130, carbs: 250, fat: 70 },
    { day: 'Dim', calories: 2500, protein: 150, carbs: 300, fat: 85 }
  ];

  const getMacroProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getMacroColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90 && percentage <= 110) return 'text-secondary';
    if (percentage < 90) return 'text-warning';
    return 'text-danger';
  };

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
            <h1 className="text-3xl font-bold text-foreground">Nutrition & Macros</h1>
            <p className="text-muted-foreground mt-2">
              Suis tes macros, scanne tes aliments et optimise ta nutrition
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border">
              <Camera className="w-4 h-4 mr-2" />
              Scanner
            </Button>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter repas
            </Button>
          </div>
        </motion.div>

        {/* Macro Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Calories */}
          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Calories</h3>
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{currentTotals.calories}</span>
                  <span className="text-muted-foreground">/ {targets.calories}</span>
                </div>
                <Progress 
                  value={getMacroProgress(currentTotals.calories, targets.calories)} 
                  className="h-2"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Objectif</span>
                  <span className={getMacroColor(currentTotals.calories, targets.calories)}>
                    {Math.round(getMacroProgress(currentTotals.calories, targets.calories))}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protein */}
          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Protéines</h3>
                <Zap className="w-5 h-5 text-secondary" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{currentTotals.protein}g</span>
                  <span className="text-muted-foreground">/ {targets.protein}g</span>
                </div>
                <Progress 
                  value={getMacroProgress(currentTotals.protein, targets.protein)} 
                  className="h-2"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Objectif</span>
                  <span className={getMacroColor(currentTotals.protein, targets.protein)}>
                    {Math.round(getMacroProgress(currentTotals.protein, targets.protein))}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carbs & Fat */}
          <Card className="card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">Glucides</h3>
                    <span className="text-sm text-muted-foreground">{currentTotals.carbs}g / {targets.carbs}g</span>
                  </div>
                  <Progress 
                    value={getMacroProgress(currentTotals.carbs, targets.carbs)} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">Lipides</h3>
                    <span className="text-sm text-muted-foreground">{currentTotals.fat}g / {targets.fat}g</span>
                  </div>
                  <Progress 
                    value={getMacroProgress(currentTotals.fat, targets.fat)} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meals List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Repas du jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meals.map((meal) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{meal.name}</h4>
                          <p className="text-sm text-muted-foreground">{meal.time}</p>
                        </div>
                        <Badge className="badge-primary">
                          {meal.calories} kcal
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Protéines</p>
                          <p className="font-semibold text-secondary">{meal.protein}g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Glucides</p>
                          <p className="font-semibold text-info">{meal.carbs}g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Lipides</p>
                          <p className="font-semibold text-warning">{meal.fat}g</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {meal.foods.map((food) => (
                          <div key={food.id} className="flex items-center justify-between text-sm">
                            <span className="text-foreground">{food.name}</span>
                            <span className="text-muted-foreground">
                              {food.quantity}{food.unit} • {food.calories} kcal
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Macro Distribution */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Répartition des macros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  {macroData.map((macro, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: macro.color }}
                      />
                      <span className="text-sm text-muted-foreground">{macro.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Trend */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Évolution hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '8px' 
                      }} 
                    />
                    <Line type="monotone" dataKey="calories" stroke="var(--primary)" strokeWidth={2} />
                    <Line type="monotone" dataKey="protein" stroke="var(--secondary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="card hover-lift cursor-pointer">
            <CardContent className="p-6 text-center">
              <Camera className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Scanner aliment</h3>
              <p className="text-sm text-muted-foreground">
                Prends une photo pour identifier et ajouter un aliment
              </p>
            </CardContent>
          </Card>

          <Card className="card hover-lift cursor-pointer">
            <CardContent className="p-6 text-center">
              <Search className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Base de données</h3>
              <p className="text-sm text-muted-foreground">
                Recherche dans notre base de données d'aliments
              </p>
            </CardContent>
          </Card>

          <Card className="card hover-lift cursor-pointer">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-info mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Plan IA</h3>
              <p className="text-sm text-muted-foreground">
                Génère un plan nutritionnel personnalisé
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
