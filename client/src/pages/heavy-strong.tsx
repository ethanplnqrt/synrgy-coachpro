import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dumbbell, Trophy, Clock, Target, TrendingUp, Plus, Play, Pause, RotateCcw } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: Set[];
  isPr: boolean;
  prType?: 'weight' | 'reps' | 'volume';
}

interface Set {
  id: string;
  weight: number;
  reps: number;
  rpe?: number;
  rir?: number;
  tempo?: string;
  rest?: number;
  notes?: string;
  isCompleted: boolean;
}

interface WorkoutSession {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: Exercise[];
  totalVolume: number;
  isCompleted: boolean;
}

export default function HeavyStrongPage() {
  const { data: user } = useAuth();
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [restInterval, setRestInterval] = useState<NodeJS.Timeout | null>(null);

  // Mock data
  useEffect(() => {
    const mockWorkout: WorkoutSession = {
      id: '1',
      name: 'Push Day - Pecs & Triceps',
      date: new Date().toISOString(),
      duration: 0,
      totalVolume: 0,
      isCompleted: false,
      exercises: [
        {
          id: '1',
          name: 'Développé couché',
          category: 'Chest',
          isPr: false,
          sets: [
            { id: '1', weight: 60, reps: 8, rpe: 7, tempo: '3-0-1-0', rest: 180, isCompleted: false },
            { id: '2', weight: 60, reps: 8, rpe: 8, tempo: '3-0-1-0', rest: 180, isCompleted: false },
            { id: '3', weight: 60, reps: 7, rpe: 9, tempo: '3-0-1-0', rest: 180, isCompleted: false },
            { id: '4', weight: 60, reps: 6, rpe: 9, tempo: '3-0-1-0', rest: 180, isCompleted: false }
          ]
        },
        {
          id: '2',
          name: 'Dips',
          category: 'Triceps',
          isPr: false,
          sets: [
            { id: '5', weight: 0, reps: 12, rpe: 7, rest: 120, isCompleted: false },
            { id: '6', weight: 0, reps: 12, rpe: 8, rest: 120, isCompleted: false },
            { id: '7', weight: 0, reps: 10, rpe: 9, rest: 120, isCompleted: false }
          ]
        },
        {
          id: '3',
          name: 'Développé incliné haltères',
          category: 'Chest',
          isPr: false,
          sets: [
            { id: '8', weight: 25, reps: 10, rpe: 7, rest: 90, isCompleted: false },
            { id: '9', weight: 25, reps: 10, rpe: 8, rest: 90, isCompleted: false },
            { id: '10', weight: 25, reps: 8, rpe: 9, rest: 90, isCompleted: false }
          ]
        }
      ]
    };
    setCurrentWorkout(mockWorkout);

    // Mock workout history
    const mockHistory: WorkoutSession[] = [
      {
        id: '2',
        name: 'Pull Day - Dos & Biceps',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 75,
        totalVolume: 8500,
        isCompleted: true,
        exercises: []
      },
      {
        id: '3',
        name: 'Leg Day - Quadriceps & Fessiers',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 90,
        totalVolume: 12000,
        isCompleted: true,
        exercises: []
      }
    ];
    setWorkoutHistory(mockHistory);
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
    
    setRestInterval(interval);
  };

  const stopRest = () => {
    if (restInterval) {
      clearInterval(restInterval);
      setRestInterval(null);
    }
    setIsResting(false);
    setRestTime(0);
  };

  const completeSet = (exerciseId: string, setId: string) => {
    if (!currentWorkout) return;

    const updatedWorkout = { ...currentWorkout };
    const exercise = updatedWorkout.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      const set = exercise.sets.find(s => s.id === setId);
      if (set) {
        set.isCompleted = true;
        // Check for PR
        if (set.weight > 60 && set.reps >= 8) {
          exercise.isPr = true;
          exercise.prType = 'weight';
        }
      }
    }
    setCurrentWorkout(updatedWorkout);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const weeklyData = [
    { day: 'Lun', volume: 8500, prs: 2 },
    { day: 'Mar', volume: 0, prs: 0 },
    { day: 'Mer', volume: 12000, prs: 1 },
    { day: 'Jeu', volume: 0, prs: 0 },
    { day: 'Ven', volume: 9500, prs: 3 },
    { day: 'Sam', volume: 0, prs: 0 },
    { day: 'Dim', volume: 0, prs: 0 }
  ];

  const prData = [
    { exercise: 'Développé couché', weight: 80, reps: 5, date: '2024-01-15' },
    { exercise: 'Squat', weight: 120, reps: 8, date: '2024-01-12' },
    { exercise: 'Soulevé de terre', weight: 140, reps: 6, date: '2024-01-10' },
    { exercise: 'Dips', weight: 0, reps: 15, date: '2024-01-08' }
  ];

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
            <h1 className="text-3xl font-bold text-foreground">Heavy & Strong</h1>
            <p className="text-muted-foreground mt-2">
              Log tes entraînements, progresse et casse tes records
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border">
              <Target className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau workout
            </Button>
          </div>
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
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={stopRest}>
                      <Pause className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => startRest(restTime + 30)}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Current Workout */}
        {currentWorkout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5" />
                    {currentWorkout.name}
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Durée</p>
                      <p className="font-semibold">{currentWorkout.duration} min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Volume</p>
                      <p className="font-semibold">{currentWorkout.totalVolume} kg</p>
                    </div>
                    <Button className="btn-primary">
                      <Play className="w-4 h-4 mr-2" />
                      Commencer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentWorkout.exercises.map((exercise, exerciseIndex) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + exerciseIndex * 0.1 }}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                          {exercise.isPr && (
                            <Badge className="badge-warning">
                              <Trophy className="w-3 h-3 mr-1" />
                              PR
                            </Badge>
                          )}
                        </div>
                        <Badge className="badge-primary">{exercise.category}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-6 gap-2 mb-4 text-sm text-muted-foreground">
                        <span>Set</span>
                        <span>Poids</span>
                        <span>Reps</span>
                        <span>RPE</span>
                        <span>Tempo</span>
                        <span>Repos</span>
                      </div>
                      
                      <div className="space-y-2">
                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={set.id}
                            className={`grid grid-cols-6 gap-2 p-3 rounded-lg border transition-colors ${
                              set.isCompleted 
                                ? 'bg-secondary/10 border-secondary/30' 
                                : 'bg-surface border-border hover:border-primary/50'
                            }`}
                          >
                            <span className="text-sm font-medium">{setIndex + 1}</span>
                            <span className="text-sm">{set.weight} kg</span>
                            <span className="text-sm">{set.reps}</span>
                            <span className="text-sm">{set.rpe}/10</span>
                            <span className="text-sm">{set.tempo}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{set.rest}s</span>
                              {!set.isCompleted && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    completeSet(exercise.id, set.id);
                                    if (set.rest) startRest(set.rest);
                                  }}
                                  className="h-6 px-2"
                                >
                                  ✓
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Volume */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Volume hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData}>
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
                    <Bar dataKey="volume" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* PRs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Records personnels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prData.map((pr, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-surface rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{pr.exercise}</p>
                        <p className="text-sm text-muted-foreground">{pr.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {pr.weight > 0 ? `${pr.weight}kg` : 'Poids du corps'} × {pr.reps}
                        </p>
                        <Badge className="badge-warning">PR</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Workout History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle>Historique des entraînements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workoutHistory.map((workout) => (
                  <motion.div
                    key={workout.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-foreground">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workout.date).toLocaleDateString('fr-FR')} • {workout.duration} min
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Volume</p>
                        <p className="font-semibold">{workout.totalVolume.toLocaleString()} kg</p>
                      </div>
                      <Badge className={workout.isCompleted ? "badge-success" : "badge-primary"}>
                        {workout.isCompleted ? "Terminé" : "En cours"}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
