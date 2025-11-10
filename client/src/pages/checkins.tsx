import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Slider } from '../components/ui/slider';
import { Heart, Moon, Zap, Target, Smile, Frown, Meh, CheckCircle2, Calendar, TrendingUp } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface CheckInData {
  mood: number;
  sleep: number;
  stress: number;
  pain: number;
  motivation: number;
  adherence: number;
  energy: number;
  notes: string;
}

interface Habit {
  id: string;
  name: string;
  target: number;
  unit: string;
  color: string;
  streak: number;
  todayValue: number;
  isCompleted: boolean;
}

export default function CheckInsPage() {
  const { data: user } = useAuth();
  const [checkInData, setCheckInData] = useState<CheckInData>({
    mood: 5,
    sleep: 7,
    stress: 5,
    pain: 1,
    motivation: 5,
    adherence: 5,
    energy: 5,
    notes: ''
  });
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock habits data
  useEffect(() => {
    const mockHabits: Habit[] = [
      {
        id: '1',
        name: 'Eau',
        target: 8,
        unit: 'verres',
        color: '#60A5FA',
        streak: 12,
        todayValue: 0,
        isCompleted: false
      },
      {
        id: '2',
        name: 'Pas',
        target: 10000,
        unit: 'pas',
        color: '#4ADE80',
        streak: 5,
        todayValue: 0,
        isCompleted: false
      },
      {
        id: '3',
        name: 'Étirements',
        target: 15,
        unit: 'min',
        color: '#F59E0B',
        streak: 8,
        todayValue: 0,
        isCompleted: false
      },
      {
        id: '4',
        name: 'Heures de coucher',
        target: 22,
        unit: 'h',
        color: '#8B5CF6',
        streak: 3,
        todayValue: 0,
        isCompleted: false
      }
    ];
    setHabits(mockHabits);
  }, []);

  const handleCheckInSubmit = () => {
    // Simulate API call
    console.log('Check-in submitted:', checkInData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleHabitUpdate = (habitId: string, value: number) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newValue = habit.todayValue + value;
        return {
          ...habit,
          todayValue: Math.max(0, Math.min(newValue, habit.target)),
          isCompleted: newValue >= habit.target
        };
      }
      return habit;
    }));
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 8) return <Smile className="w-6 h-6 text-secondary" />;
    if (mood >= 5) return <Meh className="w-6 h-6 text-warning" />;
    return <Frown className="w-6 h-6 text-danger" />;
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-secondary';
    if (mood >= 5) return 'text-warning';
    return 'text-danger';
  };

  const weeklyData = [
    { day: 'Lun', mood: 7, sleep: 7.5, energy: 6, adherence: 8 },
    { day: 'Mar', mood: 8, sleep: 8, energy: 7, adherence: 9 },
    { day: 'Mer', mood: 6, sleep: 6.5, energy: 5, adherence: 7 },
    { day: 'Jeu', mood: 9, sleep: 8.5, energy: 8, adherence: 9 },
    { day: 'Ven', mood: 7, sleep: 7, energy: 6, adherence: 8 },
    { day: 'Sam', mood: 8, sleep: 9, energy: 7, adherence: 8 },
    { day: 'Dim', mood: 6, sleep: 8, energy: 5, adherence: 6 }
  ];

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-foreground">Check-in quotidien</h1>
          <p className="text-muted-foreground mt-2">
            Comment te sens-tu aujourd'hui ? Partage ton ressenti pour un accompagnement optimal
          </p>
        </motion.div>

        {/* Check-in Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Ton ressenti du jour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mood */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getMoodIcon(checkInData.mood)}
                    <span className="font-semibold text-foreground">Humeur</span>
                  </div>
                  <span className={`text-2xl font-bold ${getMoodColor(checkInData.mood)}`}>
                    {checkInData.mood}/10
                  </span>
                </div>
                <Slider
                  value={[checkInData.mood]}
                  onValueChange={([value]) => setCheckInData(prev => ({ ...prev, mood: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Très mal</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Sleep */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-info" />
                    <span className="font-semibold text-foreground">Sommeil (heures)</span>
                  </div>
                  <span className="text-2xl font-bold text-info">
                    {checkInData.sleep}h
                  </span>
                </div>
                <Slider
                  value={[checkInData.sleep]}
                  onValueChange={([value]) => setCheckInData(prev => ({ ...prev, sleep: value }))}
                  max={12}
                  min={3}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>3h</span>
                  <span>12h</span>
                </div>
              </div>

              {/* Energy */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-warning" />
                    <span className="font-semibold text-foreground">Énergie</span>
                  </div>
                  <span className="text-2xl font-bold text-warning">
                    {checkInData.energy}/10
                  </span>
                </div>
                <Slider
                  value={[checkInData.energy]}
                  onValueChange={([value]) => setCheckInData(prev => ({ ...prev, energy: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Stress */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-danger" />
                    <span className="font-semibold text-foreground">Stress</span>
                  </div>
                  <span className="text-2xl font-bold text-danger">
                    {checkInData.stress}/10
                  </span>
                </div>
                <Slider
                  value={[checkInData.stress]}
                  onValueChange={([value]) => setCheckInData(prev => ({ ...prev, stress: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Pain */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-danger" />
                    <span className="font-semibold text-foreground">Douleur</span>
                  </div>
                  <span className="text-2xl font-bold text-danger">
                    {checkInData.pain}/10
                  </span>
                </div>
                <Slider
                  value={[checkInData.pain]}
                  onValueChange={([value]) => setCheckInData(prev => ({ ...prev, pain: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Notes (optionnel)
                </label>
                <textarea
                  value={checkInData.notes}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Comment s'est passée ta journée ? Des points particuliers à noter ?"
                  className="w-full p-3 border border-border rounded-lg bg-surface text-foreground resize-none"
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleCheckInSubmit}
                className="w-full btn-primary"
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Check-in envoyé !
                  </>
                ) : (
                  'Envoyer mon check-in'
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Habits Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Habitudes du jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 border rounded-lg transition-all ${
                      habit.isCompleted 
                        ? 'border-secondary/50 bg-secondary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: habit.color }}
                        />
                        <h4 className="font-semibold text-foreground">{habit.name}</h4>
                      </div>
                      <Badge className="badge-primary">
                        {habit.streak} jours
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Aujourd'hui</span>
                        <span className="font-semibold">
                          {habit.todayValue} / {habit.target} {habit.unit}
                        </span>
                      </div>
                      <Progress 
                        value={(habit.todayValue / habit.target) * 100} 
                        className="h-2"
                      />
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleHabitUpdate(habit.id, 1)}
                          disabled={habit.isCompleted}
                        >
                          +1
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleHabitUpdate(habit.id, -1)}
                        >
                          -1
                        </Button>
                        {habit.isCompleted && (
                          <CheckCircle2 className="w-5 h-5 text-secondary ml-auto" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Évolution de la semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
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
                    dataKey="mood" 
                    stroke="#4ADE80" 
                    fillOpacity={1} 
                    fill="url(#colorMood)" 
                    name="Humeur"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#F59E0B" 
                    fillOpacity={1} 
                    fill="url(#colorEnergy)" 
                    name="Énergie"
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
