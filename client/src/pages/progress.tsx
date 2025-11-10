import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  TrendingUp, 
  Weight, 
  Target, 
  Calendar, 
  BarChart3, 
  PieChart,
  Activity,
  Loader2,
  AlertCircle
} from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface ProgressData {
  weight: number;
  bodyFat: number;
  muscleMass: number;
  date: string;
}

interface WorkoutData {
  date: string;
  exercises: number;
  sets: number;
  reps: number;
  weight: number;
  volume: number;
}

interface NutritionData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function ProgressPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [nutritionData, setNutritionData] = useState<NutritionData[]>([]);

  const loadProgressData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/progress');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const result = await response.json();
      setProgressData(result.progress);
      setWorkoutData(result.workouts);
      setNutritionData(result.nutrition);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const mockLoadProgressData = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const mockProgress: ProgressData[] = [
        { weight: 75, bodyFat: 18, muscleMass: 35, date: "2024-01-01" },
        { weight: 74, bodyFat: 17, muscleMass: 36, date: "2024-01-08" },
        { weight: 73, bodyFat: 16, muscleMass: 37, date: "2024-01-15" },
        { weight: 72, bodyFat: 15, muscleMass: 38, date: "2024-01-22" },
        { weight: 71, bodyFat: 14, muscleMass: 39, date: "2024-01-29" }
      ];

      const mockWorkouts: WorkoutData[] = [
        { date: "2024-01-01", exercises: 8, sets: 24, reps: 192, weight: 1200, volume: 230400 },
        { date: "2024-01-08", exercises: 8, sets: 24, reps: 200, weight: 1250, volume: 250000 },
        { date: "2024-01-15", exercises: 8, sets: 24, reps: 208, weight: 1300, volume: 270400 },
        { date: "2024-01-22", exercises: 8, sets: 24, reps: 216, weight: 1350, volume: 291600 },
        { date: "2024-01-29", exercises: 8, sets: 24, reps: 224, weight: 1400, volume: 313600 }
      ];

      const mockNutrition: NutritionData[] = [
        { date: "2024-01-01", calories: 2200, protein: 150, carbs: 200, fat: 80 },
        { date: "2024-01-08", calories: 2150, protein: 155, carbs: 190, fat: 75 },
        { date: "2024-01-15", calories: 2100, protein: 160, carbs: 180, fat: 70 },
        { date: "2024-01-22", calories: 2050, protein: 165, carbs: 170, fat: 65 },
        { date: "2024-01-29", calories: 2000, protein: 170, carbs: 160, fat: 60 }
      ];

      setProgressData(mockProgress);
      setWorkoutData(mockWorkouts);
      setNutritionData(mockNutrition);
      setIsLoading(false);
    }, 1000);
  };

  const calculateProgress = () => {
    if (progressData.length < 2) return { weight: 0, bodyFat: 0, muscleMass: 0 };

    const latest = progressData[progressData.length - 1];
    const first = progressData[0];

    return {
      weight: ((latest.weight - first.weight) / first.weight) * 100,
      bodyFat: ((first.bodyFat - latest.bodyFat) / first.bodyFat) * 100,
      muscleMass: ((latest.muscleMass - first.muscleMass) / first.muscleMass) * 100
    };
  };

  const progress = calculateProgress();

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            📈 Ma Progression
          </h1>
          <p className="text-muted-foreground">
            Suivez vos progrès et analysez vos performances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Weight className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Poids</p>
                  <p className="text-2xl font-bold">
                    {progressData.length > 0 ? progressData[progressData.length - 1].weight : 0}kg
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {progress.weight > 0 ? '+' : ''}{progress.weight.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Masse musculaire</p>
                  <p className="text-2xl font-bold">
                    {progressData.length > 0 ? progressData[progressData.length - 1].muscleMass : 0}kg
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {progress.muscleMass > 0 ? '+' : ''}{progress.muscleMass.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Volume d'entraînement</p>
                  <p className="text-2xl font-bold">
                    {workoutData.length > 0 ? workoutData[workoutData.length - 1].volume.toLocaleString() : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">kg total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Progression du poids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(data.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{data.weight}kg</span>
                      <Progress 
                        value={(data.weight / 80) * 100} 
                        className="w-20" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Composition corporelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {new Date(data.date).toLocaleDateString()}
                      </span>
                      <span className="font-medium">{data.bodyFat}% masse grasse</span>
                    </div>
                    <Progress value={data.bodyFat} className="w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Historique des entraînements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workoutData.map((workout, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {new Date(workout.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {workout.exercises} exercices • {workout.sets} séries
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{workout.volume.toLocaleString()}kg</p>
                    <p className="text-sm text-muted-foreground">Volume total</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Historique nutritionnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nutritionData.map((nutrition, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {new Date(nutrition.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {nutrition.protein}g protéines • {nutrition.carbs}g glucides
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{nutrition.calories} kcal</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Chargement des données...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2 text-destructive">Erreur</h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        ) : null}

        <div className="flex justify-center gap-4">
          {config?.testMode && (
            <Button onClick={mockLoadProgressData} variant="secondary">
              Charger des données de démonstration
            </Button>
          )}
          <Button onClick={loadProgressData} variant="outline">
            Actualiser les données
          </Button>
          <Button onClick={() => setLocation('/coach/dashboard')} variant="outline">
            Retour au dashboard
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}













