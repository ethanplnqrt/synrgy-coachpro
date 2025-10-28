import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { TrendingUp, Users, DollarSign, Target, Loader2, AlertCircle, Download, Calendar } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

// Import Recharts components
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  clients: number;
  revenue: number;
  retention: number;
  activePrograms: number;
  monthlyRevenue: number[];
  clientGrowth: number[];
  programCompletion: number[];
  revenueByMonth: { month: string; revenue: number; clients: number }[];
  programTypes: { name: string; value: number; color: string }[];
}

export default function CoachAnalyticsPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("6months");

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('synrgy-coach-analytics');
    
    if (savedData) {
      try {
        setAnalyticsData(JSON.parse(savedData));
      } catch (e) {
        console.error('Erreur lors du chargement des analytics:', e);
      }
    }
  }, []);

  // Sauvegarder les données
  const saveAnalyticsData = (data: AnalyticsData) => {
    setAnalyticsData(data);
    localStorage.setItem('synrgy-coach-analytics', JSON.stringify(data));
  };

  // Charger les analytics depuis l'API
  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/coach/analytics');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const result = await response.json();
      saveAnalyticsData(result);
    } catch (err) {
      setError('Erreur lors du chargement des analytics');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data pour le mode démo
  const mockLoadAnalytics = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const mockData: AnalyticsData = {
        clients: 14,
        revenue: 2750,
        retention: 88,
        activePrograms: 8,
        monthlyRevenue: [1800, 2100, 1950, 2400, 2200, 2750],
        clientGrowth: [8, 10, 12, 11, 13, 14],
        programCompletion: [85, 92, 78, 88, 95, 90],
        revenueByMonth: [
          { month: "Jan", revenue: 1800, clients: 8 },
          { month: "Fév", revenue: 2100, clients: 10 },
          { month: "Mar", revenue: 1950, clients: 12 },
          { month: "Avr", revenue: 2400, clients: 11 },
          { month: "Mai", revenue: 2200, clients: 13 },
          { month: "Juin", revenue: 2750, clients: 14 }
        ],
        programTypes: [
          { name: "Perte de poids", value: 35, color: "#3B82F6" },
          { name: "Prise de muscle", value: 25, color: "#10B981" },
          { name: "Endurance", value: 20, color: "#F59E0B" },
          { name: "Récupération", value: 15, color: "#8B5CF6" },
          { name: "Nutrition", value: 5, color: "#EF4444" }
        ]
      };

      saveAnalyticsData(mockData);
      setIsLoading(false);
    }, 2000);
  };

  // Exporter les données
  const exportData = () => {
    if (!analyticsData) return;

    const csvContent = [
      ['Métrique', 'Valeur'],
      ['Clients actifs', analyticsData.clients.toString()],
      ['Revenus mensuels', analyticsData.revenue.toString()],
      ['Taux de rétention', analyticsData.retention.toString() + '%'],
      ['Programmes actifs', analyticsData.activePrograms.toString()]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-coach.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Couleurs pour les graphiques
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            📊 Analytics Coach
          </h1>
          <p className="text-muted-foreground">
            Suivez vos performances et la croissance de votre activité
          </p>
        </div>

        {/* Contrôles */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">1 mois</SelectItem>
                      <SelectItem value="3months">3 mois</SelectItem>
                      <SelectItem value="6months">6 mois</SelectItem>
                      <SelectItem value="1year">1 an</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                {config?.testMode && (
                  <Button onClick={mockLoadAnalytics} variant="secondary" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Charger démo
                  </Button>
                )}
                <Button onClick={loadAnalytics} variant="outline" size="sm" disabled={isLoading}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
                <Button onClick={exportData} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Chargement des analytics...</p>
            </CardContent>
          </Card>
        ) : analyticsData ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="revenue">Revenus</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="programs">Programmes</TabsTrigger>
            </TabsList>

            {/* Tab Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Clients actifs</p>
                        <p className="text-2xl font-bold">{analyticsData.clients}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Revenus mensuels</p>
                        <p className="text-2xl font-bold">{analyticsData.revenue}€</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Target className="h-8 w-8 text-purple-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Rétention</p>
                        <p className="text-2xl font-bold">{analyticsData.retention}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Programmes actifs</p>
                        <p className="text-2xl font-bold">{analyticsData.activePrograms}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Graphiques principaux */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution des revenus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analyticsData.revenueByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}€`, 'Revenus']} />
                        <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Croissance des clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analyticsData.revenueByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}`, 'Clients']} />
                        <Line type="monotone" dataKey="clients" stroke="#10B981" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Revenus */}
            <TabsContent value="revenue" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des revenus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={analyticsData.revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}€`, 'Revenus']} />
                      <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      +{Math.round(((analyticsData.revenue - analyticsData.monthlyRevenue[0]) / analyticsData.monthlyRevenue[0]) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Croissance</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(analyticsData.monthlyRevenue.reduce((a, b) => a + b, 0) / analyticsData.monthlyRevenue.length)}€
                    </div>
                    <div className="text-sm text-muted-foreground">Moyenne mensuelle</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {analyticsData.monthlyRevenue.reduce((a, b) => a + b, 0)}€
                    </div>
                    <div className="text-sm text-muted-foreground">Total période</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Clients */}
            <TabsContent value="clients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={analyticsData.revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}`, 'Clients']} />
                      <Line type="monotone" dataKey="clients" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rétention des clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {analyticsData.retention}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Taux de rétention moyen
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nouveaux clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        +{analyticsData.clients - analyticsData.clientGrowth[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Nouveaux cette période
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Programmes */}
            <TabsContent value="programs" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Types de programmes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.programTypes}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {analyticsData.programTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Taux de completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analyticsData.revenueByMonth.map((item, index) => ({
                        month: item.month,
                        completion: analyticsData.programCompletion[index]
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Completion']} />
                        <Line type="monotone" dataKey="completion" stroke="#8B5CF6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analyticsData.programTypes.map((program, index) => (
                  <Card key={program.name}>
                    <CardContent className="p-6 text-center">
                      <div 
                        className="w-4 h-4 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: program.color }}
                      />
                      <div className="text-2xl font-bold mb-1">{program.value}%</div>
                      <div className="text-sm text-muted-foreground">{program.name}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucune donnée analytics</h3>
              <p className="text-muted-foreground mb-4">
                Commencez à utiliser Synrgy pour voir vos analytics
              </p>
              {config?.testMode && (
                <Button onClick={mockLoadAnalytics}>
                  Charger des données de démonstration
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Erreur */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2 text-destructive">Erreur</h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation('/coach/dashboard')} variant="outline">
            Retour au dashboard
          </Button>
          <Button onClick={() => setLocation('/settings/branding')} variant="outline">
            Personnalisation
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

