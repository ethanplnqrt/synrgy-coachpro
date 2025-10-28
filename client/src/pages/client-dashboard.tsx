import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp, Dumbbell, MessageCircle, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import type { User, Program, Exercise } from "@shared/schema";
import { useAppConfig } from "../lib/config";

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: programs = [], isLoading: programsLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs/my-programs"],
    enabled: !config?.testMode,
  });

  const demoProgram: Program = { id: "p1", coachId: "coach-demo", clientId: "client-demo", name: "Full body débutant", description: "3 séances / semaine", durationWeeks: 4, status: "active", createdAt: new Date(), updatedAt: new Date() };
  const sourcePrograms = config?.testMode ? [demoProgram] : programs;
  const activeProgram = sourcePrograms.find((p) => p.status === "active");

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises", activeProgram?.id],
    enabled: !!activeProgram && !config?.testMode,
  });

  const demoExercises: Exercise[] = [
    { id: "e1", programId: "p1", name: "Squat", sets: 3, reps: 12, day: 1, completed: false, createdAt: new Date(), updatedAt: new Date() },
    { id: "e2", programId: "p1", name: "Pompes", sets: 3, reps: 10, day: 1, completed: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "e3", programId: "p1", name: "Gainage", sets: 3, reps: 45, day: 1, completed: false, createdAt: new Date(), updatedAt: new Date() },
  ];
  const sourceExercises = config?.testMode ? demoExercises : exercises;

  const todayExercises = sourceExercises.filter((ex) => ex.day === 1).slice(0, 5);
  const completedCount = sourceExercises.filter((ex) => ex.completed).length;
  const totalCount = sourceExercises.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl p-8 border border-primary/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
              Bienvenue {user?.fullName} !
            </h1>
            <p className="text-muted-foreground">
              {activeProgram
                ? `Votre programme : ${activeProgram.name}`
                : "Vous n'avez pas de programme actif pour le moment"}
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setLocation("/client/ai-coach")}
            data-testid="button-ai-coach"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Coach IA
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card data-testid="card-progress">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Progression globale
              </p>
              <div className="bg-green-50 dark:bg-green-950/20 text-green-600 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-2" data-testid="text-progress-percentage">
              {progressPercentage}%
            </p>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedCount} / {totalCount} exercices complétés
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-program">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Programme actif
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 p-2 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">
              {activeProgram ? activeProgram.durationWeeks : "0"}
            </p>
            <p className="text-xs text-muted-foreground">
              {activeProgram ? "semaines de programme" : "Pas de programme"}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-today-workouts">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Aujourd'hui
              </p>
              <div className="bg-purple-50 dark:bg-purple-950/20 text-purple-600 p-2 rounded-lg">
                <Dumbbell className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{todayExercises.length}</p>
            <p className="text-xs text-muted-foreground">exercices à faire</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Workout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Entraînement du jour</CardTitle>
            {activeProgram && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/client/program")}
                data-testid="button-view-full-program"
              >
                Voir tout
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {programsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : !activeProgram ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground mb-1">Aucun programme actif</p>
                <p className="text-xs text-muted-foreground">
                  Contactez votre coach pour obtenir un programme d'entraînement
                </p>
              </div>
            ) : todayExercises.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-3" />
                <p className="text-sm font-medium">Excellent travail !</p>
                <p className="text-xs text-muted-foreground">
                  Vous avez terminé tous les exercices d'aujourd'hui
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayExercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover-elevate"
                    data-testid={`exercise-item-${index}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      exercise.completed
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {exercise.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {exercise.sets && exercise.reps
                          ? `${exercise.sets} séries × ${exercise.reps} reps`
                          : "Voir les détails"}
                        {exercise.weight && ` - ${exercise.weight}`}
                      </p>
                    </div>
                    {exercise.completed && (
                      <Badge variant="default" className="text-xs">
                        Terminé
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Accès rapide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2 text-left"
              onClick={() => setLocation("/client/program")}
              data-testid="button-quick-program"
            >
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Mon programme</p>
                <p className="text-xs text-muted-foreground">Voir tous les exercices</p>
              </div>
            </button>

            <button
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2 text-left"
              onClick={() => setLocation("/client/ai-coach")}
              data-testid="button-quick-ai-coach"
            >
              <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 p-2 rounded-lg">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Coach IA</p>
                <p className="text-xs text-muted-foreground">Poser une question</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Card */}
      <Card className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent border-green-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 text-green-600 dark:text-green-400 p-3 rounded-full">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Continuez comme ça !</h3>
              <p className="text-sm text-muted-foreground">
                Vous progressez régulièrement. Restez concentré et les résultats suivront.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
