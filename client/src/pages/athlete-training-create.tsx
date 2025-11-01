import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useLocation } from 'wouter';
import { 
  Dumbbell, 
  Target, 
  Calendar, 
  Zap,
  Settings,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';

export default function AthleteTrainingCreate() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    level: '',
    sessionsPerWeek: 4,
    availableDays: [] as string[],
    equipment: [] as string[],
    timePerSession: 60
  });

  const goals = [
    { id: 'mass', label: 'Prise de masse', icon: Target },
    { id: 'strength', label: 'Force', icon: Zap },
    { id: 'endurance', label: 'Endurance', icon: Dumbbell },
    { id: 'toning', label: 'Tonification', icon: CheckCircle2 }
  ];

  const levels = [
    { id: 'beginner', label: 'Débutant' },
    { id: 'intermediate', label: 'Intermédiaire' },
    { id: 'advanced', label: 'Avancé' }
  ];

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const handleGeneratePlan = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store the created plan
    localStorage.setItem('athlete_training_plan', JSON.stringify({
      ...formData,
      created: true
    }));
    
    // Redirect to training page
    setLocation('/dashboard/athlete/training');
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-foreground">
            Créer mon programme d'entraînement
          </h1>
          <p className="text-muted-foreground mt-2">
            L'IA va générer un plan personnalisé selon tes besoins
          </p>
        </motion.div>

        {/* Steps */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Quel est ton objectif principal ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map((goal) => {
                    const Icon = goal.icon;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => setFormData(prev => ({ ...prev, goal: goal.id }))}
                        className={`p-6 border rounded-lg transition-all text-left ${
                          formData.goal === goal.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className="w-8 h-8 mb-3 text-primary" />
                        <h3 className="font-semibold text-foreground">{goal.label}</h3>
                      </button>
                    );
                  })}
                </div>
                <Button
                  className="w-full btn-primary mt-6"
                  onClick={() => setStep(2)}
                  disabled={!formData.goal}
                >
                  Continuer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle>Informations complémentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Level */}
                <div>
                  <Label>Ton niveau</Label>
                  <div className="flex gap-3 mt-2">
                    {levels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setFormData(prev => ({ ...prev, level: level.id }))}
                        className={`flex-1 p-3 border rounded-lg transition-all ${
                          formData.level === level.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sessions per week */}
                <div>
                  <Label>Nombre de séances par semaine</Label>
                  <div className="flex gap-2 mt-2">
                    {[3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => setFormData(prev => ({ ...prev, sessionsPerWeek: num }))}
                        className={`flex-1 p-3 border rounded-lg transition-all ${
                          formData.sessionsPerWeek === num
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time per session */}
                <div>
                  <Label>Temps disponible par séance</Label>
                  <div className="flex gap-2 mt-2">
                    {[45, 60, 90, 120].map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData(prev => ({ ...prev, timePerSession: time }))}
                        className={`flex-1 p-3 border rounded-lg transition-all ${
                          formData.timePerSession === time
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {time} min
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Retour
                  </Button>
                  <Button
                    className="flex-1 btn-primary"
                    onClick={handleGeneratePlan}
                    disabled={!formData.level}
                  >
                    Générer mon plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
