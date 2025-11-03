import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Dumbbell, ArrowLeft, Loader2, Save, History } from 'lucide-react';
import { Link } from 'wouter';
import { useAppConfig } from '../lib/config';

interface Exercise {
  name: string;
  series: number;
  reps: number;
  weight: number | string;
  rest: number;
}

interface Day {
  name: string;
  exercises: Exercise[];
}

interface TrainingPlan {
  week: number;
  days: Day[];
  progression: string;
}

export default function TrainingPage() {
  const { data: config } = useAppConfig();
  const [loading, setLoading] = useState(false);
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [formData, setFormData] = useState({
    goal: '',
    level: '',
    lastPlan: ''
  });
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trainingPlan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      setTrainingPlan(data);
    } catch (e) {
      // Fallback plan
      setTrainingPlan({
        week: 1,
        days: [
          {
            name: "Jour 1 - Force",
            exercises: [
              { name: "Squat", series: 4, reps: 8, weight: 80, rest: 180 },
              { name: "Développé couché", series: 4, reps: 8, weight: 70, rest: 180 },
              { name: "Rowing barre", series: 3, reps: 10, weight: 60, rest: 120 },
              { name: "Fentes", series: 3, reps: 12, weight: "poids du corps", rest: 90 }
            ]
          },
          {
            name: "Jour 2 - Hypertrophie",
            exercises: [
              { name: "Soulevé de terre", series: 3, reps: 6, weight: 100, rest: 240 },
              { name: "Tractions", series: 3, reps: 8, weight: "poids du corps", rest: 120 },
              { name: "Dips", series: 3, reps: 10, weight: "poids du corps", rest: 120 },
              { name: "Planche", series: 3, reps: 30, weight: "secondes", rest: 60 }
            ]
          },
          {
            name: "Jour 3 - Endurance",
            exercises: [
              { name: "Burpees", series: 4, reps: 15, weight: "poids du corps", rest: 60 },
              { name: "Mountain climbers", series: 3, reps: 20, weight: "poids du corps", rest: 45 },
              { name: "Squat jumps", series: 3, reps: 12, weight: "poids du corps", rest: 60 },
              { name: "Pompes", series: 3, reps: 15, weight: "poids du corps", rest: 60 }
            ]
          },
          {
            name: "Jour 4 - Récupération",
            exercises: [
              { name: "Étirements", series: 1, reps: 20, weight: "minutes", rest: 0 },
              { name: "Yoga", series: 1, reps: 30, weight: "minutes", rest: 0 },
              { name: "Marche", series: 1, reps: 45, weight: "minutes", rest: 0 }
            ]
          }
        ],
        progression: "Augmentation de 2.5% à 5% des charges chaque semaine si ≥80% des séries sont complétées"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = (dayIndex: number, exerciseIndex: number) => {
    const key = `${dayIndex}-${exerciseIndex}`;
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    setCompletedExercises(newCompleted);
  };

  const saveSession = () => {
    if (trainingPlan) {
      const sessionData = {
        week: trainingPlan.week,
        completedExercises: Array.from(completedExercises),
        timestamp: new Date().toISOString()
      };
      
      const history = JSON.parse(localStorage.getItem('trainingHistory') || '[]');
      history.push(sessionData);
      localStorage.setItem('trainingHistory', JSON.stringify(history));
      
      alert('Séance sauvegardée ! 💾');
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/coach/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au dashboard
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Dumbbell className="w-5 h-5" />
                Génération de Programme IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goal">Objectif</Label>
                <Select value={formData.goal} onValueChange={(value) => setFormData({...formData, goal: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'objectif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="force">Force</SelectItem>
                    <SelectItem value="hypertrophie">Hypertrophie</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="perte-poids">Perte de poids</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">Niveau</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debutant">Débutant</SelectItem>
                    <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                    <SelectItem value="avance">Avancé</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lastPlan">Dernier programme</Label>
                <Select value={formData.lastPlan} onValueChange={(value) => setFormData({...formData, lastPlan: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le dernier programme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aucun">Aucun</SelectItem>
                    <SelectItem value="force">Programme Force</SelectItem>
                    <SelectItem value="hypertrophie">Programme Hypertrophie</SelectItem>
                    <SelectItem value="endurance">Programme Endurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGeneratePlan} 
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Dumbbell className="w-4 h-4 mr-2" />
                    Générer le programme
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Programme généré</CardTitle>
            </CardHeader>
            <CardContent>
              {trainingPlan ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Semaine {trainingPlan.week}</h3>
                    <p className="text-sm text-green-600 mb-4">{trainingPlan.progression}</p>
                    
                    {trainingPlan.days.map((day, dayIndex) => (
                      <div key={dayIndex} className="mb-4 p-3 border rounded">
                        <h4 className="font-medium mb-2">{day.name}</h4>
                        <div className="space-y-2">
                          {day.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="flex items-center gap-2 p-2 bg-white rounded">
                              <Checkbox
                                checked={completedExercises.has(`${dayIndex}-${exerciseIndex}`)}
                                onCheckedChange={() => toggleExercise(dayIndex, exerciseIndex)}
                              />
                              <div className="flex-1">
                                <span className="font-medium">{exercise.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  {exercise.series}x{exercise.reps} @ {exercise.weight}kg
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  Repos: {exercise.rest}s
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={saveSession}>
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder ma séance
                    </Button>
                    <Link href="/training-history">
                      <Button variant="outline" size="sm">
                        <History className="w-4 h-4 mr-2" />
                        Historique
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Dumbbell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p>Remplissez le formulaire et cliquez sur "Générer le programme"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
