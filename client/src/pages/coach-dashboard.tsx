import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Camera,
  Target,
  Zap,
  BarChart3,
  Clock,
  Heart
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'wouter';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Athlete {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'paused' | 'ai_tracking';
  lastCheckIn: string;
  progress: number;
  alerts: Alert[];
  coachId: string;
}

interface Alert {
  id: string;
  type: 'weight_stagnation' | 'fatigue' | 'low_adherence' | 'nutrition_issue';
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface AIApproval {
  id: string;
  athleteId: string;
  athleteName: string;
  type: 'nutrition' | 'training';
  suggestion: string;
  currentValue: string;
  proposedValue: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function CoachDashboard() {
  const { data: user } = useAuth();
  const [, setLocation] = useLocation();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [aiApprovals, setAiApprovals] = useState<AIApproval[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);

  // Mock data
  useEffect(() => {
    const mockAthletes: Athlete[] = [
      {
        id: '1',
        name: 'Léa Martin',
        avatar: 'https://ui-avatars.com/api/?name=Léa+Martin&background=4ADE80&color=fff',
        status: 'active',
        lastCheckIn: 'Aujourd\'hui',
        progress: 85,
        coachId: user?.id || 'coach_1',
        alerts: [
          {
            id: '1',
            type: 'weight_stagnation',
            message: 'Stagnation du poids depuis 2 semaines',
            priority: 'medium',
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '2',
        name: 'Maxime Dubois',
        avatar: 'https://ui-avatars.com/api/?name=Maxime+Dubois&background=F59E0B&color=fff',
        status: 'ai_tracking',
        lastCheckIn: 'Hier',
        progress: 72,
        coachId: user?.id || 'coach_1',
        alerts: [
          {
            id: '2',
            type: 'fatigue',
            message: 'Niveau de fatigue élevé (4/5)',
            priority: 'high',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            type: 'low_adherence',
            message: 'Adhérence faible cette semaine (65%)',
            priority: 'high',
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '3',
        name: 'Sarah Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=60A5FA&color=fff',
        status: 'active',
        lastCheckIn: 'Aujourd\'hui',
        progress: 91,
        coachId: user?.id || 'coach_1',
        alerts: []
      }
    ];
    setAthletes(mockAthletes);

    const mockApprovals: AIApproval[] = [
      {
        id: '1',
        athleteId: '1',
        athleteName: 'Léa Martin',
        type: 'nutrition',
        suggestion: 'Augmenter les calories de 5%',
        currentValue: '2500 kcal',
        proposedValue: '2625 kcal',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        athleteId: '2',
        athleteName: 'Maxime Dubois',
        type: 'training',
        suggestion: 'Semaine de deload recommandée',
        currentValue: 'Volume normal',
        proposedValue: 'Volume -30%',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
    setAiApprovals(mockApprovals);
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'paused': return 'badge-warning';
      case 'ai_tracking': return 'badge-primary';
      default: return 'badge-primary';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'weight_stagnation': return <TrendingUp className="w-4 h-4" />;
      case 'fatigue': return <Heart className="w-4 h-4" />;
      case 'low_adherence': return <Target className="w-4 h-4" />;
      case 'nutrition_issue': return <Zap className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-danger';
      case 'medium': return 'text-warning';
      case 'low': return 'text-info';
      default: return 'text-muted-foreground';
    }
  };

  const handleApproval = (approvalId: string, action: 'approve' | 'reject') => {
    setAiApprovals(prev => 
      prev.map(approval => 
        approval.id === approvalId 
          ? { ...approval, status: action === 'approve' ? 'approved' : 'rejected' }
          : approval
      )
    );
  };

  const weeklyData = [
    { day: 'Lun', adherence: 85, progress: 78, energy: 6 },
    { day: 'Mar', adherence: 92, progress: 82, energy: 7 },
    { day: 'Mer', adherence: 78, progress: 75, energy: 5 },
    { day: 'Jeu', adherence: 88, progress: 80, energy: 6 },
    { day: 'Ven', adherence: 95, progress: 85, energy: 8 },
    { day: 'Sam', adherence: 82, progress: 78, energy: 6 },
    { day: 'Dim', adherence: 90, progress: 83, energy: 7 }
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
            <h1 className="text-3xl font-bold text-foreground">
              👋 Bonjour {user?.fullName || 'Coach'}, prêt à guider tes athlètes ?
            </h1>
            <p className="text-muted-foreground mt-2">
              Voici un aperçu de tes athlètes et les suggestions IA en attente
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button className="btn-primary">
              <Users className="w-4 h-4 mr-2" />
              Nouveau client
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
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
                  <p className="text-sm text-muted-foreground">Athlètes actifs</p>
                  <p className="text-2xl font-bold text-foreground">
                    {athletes.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Suggestions IA</p>
                  <p className="text-2xl font-bold text-foreground">
                    {aiApprovals.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <Brain className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Adhérence moyenne</p>
                  <p className="text-2xl font-bold text-foreground">87%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alertes</p>
                  <p className="text-2xl font-bold text-foreground">
                    {athletes.reduce((acc, athlete) => acc + athlete.alerts.length, 0)}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Athletes List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  📊 À suivre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {athletes.map((athlete) => (
                    <motion.div
                      key={athlete.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAthlete === athlete.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedAthlete(athlete.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={athlete.avatar} 
                            alt={athlete.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h3 className="font-semibold text-foreground">{athlete.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Dernier check-in: {athlete.lastCheckIn}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(athlete.status)}>
                            {athlete.status}
                          </Badge>
                          {athlete.alerts.length > 0 && (
                            <Badge className="badge-danger">
                              {athlete.alerts.length} alerte{athlete.alerts.length > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progression</span>
                          <span className="font-semibold">{athlete.progress}%</span>
                        </div>
                        <div className="w-full bg-surface rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${athlete.progress}%` }}
                          />
                        </div>
                      </div>

                      {athlete.alerts.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {athlete.alerts.map((alert) => (
                            <div key={alert.id} className="flex items-center gap-2 text-sm">
                              {getAlertIcon(alert.type)}
                              <span className={getAlertColor(alert.priority)}>
                                {alert.message}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setLocation(`/coach/client/${athlete.id}`)}
                        >
                          Ouvrir fiche
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Approvals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  📬 Boîte IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiApprovals.filter(a => a.status === 'pending').map((approval) => (
                    <motion.div
                      key={approval.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{approval.athleteName}</h4>
                          <Badge className="badge-primary">
                            {approval.type === 'nutrition' ? 'Nutrition' : 'Entraînement'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {approval.suggestion}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <span className="line-through">{approval.currentValue}</span>
                          <span className="mx-2">→</span>
                          <span className="text-secondary">{approval.proposedValue}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="btn-primary flex-1"
                          onClick={() => handleApproval(approval.id, 'approve')}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproval(approval.id, 'reject')}
                        >
                          Refuser
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {aiApprovals.filter(a => a.status === 'pending').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aucune suggestion en attente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Évolution hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
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
                  <Line type="monotone" dataKey="adherence" stroke="#4ADE80" strokeWidth={2} name="Adhérence" />
                  <Line type="monotone" dataKey="progress" stroke="#60A5FA" strokeWidth={2} name="Progression" />
                  <Line type="monotone" dataKey="energy" stroke="#F59E0B" strokeWidth={2} name="Énergie" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}