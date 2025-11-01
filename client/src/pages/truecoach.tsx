import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Users, MessageSquare, CheckCircle2, AlertCircle, Brain, TrendingUp, Calendar, Target } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { MessagePanel } from '../components/MessagePanel';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface CheckIn {
  id: string;
  athleteName: string;
  date: string;
  mood: number;
  sleep: number;
  stress: number;
  pain: number;
  motivation: number;
  adherence: number;
  energy: number;
  notes: string;
  needsAttention: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'coach' | 'athlete' | 'ai_generated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  athleteName?: string;
}

interface Athlete {
  id: string;
  name: string;
  avatar: string;
  status: 'progressing' | 'struggling' | 'plateau';
  lastCheckIn: string;
  nextSession: string;
  progress: number;
  goals: string[];
}

export default function TrueCoachPage() {
  const { data: user } = useAuth();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);

  // Mock data
  useEffect(() => {
    const mockCheckIns: CheckIn[] = [
      {
        id: '1',
        athleteName: 'Léa Martin',
        date: new Date().toISOString(),
        mood: 8,
        sleep: 7.5,
        stress: 3,
        pain: 2,
        motivation: 9,
        adherence: 8,
        energy: 7,
        notes: 'Excellente séance aujourd\'hui, je me sens plus forte !',
        needsAttention: false
      },
      {
        id: '2',
        athleteName: 'Maxime Dubois',
        date: new Date().toISOString(),
        mood: 4,
        sleep: 6,
        stress: 7,
        pain: 5,
        motivation: 5,
        adherence: 6,
        energy: 4,
        notes: 'Difficile de tenir le rythme cette semaine, je stagne sur le développé couché.',
        needsAttention: true
      },
      {
        id: '3',
        athleteName: 'Sarah Johnson',
        date: new Date().toISOString(),
        mood: 6,
        sleep: 8,
        stress: 4,
        pain: 3,
        motivation: 7,
        adherence: 7,
        energy: 6,
        notes: 'Progression lente mais régulière, j\'ai besoin de plus de conseils nutritionnels.',
        needsAttention: false
      }
    ];
    setCheckIns(mockCheckIns);

    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Réévaluer le plan de Maxime',
        description: 'Stagnation sur le développé couché depuis 2 semaines',
        type: 'ai_generated',
        priority: 'high',
        status: 'pending',
        athleteName: 'Maxime Dubois'
      },
      {
        id: '2',
        title: 'Encourager Sarah',
        description: 'Proposer des alternatives nutritionnelles plus simples',
        type: 'ai_generated',
        priority: 'medium',
        status: 'pending',
        athleteName: 'Sarah Johnson'
      },
      {
        id: '3',
        title: 'Programmer deload pour Léa',
        description: 'Progression excellente, proposer une semaine de récupération',
        type: 'coach',
        priority: 'low',
        status: 'pending',
        athleteName: 'Léa Martin'
      }
    ];
    setTasks(mockTasks);

    const mockAthletes: Athlete[] = [
      {
        id: '1',
        name: 'Léa Martin',
        avatar: 'https://ui-avatars.com/api/?name=Léa+Martin&background=4ADE80&color=fff',
        status: 'progressing',
        lastCheckIn: 'Aujourd\'hui',
        nextSession: 'Demain 14h',
        progress: 85,
        goals: ['Prise de masse', 'Force']
      },
      {
        id: '2',
        name: 'Maxime Dubois',
        avatar: 'https://ui-avatars.com/api/?name=Maxime+Dubois&background=F59E0B&color=fff',
        status: 'struggling',
        lastCheckIn: 'Aujourd\'hui',
        nextSession: 'Mercredi 16h',
        progress: 60,
        goals: ['Endurance', 'Perte de graisse']
      },
      {
        id: '3',
        name: 'Sarah Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=60A5FA&color=fff',
        status: 'plateau',
        lastCheckIn: 'Aujourd\'hui',
        nextSession: 'Vendredi 10h',
        progress: 72,
        goals: ['Remise en forme', 'Tonification']
      }
    ];
    setAthletes(mockAthletes);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'progressing': return 'badge-success';
      case 'struggling': return 'badge-danger';
      case 'plateau': return 'badge-warning';
      default: return 'badge-primary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'badge-danger';
      case 'high': return 'badge-warning';
      case 'medium': return 'badge-primary';
      case 'low': return 'badge-secondary';
      default: return 'badge-primary';
    }
  };

  const adherenceData = [
    { week: 'S1', adherence: 85, mood: 7, energy: 6 },
    { week: 'S2', adherence: 78, mood: 6, energy: 5 },
    { week: 'S3', adherence: 92, mood: 8, energy: 7 },
    { week: 'S4', adherence: 88, mood: 7, energy: 6 },
    { week: 'S5', adherence: 95, mood: 9, energy: 8 }
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
            <h1 className="text-3xl font-bold text-foreground">TrueCoach</h1>
            <p className="text-muted-foreground mt-2">
              Relation humaine, check-ins et accompagnement personnalisé
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border">
              <Calendar className="w-4 h-4 mr-2" />
              Planning
            </Button>
            <Button className="btn-primary">
              <MessageSquare className="w-4 h-4 mr-2" />
              Nouveau message
            </Button>
          </div>
        </motion.div>

        {/* Athletes Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Athlètes à suivre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {athletes.map((athlete) => (
                  <motion.div
                    key={athlete.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAthlete === athlete.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedAthlete(athlete.id)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={athlete.avatar} 
                        alt={athlete.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">{athlete.name}</h3>
                        <Badge className={getStatusColor(athlete.status)}>
                          {athlete.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-semibold">{athlete.progress}%</span>
                      </div>
                      <Progress value={athlete.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        <p>Dernier check-in: {athlete.lastCheckIn}</p>
                        <p>Prochaine séance: {athlete.nextSession}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Check-ins à traiter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Check-ins à traiter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checkIns.map((checkIn) => (
                    <motion.div
                      key={checkIn.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border rounded-lg ${
                        checkIn.needsAttention 
                          ? 'border-danger/50 bg-danger/5' 
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground">{checkIn.athleteName}</h4>
                        {checkIn.needsAttention && (
                          <Badge className="badge-danger">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Attention
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Humeur</span>
                          <span className="font-semibold">{checkIn.mood}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sommeil</span>
                          <span className="font-semibold">{checkIn.sleep}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stress</span>
                          <span className="font-semibold">{checkIn.stress}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Motivation</span>
                          <span className="font-semibold">{checkIn.motivation}/10</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{checkIn.notes}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Répondre
                        </Button>
                        <Button size="sm" className="btn-primary">
                          Analyser
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tâches IA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Tâches IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          {task.athleteName && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Athlète: {task.athleteName}
                            </p>
                          )}
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Voir détails
                        </Button>
                        <Button size="sm" className="btn-primary">
                          Traiter
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Communication & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messagerie contextuelle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MessagePanel role="coach" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Adhérence & Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={adherenceData}>
                    <defs>
                      <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
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
                      dataKey="adherence" 
                      stroke="#4ADE80" 
                      fillOpacity={1} 
                      fill="url(#colorAdherence)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-secondary">92%</p>
                    <p className="text-sm text-muted-foreground">Adhérence moyenne</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">7.8</p>
                    <p className="text-sm text-muted-foreground">Humeur moyenne</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-info">6.4</p>
                    <p className="text-sm text-muted-foreground">Énergie moyenne</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
