import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Slider } from '../components/ui/slider';
import { 
  Dumbbell, 
  Utensils, 
  Target, 
  TrendingUp, 
  Camera, 
  MessageSquare,
  Zap,
  Heart,
  Moon,
  Activity,
  Scale,
  Clock,
  CheckCircle2,
  Brain
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'wouter';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: number;
  isCompleted: boolean;
  scheduledTime: string;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rpe: number;
  rest: number;
  isCompleted: boolean;
  isPr: boolean;
}

interface NutritionPlan {
  id: string;
  meals: Meal[];
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  substitutions: string[];
}

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
  name: string;
  quantity: string;
  calories: number;
}

interface DailyMetrics {
  weight: number;
  steps: number;
  sleep: number;
  energy: number;
  hunger: number;
  pain: number;
  notes: string;
}

export default function AthleteDashboard() {
  const { data: user } = useAuth();
  const [, setLocation] = useLocation();
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics>({
    weight: 0,
    steps: 0,
    sleep: 0,
    energy: 3,
    hunger: 3,
    pain: 1,
    notes: ''
  });
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);

  // Mock data
  useEffect(() => {
    const mockWorkout: Workout = {
      id: '1',
      name: 'Push Day - Pecs & Triceps',
      duration: 0,
      isCompleted: false,
      scheduledTime: '14:00',
      exercises: [
        {
          id: '1',
          name: 'Développé couché',
          sets: 4,
          reps: 10,
          weight: 60,
          rpe: 7,
          rest: 180,
          isCompleted: false,
          isPr: false
        },
        {
          id: '2',
          name: 'Dips',
          sets: 3,
          reps: 12,
          weight: 0,
          rpe: 7,
          rest: 120,
          isCompleted: false,
          isPr: false
        },
        {
          id: '3',
          name: 'Développé incliné haltères',
          sets: 3,
          reps: 10,
          weight: 25,
          rpe: 8,
          rest: 90,
          isCompleted: false,
          isPr: false
        }
      ]
    };
    setTodayWorkout(mockWorkout);

    const mockNutrition: NutritionPlan = {
      id: '1',
      totalCalories: 2500,
      protein: 150,
      carbs: 300,
      fat: 85,
      substitutions: ['Riz complet → Quinoa', 'Poulet → Saumon'],
      meals: [
        {
          id: '1',
          name: 'Petit-déjeuner',
          time: '08:00',
          calories: 450,
          protein: 25,
          carbs: 45,
          fat: 18,
          foods: [
            { name: 'Flocons d\'avoine', quantity: '50g', calories: 190 },
            { name: 'Banane', quantity: '1 pièce', calories: 105 },
            { name: 'Lait d\'amande', quantity: '250ml', calories: 40 }
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
            { name: 'Poulet grillé', quantity: '150g', calories: 250 },
            { name: 'Riz complet', quantity: '80g', calories: 280 },
            { name: 'Brocolis', quantity: '100g', calories: 35 }
          ]
        }
      ]
    };
    setNutritionPlan(mockNutrition);
  }, []);

  const startRest = (seconds: number) => {
    setIsResting(true);
    setRestTime(seconds);
    
    const interval = setInterval(() => {
      setRestTime((prev) => {
        if (prev <= 1) {
          setIsResting(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeExercise = (exerciseId: string) => {
    if (!todayWorkout) return;

    const updatedWorkout = { ...todayWorkout };
    const exercise = updatedWorkout.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      exercise.isCompleted = true;
      // Check for PR
      if (exercise.weight > 60 && exercise.reps >= 10) {
        exercise.isPr = true;
      }
    }
    setTodayWorkout(updatedWorkout);
  };

  const saveDailyMetrics = () => {
    // Simulate API call
    console.log('Métriques sauvegardées:', dailyMetrics);
    // Show success message
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const weeklyData = [
    { day: 'Lun', weight: 75.2, energy: 7, adherence: 85 },
    { day: 'Mar', weight: 75.0, energy: 8, adherence: 92 },
    { day: 'Mer', weight: 74.8, energy: 6, adherence: 78 },
    { day: 'Jeu', weight: 74.9, energy: 7, adherence: 88 },
    { day: 'Ven', weight: 74.7, energy: 8, adherence: 95 },
    { day: 'Sam', weight: 74.8, energy: 6, adherence: 82 },
    { day: 'Dim', weight: 75.0, energy: 7, adherence: 90 }
  ];

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-foreground">
            🔥 Salut {user?.fullName || 'Athlète'}, prêt(e) à t'améliorer aujourd'hui ?
          </h1>
          <p className="text-muted-foreground mt-2">
            Voici ton programme du jour et tes métriques personnelles
          </p>
        </motion.div>

        {/* Rest Timer */}
        {isResting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-4 right-4 z-50"
          >
            <Card className="card border-primary/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Repos</p>
                    <p className="text-2xl font-bold text-primary">{formatTime(restTime)}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setIsResting(false)}>
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Workout */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  🏋️ Programme du jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayWorkout && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{todayWorkout.name}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{todayWorkout.scheduledTime}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {todayWorkout.exercises.map((exercise) => (
                        <motion.div
                          key={exercise.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 border rounded-lg ${
                            exercise.isCompleted 
                              ? 'border-secondary/50 bg-secondary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                            {exercise.isPr && (
                              <Badge className="badge-warning">
                                <Target className="w-3 h-3 mr-1" />
                                PR
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground mb-3">
                            <span>{exercise.sets} séries</span>
                            <span>{exercise.reps} reps</span>
                            <span>{exercise.weight}kg</span>
                            <span>RPE {exercise.rpe}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                completeExercise(exercise.id);
                                startRest(exercise.rest);
                              }}
                              disabled={exercise.isCompleted}
                            >
                              {exercise.isCompleted ? '✓ Terminé' : 'Commencer'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startRest(exercise.rest)}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {exercise.rest}s
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Progression</span>
                        <span>
                          {todayWorkout.exercises.filter(ex => ex.isCompleted).length} / {todayWorkout.exercises.length}
                        </span>
                      </div>
                      <Progress 
                        value={(todayWorkout.exercises.filter(ex => ex.isCompleted).length / todayWorkout.exercises.length) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Nutrition Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  🍽️ Nutrition du jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                {nutritionPlan && (
                  <div className="space-y-4">
                    {/* Macro Overview */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-surface rounded-lg">
                        <p className="text-2xl font-bold text-primary">{nutritionPlan.totalCalories}</p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                      <div className="text-center p-3 bg-surface rounded-lg">
                        <p className="text-2xl font-bold text-secondary">{nutritionPlan.protein}g</p>
                        <p className="text-xs text-muted-foreground">protéines</p>
                      </div>
                    </div>

                    {/* Meals */}
                    <div className="space-y-3">
                      {nutritionPlan.meals.map((meal) => (
                        <div key={meal.id} className="p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">{meal.name}</h4>
                            <span className="text-sm text-muted-foreground">{meal.time}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g L
                          </div>
                          <div className="space-y-1">
                            {meal.foods.map((food, index) => (
                              <div key={index} className="flex justify-between text-xs">
                                <span>{food.name}</span>
                                <span>{food.quantity} • {food.calories} kcal</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Substitutions */}
                    {nutritionPlan.substitutions.length > 0 && (
                      <div className="mt-4 p-3 bg-info/10 rounded-lg">
                        <h5 className="font-semibold text-info mb-2">💡 Substitutions IA</h5>
                        <div className="space-y-1">
                          {nutritionPlan.substitutions.map((sub, index) => (
                            <p key={index} className="text-sm text-muted-foreground">{sub}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Daily Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                🧠 Auto-suivi quotidien
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Weight */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Poids (kg)</span>
                  </div>
                  <input
                    type="number"
                    value={dailyMetrics.weight || ''}
                    onChange={(e) => setDailyMetrics(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                    placeholder="75.2"
                    className="w-full p-2 border border-border rounded-lg bg-surface text-foreground"
                    step="0.1"
                  />
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-secondary" />
                    <span className="font-semibold text-foreground">Pas</span>
                  </div>
                  <input
                    type="number"
                    value={dailyMetrics.steps || ''}
                    onChange={(e) => setDailyMetrics(prev => ({ ...prev, steps: parseInt(e.target.value) || 0 }))}
                    placeholder="8500"
                    className="w-full p-2 border border-border rounded-lg bg-surface text-foreground"
                  />
                </div>

                {/* Sleep */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-info" />
                    <span className="font-semibold text-foreground">Sommeil (h)</span>
                  </div>
                  <input
                    type="number"
                    value={dailyMetrics.sleep || ''}
                    onChange={(e) => setDailyMetrics(prev => ({ ...prev, sleep: parseFloat(e.target.value) || 0 }))}
                    placeholder="7.5"
                    className="w-full p-2 border border-border rounded-lg bg-surface text-foreground"
                    step="0.5"
                  />
                </div>

                {/* Energy */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-warning" />
                      <span className="font-semibold text-foreground">Énergie</span>
                    </div>
                    <span className="text-lg font-bold text-warning">{dailyMetrics.energy}/5</span>
                  </div>
                  <Slider
                    value={[dailyMetrics.energy]}
                    onValueChange={([value]) => setDailyMetrics(prev => ({ ...prev, energy: value }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Hunger */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-danger" />
                      <span className="font-semibold text-foreground">Faim</span>
                    </div>
                    <span className="text-lg font-bold text-danger">{dailyMetrics.hunger}/5</span>
                  </div>
                  <Slider
                    value={[dailyMetrics.hunger]}
                    onValueChange={([value]) => setDailyMetrics(prev => ({ ...prev, hunger: value }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Pain */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-danger" />
                      <span className="font-semibold text-foreground">Douleur</span>
                    </div>
                    <span className="text-lg font-bold text-danger">{dailyMetrics.pain}/5</span>
                  </div>
                  <Slider
                    value={[dailyMetrics.pain]}
                    onValueChange={([value]) => setDailyMetrics(prev => ({ ...prev, pain: value }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Notes du jour
                </label>
                <textarea
                  value={dailyMetrics.notes}
                  onChange={(e) => setDailyMetrics(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Comment te sens-tu aujourd'hui ? Des points particuliers à noter ?"
                  className="w-full p-3 border border-border rounded-lg bg-surface text-foreground resize-none"
                  rows={3}
                />
              </div>

              <div className="mt-4 flex gap-3">
                <Button onClick={saveDailyMetrics} className="btn-primary">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Photo progression
                </Button>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contacter coach
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                📈 Évolution de la semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B3D" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF6B3D" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#FF6B3D" 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    name="Poids (kg)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#F59E0B" 
                    fillOpacity={1} 
                    fill="url(#colorEnergy)" 
                    name="Énergie (/5)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}