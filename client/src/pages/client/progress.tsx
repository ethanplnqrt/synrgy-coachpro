import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  TrendingUp, 
  Camera, 
  Upload,
  Calendar,
  Target,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { PageWrapper } from '../../components/PageWrapper';
import { useAuth } from '../../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useLocation } from 'wouter';

export default function ClientProgress() {
  const { data: user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock progression data
  const weightData = [
    { date: '2024-01-01', weight: 78 },
    { date: '2024-01-08', weight: 77.5 },
    { date: '2024-01-15', weight: 77 },
    { date: '2024-01-22', weight: 76.5 },
    { date: '2024-01-29', weight: 76 },
    { date: '2024-02-05', weight: 75.5 },
    { date: '2024-02-12', weight: 75.2 }
  ];

  const progressPhotos = [
    { id: 1, date: '2024-01-01', weight: 78, type: 'before' },
    { id: 2, date: '2024-02-12', weight: 75.2, type: 'after' }
  ];

  const stats = {
    currentWeight: 75.2,
    startingWeight: 78,
    weightLoss: -2.8,
    adherence: 87,
    workoutsCompleted: 12,
    totalWorkouts: 14
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Ma progression
            </h1>
            <p className="text-muted-foreground mt-2">
              Suis ton évolution au fil du temps
            </p>
          </div>
          <Button
            className="btn-primary"
            onClick={() => setLocation('/progress-photos')}
          >
            <Upload className="w-4 h-4 mr-2" />
            Ajouter une photo
          </Button>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Poids actuel</p>
                  <p className="text-2xl font-bold text-foreground">{stats.currentWeight} kg</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowDown className="w-4 h-4 text-secondary" />
                    <span className="text-sm text-secondary">
                      {Math.abs(stats.weightLoss)} kg
                    </span>
                  </div>
                </div>
                <Target className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Adhérence</p>
                  <p className="text-2xl font-bold text-foreground">{stats.adherence}%</p>
                  <p className="text-sm text-muted-foreground mt-1">12/14 séances</p>
                </div>
                <BarChart3 className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Perte totale</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.abs(stats.weightLoss)} kg
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Depuis début</p>
                </div>
                <TrendingUp className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Photos</p>
                  <p className="text-2xl font-bold text-foreground">{progressPhotos.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Avant/Après</p>
                </div>
                <Camera className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weight Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
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
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111827', 
                      border: '1px solid #1F2937',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#4ADE80" 
                    fillOpacity={1} 
                    fill="url(#colorWeight)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Progress Photos */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photos de progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground capitalize">
                          {photo.type === 'before' ? '📸 Début' : '🎯 Maintenant'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(photo.date).toLocaleDateString('fr-FR')} - {photo.weight} kg
                        </p>
                      </div>
                      <Badge className={photo.type === 'before' ? 'badge-muted' : 'badge-success'}>
                        {photo.type === 'before' ? 'Avant' : 'Après'}
                      </Badge>
                    </div>
                    <div className="w-full h-48 bg-surface rounded-lg flex items-center justify-center">
                      <Camera className="w-12 h-12 text-muted-foreground opacity-30" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Coach Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card bg-secondary/10 border-secondary/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  AD
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    💬 Feedback de ton coach Alexandre
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Excellente progression cette semaine ! Continue sur cette lancée. Je vais ajuster légèrement ton programme pour la semaine prochaine. On augmente le volume sur les jambes de 10%."
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString('fr-FR')} - 14:30
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
