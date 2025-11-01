import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Dumbbell, 
  Clock, 
  Target, 
  CheckCircle2, 
  Play,
  Calendar
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useLocation } from 'wouter';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rpe: number;
  rest: number;
  notes?: string;
}

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: Exercise[];
}

export default function ClientTraining() {
  const [, setLocation] = useLocation();

  // Mock workout data
  const workout: Workout = {
    id: '1',
    name: 'Push Day - Pecs & Triceps',
    date: 'Demain 14h00',
    duration: 60,
    exercises: [
      {
        id: '1',
        name: 'Développé couché',
        sets: 4,
        reps: 10,
        weight: 60,
        rpe: 7,
        rest: 180,
        notes: 'Focus sur la phase négative'
      },
      {
        id: '2',
        name: 'Développé incliné haltères',
        sets: 3,
        reps: 12,
        weight: 25,
        rpe: 8,
        rest: 120
      },
      {
        id: '3',
        name: 'Dips',
        sets: 3,
        reps: 12,
        weight: 0,
        rpe: 7,
        rest: 90
      },
      {
        id: '4',
        name: 'Extension triceps',
        sets: 3,
        reps: 15,
        weight: 15,
        rpe: 6,
        rest: 60
      }
    ]
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Mon programme d'entraînement
            </h1>
            <p className="text-muted-foreground mt-2">
              Programme créé par ton coach Alexandre
            </p>
          </div>
          <Button variant="outline" className="border-border">
            <Calendar className="w-4 h-4 mr-2" />
            Planning
          </Button>
        </motion.div>

        {/* Workout Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  {workout.name}
                </CardTitle>
                <Badge className="badge-primary">
                  <Clock className="w-3 h-3 mr-1" />
                  {workout.duration} min
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Séance prévue : {workout.date}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workout.exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-4 border border-border rounded-lg bg-surface"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">{index + 1}</span>
                        </div>
                        <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Séries</p>
                        <p className="font-semibold text-foreground">{exercise.sets}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Reps</p>
                        <p className="font-semibold text-foreground">{exercise.reps}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Poids</p>
                        <p className="font-semibold text-foreground">{exercise.weight}kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Repos</p>
                        <p className="font-semibold text-foreground">{exercise.rest}s</p>
                      </div>
                    </div>
                    {exercise.notes && (
                      <div className="mt-3 p-2 bg-info/10 rounded text-sm text-foreground">
                        💡 {exercise.notes}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Button 
                  className="w-full btn-primary"
                  onClick={() => {
                    // Navigate to workout execution or log
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Commencer la séance
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Progression cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <span className="text-sm text-muted-foreground">Séances complétées</span>
                  <span className="font-semibold text-foreground">3/4</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <span className="text-sm text-muted-foreground">Développé couché</span>
                  <span className="font-semibold text-secondary">+2.5kg cette semaine</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <span className="text-sm text-muted-foreground">Volume total</span>
                  <span className="font-semibold text-foreground">8,450 kg</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
