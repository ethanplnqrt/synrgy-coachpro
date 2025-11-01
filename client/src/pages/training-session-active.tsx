import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  Target, 
  Zap,
  ArrowRight,
  Volume2,
  ChevronLeft,
  Trophy,
  Timer
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useLocation } from 'wouter';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
  tempo?: string;
  completed: boolean;
}

interface Session {
  name: string;
  exercises: Exercise[];
  totalTime: number;
}

export default function TrainingSessionActive() {
  const [, setLocation] = useLocation();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [sessionStarted, setSessionStarted] = useState(false);

  // Mock session data
  const session: Session = {
    name: 'Push Day - Pecs & Triceps',
    totalTime: 3600,
    exercises: [
      {
        id: '1',
        name: 'Développé couché',
        sets: 4,
        reps: 10,
        weight: 60,
        rest: 180,
        tempo: '2-0-1-0',
        completed: false
      },
      {
        id: '2',
        name: 'Développé incliné haltères',
        sets: 3,
        reps: 12,
        weight: 25,
        rest: 120,
        completed: false
      },
      {
        id: '3',
        name: 'Dips',
        sets: 3,
        reps: 12,
        weight: 0,
        rest: 90,
        completed: false
      }
    ]
  };

  const currentExercise = session.exercises[currentExerciseIndex];

  // Timer for session
  useEffect(() => {
    if (!sessionStarted || isPaused) return;

    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStarted, isPaused]);

  // Timer for rest
  useEffect(() => {
    if (!isResting) return;

    const interval = setInterval(() => {
      setRestTime(prev => {
        if (prev <= 1) {
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteSet = () => {
    // Mark exercise as completed
    setCompletedExercises(prev => new Set([...prev, currentExercise.id]));
    
    // Start rest timer
    setIsResting(true);
    setRestTime(currentExercise.rest);

    // Move to next exercise if all sets are done
    if (completedExercises.has(currentExercise.id)) {
      if (currentExerciseIndex < session.exercises.length - 1) {
        setTimeout(() => {
          setCurrentExerciseIndex(prev => prev + 1);
        }, currentExercise.rest * 1000);
      }
    }
  };

  const handleFinishSession = () => {
    // Calculate stats
    const totalVolume = session.exercises.reduce((acc, ex) => {
      return acc + (ex.sets * ex.reps * ex.weight);
    }, 0);

    // Store in history
    const sessionData = {
      name: session.name,
      date: new Date().toISOString(),
      duration: sessionTime,
      volume: totalVolume,
      exercises: session.exercises.length
    };

    localStorage.setItem('training_history', JSON.stringify([
      ...JSON.parse(localStorage.getItem('training_history') || '[]'),
      sessionData
    ]));

    // Redirect to summary
    setLocation('/training-session-summary');
  };

  const allExercisesCompleted = currentExerciseIndex === session.exercises.length - 1 && 
    completedExercises.has(currentExercise.id);

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="ghost"
            onClick={() => setLocation('/dashboard/athlete/training')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">{session.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatTime(sessionTime)}
              </span>
            </div>
          </div>
          <div>
            {isPaused ? (
              <Button
                variant="outline"
                onClick={() => setIsPaused(false)}
              >
                <Play className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsPaused(true)}
              >
                <Pause className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {!sessionStarted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="card bg-gradient-to-br from-primary/10 to-orange-500/10 border-primary/30">
              <CardContent className="p-12 text-center">
                <div className="inline-block p-6 rounded-full bg-gradient-to-br from-primary to-orange-500 mb-6">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Prêt à commencer ?
                </h2>
                <p className="text-muted-foreground mb-8">
                  {session.exercises.length} exercices • Temps estimé: ~45 min
                </p>
                <Button
                  size="lg"
                  className="btn-primary text-xl px-12 py-6"
                  onClick={() => setSessionStarted(true)}
                >
                  <Play className="w-6 h-6 mr-3" />
                  Démarrer la séance
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Current Exercise */}
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <Card className="card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      {currentExercise.name}
                    </CardTitle>
                    <Badge className="badge-primary">
                      {currentExerciseIndex + 1} / {session.exercises.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Exercise Details */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-surface rounded-lg">
                        <p className="text-sm text-muted-foreground">Séries</p>
                        <p className="text-2xl font-bold text-foreground">{currentExercise.sets}</p>
                      </div>
                      <div className="text-center p-4 bg-surface rounded-lg">
                        <p className="text-sm text-muted-foreground">Reps</p>
                        <p className="text-2xl font-bold text-foreground">{currentExercise.reps}</p>
                      </div>
                      <div className="text-center p-4 bg-surface rounded-lg">
                        <p className="text-sm text-muted-foreground">Charge</p>
                        <p className="text-2xl font-bold text-foreground">{currentExercise.weight}kg</p>
                      </div>
                      <div className="text-center p-4 bg-surface rounded-lg">
                        <p className="text-sm text-muted-foreground">Repos</p>
                        <p className="text-2xl font-bold text-foreground">{currentExercise.rest}s</p>
                      </div>
                    </div>

                    {/* Rest Timer */}
                    {isResting && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-8 bg-primary/10 rounded-lg border border-primary/30"
                      >
                        <Timer className="w-16 h-16 text-primary mx-auto mb-4" />
                        <p className="text-4xl font-bold text-primary mb-2">
                          {formatTime(restTime)}
                        </p>
                        <p className="text-muted-foreground">Repos</p>
                      </motion.div>
                    )}

                    {/* Action Button */}
                    {!isResting && (
                      <Button
                        size="lg"
                        className="btn-primary w-full"
                        onClick={handleCompleteSet}
                        disabled={completedExercises.has(currentExercise.id)}
                      >
                        {completedExercises.has(currentExercise.id) ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Exercice terminé
                          </>
                        ) : (
                          <>
                            <Target className="w-5 h-5 mr-2" />
                            Série terminée
                          </>
                        )}
                      </Button>
                    )}

                    {/* Next Exercise Hint */}
                    {currentExerciseIndex < session.exercises.length - 1 && (
                      <div className="text-center text-sm text-muted-foreground">
                        Prochain: {session.exercises[currentExerciseIndex + 1].name}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress Bar */}
            <Card className="card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-foreground">Progression</span>
                  <span className="text-sm text-muted-foreground">
                    {completedExercises.size} / {session.exercises.length} exercices
                  </span>
                </div>
                <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedExercises.size / session.exercises.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-primary to-orange-500"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Finish Button */}
            {allExercisesCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  size="lg"
                  className="btn-secondary w-full"
                  onClick={handleFinishSession}
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Terminer la séance
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
