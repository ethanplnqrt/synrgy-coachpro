import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calendar, 
  TrendingUp, 
  Activity, 
  Moon, 
  Heart, 
  Scale,
  Zap,
  Target,
  BarChart3,
  Filter,
  Download
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface DailyEntry {
  date: string;
  weight: number;
  steps: number;
  sleep: number;
  energy: number;
  hunger: number;
  pain: number;
  adherence: number;
  notes: string;
  workouts: string[];
  meals: string[];
}

export default function JournalPage() {
  const { data: user } = useAuth();
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [filteredEntries, setFilteredEntries] = useState<DailyEntry[]>([]);

  // Mock data
  useEffect(() => {
    const mockEntries: DailyEntry[] = [
      {
        date: '2024-01-29',
        weight: 74.5,
        steps: 8500,
        sleep: 7.5,
        energy: 4,
        hunger: 3,
        pain: 2,
        adherence: 90,
        notes: 'Excellente séance aujourd\'hui, je me sens plus forte !',
        workouts: ['Push Day - Pecs & Triceps'],
        meals: ['Petit-déjeuner', 'Déjeuner', 'Goûter', 'Dîner']
      },
      {
        date: '2024-01-28',
        weight: 74.7,
        steps: 9200,
        sleep: 8,
        energy: 5,
        hunger: 2,
        pain: 1,
        adherence: 95,
        notes: 'Jour de repos, marche dans la nature',
        workouts: [],
        meals: ['Petit-déjeuner', 'Déjeuner', 'Dîner']
      },
      {
        date: '2024-01-27',
        weight: 74.8,
        steps: 7800,
        sleep: 6.5,
        energy: 3,
        hunger: 4,
        pain: 3,
        adherence: 75,
        notes: 'Journée difficile, moins d\'énergie',
        workouts: ['Pull Day - Dos & Biceps'],
        meals: ['Petit-déjeuner', 'Déjeuner', 'Dîner']
      },
      {
        date: '2024-01-26',
        weight: 75.0,
        steps: 10500,
        sleep: 7,
        energy: 4,
        hunger: 3,
        pain: 2,
        adherence: 85,
        notes: 'Séance cardio intense',
        workouts: ['Cardio HIIT'],
        meals: ['Petit-déjeuner', 'Déjeuner', 'Goûter', 'Dîner']
      },
      {
        date: '2024-01-25',
        weight: 75.2,
        steps: 6800,
        sleep: 8.5,
        energy: 4,
        hunger: 3,
        pain: 2,
        adherence: 80,
        notes: 'Séance de force, progression sur le développé couché',
        workouts: ['Push Day - Pecs & Triceps'],
        meals: ['Petit-déjeuner', 'Déjeuner', 'Dîner']
      },
      {
        date: '2024-01-24',
        weight: 75.1,
        steps: 9500,
        sleep: 7.5,
        energy: 5,
        hunger: 2,
        pain: 1,
        adherence: 92,
        notes: 'Meilleure séance de la semaine !',
        workouts: ['Leg Day - Quadriceps & Fessiers'],
        meals: ['Petit-déjeuner', 'Déjeuner', 'Goûter', 'Dîner']
      },
      {
        date: '2024-01-23',
        weight: 75.3,
        steps: 8200,
        sleep: 6,
        energy: 3,
        hunger: 4,
        pain: 3,
        adherence: 70,
        notes: 'Fatigue générale, séance raccourcie',
        workouts: ['Pull Day - Dos & Biceps'],
        meals: ['Petit-déjeuner', 'Déjeuner', 'Dîner']
      }
    ];
    setEntries(mockEntries);
    setFilteredEntries(mockEntries);
  }, []);

  const getPeriodData = (period: string) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return entries.filter(entry => new Date(entry.date) >= startDate);
  };

  useEffect(() => {
    setFilteredEntries(getPeriodData(selectedPeriod));
  }, [selectedPeriod, entries]);

  const getAverage = (key: keyof DailyEntry, entries: DailyEntry[]) => {
    const values = entries.map(entry => entry[key]).filter(val => typeof val === 'number') as number[];
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  };

  const getTrend = (key: keyof DailyEntry, entries: DailyEntry[]) => {
    if (entries.length < 2) return 0;
    const first = entries[0][key] as number;
    const last = entries[entries.length - 1][key] as number;
    return last - first;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-secondary';
    if (trend < 0) return 'text-danger';
    return 'text-muted-foreground';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '↗';
    if (trend < 0) return '↘';
    return '→';
  };

  const chartData = filteredEntries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    weight: entry.weight,
    steps: entry.steps,
    sleep: entry.sleep,
    energy: entry.energy,
    adherence: entry.adherence
  }));

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
            <h1 className="text-3xl font-bold text-foreground">Journal personnel</h1>
            <p className="text-muted-foreground mt-2">
              Suis ton évolution jour après jour avec des métriques détaillées
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
            <Button variant="outline" className="border-border">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Période d'analyse</h3>
                <div className="flex gap-2">
                  {['week', 'month', 'year'].map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod(period as any)}
                    >
                      {period === 'week' ? '7 jours' : period === 'month' ? '30 jours' : '1 an'}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Scale className="w-8 h-8 text-primary" />
                <span className="text-sm text-muted-foreground">Poids moyen</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {getAverage('weight', filteredEntries).toFixed(1)}kg
              </div>
              <div className={`text-sm ${getTrendColor(getTrend('weight', filteredEntries))}`}>
                {getTrendIcon(getTrend('weight', filteredEntries))} {Math.abs(getTrend('weight', filteredEntries)).toFixed(1)}kg
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-secondary" />
                <span className="text-sm text-muted-foreground">Pas moyens</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(getAverage('steps', filteredEntries)).toLocaleString()}
              </div>
              <div className={`text-sm ${getTrendColor(getTrend('steps', filteredEntries))}`}>
                {getTrendIcon(getTrend('steps', filteredEntries))} {Math.abs(getTrend('steps', filteredEntries)).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Moon className="w-8 h-8 text-info" />
                <span className="text-sm text-muted-foreground">Sommeil moyen</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {getAverage('sleep', filteredEntries).toFixed(1)}h
              </div>
              <div className={`text-sm ${getTrendColor(getTrend('sleep', filteredEntries))}`}>
                {getTrendIcon(getTrend('sleep', filteredEntries))} {Math.abs(getTrend('sleep', filteredEntries)).toFixed(1)}h
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-warning" />
                <span className="text-sm text-muted-foreground">Adhérence</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(getAverage('adherence', filteredEntries))}%
              </div>
              <div className={`text-sm ${getTrendColor(getTrend('adherence', filteredEntries))}`}>
                {getTrendIcon(getTrend('adherence', filteredEntries))} {Math.abs(getTrend('adherence', filteredEntries)).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Évolution du poids
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '8px' 
                      }} 
                    />
                    <Line type="monotone" dataKey="weight" stroke="#FF6B3D" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Activité quotidienne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '8px' 
                      }} 
                    />
                    <Bar dataKey="steps" fill="#4ADE80" />
                    <Bar dataKey="adherence" fill="#60A5FA" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Daily Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Entrées quotidiennes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {new Date(entry.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {entry.workouts.length} séance{entry.workouts.length > 1 ? 's' : ''} • {entry.meals.length} repas
                        </p>
                      </div>
                      <Badge className="badge-primary">
                        {entry.adherence}% adhérence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <Scale className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">Poids</p>
                        <p className="font-semibold">{entry.weight}kg</p>
                      </div>
                      <div className="text-center">
                        <Activity className="w-5 h-5 text-secondary mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">Pas</p>
                        <p className="font-semibold">{entry.steps.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <Moon className="w-5 h-5 text-info mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">Sommeil</p>
                        <p className="font-semibold">{entry.sleep}h</p>
                      </div>
                      <div className="text-center">
                        <Zap className="w-5 h-5 text-warning mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">Énergie</p>
                        <p className="font-semibold">{entry.energy}/5</p>
                      </div>
                    </div>

                    {entry.notes && (
                      <div className="mt-3 p-3 bg-surface rounded-lg">
                        <p className="text-sm text-foreground">{entry.notes}</p>
                      </div>
                    )}

                    {entry.workouts.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-foreground mb-2">Séances du jour:</p>
                        <div className="flex flex-wrap gap-2">
                          {entry.workouts.map((workout, idx) => (
                            <Badge key={idx} className="badge-secondary">
                              {workout}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
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
