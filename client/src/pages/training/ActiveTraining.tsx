import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useLocation } from "wouter";
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Trophy,
  Target,
  Zap
} from "lucide-react";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number | string;
  rest: number;
}

interface Workout {
  name: string;
  exercises: Exercise[];
}

export default function ActiveTraining({ workout }: { workout?: Workout }) {
  const [, setLocation] = useLocation();
  const [currentSet, setCurrentSet] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Mock workout if not provided
  const mockWorkout: Workout = workout || {
    name: "Full Body - IA Adaptive",
    exercises: [
      { name: "Développé couché", sets: 4, reps: 10, weight: 70, rest: 90 },
      { name: "Squat", sets: 4, reps: 12, weight: 90, rest: 120 },
      { name: "Tractions", sets: 3, reps: 8, weight: "Corps", rest: 75 },
      { name: "Gainage", sets: 3, reps: "60s", weight: "-", rest: 60 }
    ]
  };

  const currentExercise = mockWorkout.exercises[currentSet];

  const handleCompleteSet = () => {
    const newData = [...sessionData, { 
      ...currentExercise, 
      completed: true,
      timestamp: new Date().toISOString()
    }];
    setSessionData(newData);

    if (currentSet < mockWorkout.exercises.length - 1) {
      setCurrentSet(currentSet + 1);
      setIsResting(true);
      setRestTime(mockWorkout.exercises[currentSet].rest || 60);
    } else {
      // Training completed
      handleFinishWorkout(newData);
    }
  };

  const handleFinishWorkout = (data: any[]) => {
    // Store in localStorage
    const workoutHistory = JSON.parse(localStorage.getItem('workout_history') || '[]');
    workoutHistory.push({
      name: mockWorkout.name,
      date: new Date().toISOString(),
      exercises: data,
      duration: Math.floor(Math.random() * 60 + 30) // Mock duration
    });
    localStorage.setItem('workout_history', JSON.stringify(workoutHistory));

    // Redirect to feedback
    setLocation('/training/feedback');
  };

  useEffect(() => {
    if (isResting && restTime > 0) {
      const timer = setTimeout(() => setRestTime(restTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isResting && restTime === 0) {
      setIsResting(false);
    }
  }, [isResting, restTime]);

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="card bg-gradient-to-br from-primary/10 to-orange-500/10 border-primary/30">
            <CardContent className="p-8 text-center">
              <div className="inline-block p-6 rounded-full bg-gradient-to-br from-primary to-orange-500 mb-6">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {mockWorkout.name}
              </h2>
              <p className="text-muted-foreground mb-6">
                {mockWorkout.exercises.length} exercices • Temps estimé: ~45 min
              </p>
              <Button
                size="lg"
                className="btn-primary text-xl px-12 py-6"
                onClick={() => setSessionStarted(true)}
              >
                Démarrer l'entraînement
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Current Exercise */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSet}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <Card className="card">
              <CardContent className="p-8">
                {!isResting ? (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Badge className="badge-primary">
                        Série {currentSet + 1} / {mockWorkout.exercises.length}
                      </Badge>
                    </div>
                    
                    <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-foreground mb-3">
                      {currentExercise.name}
                    </h2>
                    
                    <div className="grid grid-cols-3 gap-4 my-6">
                      <div className="p-4 bg-surface rounded-lg">
                        <p className="text-sm text-muted-foreground">Séries</p>
                        <p className="text-2xl font-bold text-foreground">{currentExercise.sets}</p>
                      </div>
                      <div className="p-4 bg-surface rounded-lg">
                        <p className="text-sm text-muted-foreground">Reps</p>
                        <p className="text-2xl font-bold text-foreground">{currentExercise.reps}</p>
                      </div>
                      <div className="p-4 bg-surface rounded-lg">
                        <p className="text-sm text-muted-foreground">Poids</p>
                        <p className="text-2xl font-bold text-primary">{currentExercise.weight}</p>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="btn-primary w-full"
                      onClick={handleCompleteSet}
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Série terminée
                    </Button>
                  </>
                ) : (
                  <div>
                    <Clock className="w-20 h-20 text-warning mx-auto mb-6 animate-pulse" />
                    <p className="text-lg text-muted-foreground mb-4">Temps de repos</p>
                    <h3 className="text-6xl font-bold text-warning mb-2">{restTime}</h3>
                    <p className="text-sm text-muted-foreground">secondes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Progress */}
        <div className="text-sm text-muted-foreground">
          Progress: {sessionData.length} / {mockWorkout.exercises.length} séries
        </div>
      </motion.div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${className}`}>
      {children}
    </span>
  );
}
