import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Heart, Activity, Zap, Clock, TrendingUp, Wifi, WifiOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface HealthData {
  steps: number;
  calories: number;
  heartRate: number;
  sleep: number;
  water: number;
  lastSync: Date;
  connected: boolean;
}

interface Tracker {
  id: string;
  name: string;
  type: "fitbit" | "apple" | "google" | "manual";
  connected: boolean;
  lastSync: Date;
}

export default function HealthTrackersPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    calories: 0,
    heartRate: 0,
    sleep: 0,
    water: 0,
    lastSync: new Date(),
    connected: false
  });
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('synrgy-health-data');
    const savedTrackers = localStorage.getItem('synrgy-trackers');
    
    if (savedData) {
      try {
        setHealthData(JSON.parse(savedData));
      } catch (e) {
        console.error('Erreur lors du chargement des données santé:', e);
      }
    }
    
    if (savedTrackers) {
      try {
        setTrackers(JSON.parse(savedTrackers));
      } catch (e) {
        console.error('Erreur lors du chargement des trackers:', e);
      }
    }
  }, []);

  // Sauvegarder les données
  const saveData = (data: HealthData) => {
    setHealthData(data);
    localStorage.setItem('synrgy-health-data', JSON.stringify(data));
  };

  const saveTrackers = (trackers: Tracker[]) => {
    setTrackers(trackers);
    localStorage.setItem('synrgy-trackers', JSON.stringify(trackers));
  };

  const connectTracker = async (type: "fitbit" | "apple" | "google") => {
    setIsConnecting(true);
    setError(null);

    try {
      const response = await fetch('/api/trackers/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la connexion');
      }

      const result = await response.json();
      
      const newTracker: Tracker = {
        id: Date.now().toString(),
        name: result.name,
        type,
        connected: true,
        lastSync: new Date()
      };

      const updatedTrackers = [...trackers.filter(t => t.type !== type), newTracker];
      saveTrackers(updatedTrackers);
      
      // Simuler la récupération de données
      setTimeout(() => {
        syncHealthData();
      }, 1000);
      
    } catch (err) {
      setError('Erreur lors de la connexion du tracker');
    } finally {
      setIsConnecting(false);
    }
  };

  const syncHealthData = async () => {
    try {
      const response = await fetch('/api/trackers/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la synchronisation');
      }

      const result = await response.json();
      saveData({
        ...result,
        lastSync: new Date(),
        connected: true
      });
    } catch (err) {
      setError('Erreur lors de la synchronisation');
    }
  };

  const mockConnectTracker = (type: "fitbit" | "apple" | "google") => {
    setIsConnecting(true);
    setError(null);

    setTimeout(() => {
      const trackerNames = {
        fitbit: "Fitbit Charge 5",
        apple: "Apple Watch Series 9",
        google: "Google Pixel Watch"
      };

      const newTracker: Tracker = {
        id: Date.now().toString(),
        name: trackerNames[type],
        type,
        connected: true,
        lastSync: new Date()
      };

      const updatedTrackers = [...trackers.filter(t => t.type !== type), newTracker];
      saveTrackers(updatedTrackers);

      // Simuler des données de santé
      const mockData: HealthData = {
        steps: Math.floor(Math.random() * 5000) + 8000,
        calories: Math.floor(Math.random() * 500) + 1500,
        heartRate: Math.floor(Math.random() * 20) + 65,
        sleep: Math.floor(Math.random() * 2) + 7,
        water: Math.floor(Math.random() * 3) + 6,
        lastSync: new Date(),
        connected: true
      };

      saveData(mockData);
      setIsConnecting(false);
    }, 2000);
  };

  const mockSyncData = () => {
    const mockData: HealthData = {
      steps: Math.floor(Math.random() * 2000) + 9000,
      calories: Math.floor(Math.random() * 300) + 1600,
      heartRate: Math.floor(Math.random() * 15) + 70,
      sleep: Math.floor(Math.random() * 1.5) + 7.5,
      water: Math.floor(Math.random() * 2) + 7,
      lastSync: new Date(),
      connected: true
    };

    saveData(mockData);
  };

  const disconnectTracker = (id: string) => {
    const updatedTrackers = trackers.map(tracker => 
      tracker.id === id ? { ...tracker, connected: false } : tracker
    );
    saveTrackers(updatedTrackers);
    
    saveData({
      ...healthData,
      connected: false
    });
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            📊 Trackers Santé Connectés
          </h1>
          <p className="text-muted-foreground">
            Synchronisez vos données de santé depuis vos appareils connectés
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="trackers">Mes Trackers</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Tab Tableau de bord */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Widget principal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Données du jour
                  </span>
                  <div className="flex items-center gap-2">
                    {healthData.connected ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Wifi className="w-4 h-4" />
                        <span className="text-sm">Connecté</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <WifiOff className="w-4 h-4" />
                        <span className="text-sm">Déconnecté</span>
                      </div>
                    )}
                    <Button onClick={syncHealthData} variant="outline" size="sm">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Sync
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{healthData.steps.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Pas</div>
                    <div className="text-xs text-blue-500 mt-1">🎯 Objectif: 10,000</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{healthData.calories}</div>
                    <div className="text-sm text-muted-foreground">Calories</div>
                    <div className="text-xs text-red-500 mt-1">🔥 Brûlées</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{healthData.heartRate}</div>
                    <div className="text-sm text-muted-foreground">BPM</div>
                    <div className="text-xs text-green-500 mt-1">❤️ Rythme</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{healthData.sleep}h</div>
                    <div className="text-sm text-muted-foreground">Sommeil</div>
                    <div className="text-xs text-purple-500 mt-1">😴 Nuit</div>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-600">{healthData.water}L</div>
                    <div className="text-sm text-muted-foreground">Eau</div>
                    <div className="text-xs text-cyan-500 mt-1">💧 Bu</div>
                  </div>
                </div>
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Dernière synchronisation: {healthData.lastSync.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            {/* Graphiques de tendance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Activité cette semaine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{day}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 3000) + 7000}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Rythme cardiaque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rythme de repos</span>
                      <span className="font-semibold text-green-600">65 BPM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rythme moyen</span>
                      <span className="font-semibold text-blue-600">78 BPM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rythme max</span>
                      <span className="font-semibold text-red-600">145 BPM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Zone cardio</span>
                      <span className="font-semibold text-purple-600">45 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Mes Trackers */}
          <TabsContent value="trackers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Trackers connectés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trackers disponibles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: "fitbit" as const, name: "Fitbit", icon: "⌚", color: "bg-blue-500" },
                    { type: "apple" as const, name: "Apple Health", icon: "🍎", color: "bg-gray-500" },
                    { type: "google" as const, name: "Google Fit", icon: "📱", color: "bg-green-500" }
                  ].map((tracker) => {
                    const isConnected = trackers.some(t => t.type === tracker.type && t.connected);
                    return (
                      <Card key={tracker.type} className={`${isConnected ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{tracker.icon}</span>
                              <span className="font-medium">{tracker.name}</span>
                            </div>
                            {isConnected ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">Connecté</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-500">
                                <WifiOff className="w-4 h-4" />
                                <span className="text-sm">Non connecté</span>
                              </div>
                            )}
                          </div>
                          
                          {isConnected ? (
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">
                                Dernière sync: {trackers.find(t => t.type === tracker.type)?.lastSync.toLocaleString()}
                              </div>
                              <Button 
                                onClick={() => disconnectTracker(trackers.find(t => t.type === tracker.type)?.id || '')}
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                              >
                                Déconnecter
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              onClick={() => config?.testMode ? mockConnectTracker(tracker.type) : connectTracker(tracker.type)}
                              disabled={isConnecting}
                              className="w-full"
                            >
                              {isConnecting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Wifi className="w-4 h-4 mr-2" />
                              )}
                              Connecter
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Trackers connectés */}
                {trackers.filter(t => t.connected).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Trackers actifs</h3>
                    <div className="space-y-3">
                      {trackers.filter(t => t.connected).map((tracker) => (
                        <div key={tracker.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                          <div>
                            <div className="font-medium">{tracker.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Connecté le {tracker.lastSync.toLocaleString()}
                            </div>
                          </div>
                          <Button 
                            onClick={() => disconnectTracker(tracker.id)}
                            variant="outline" 
                            size="sm"
                          >
                            Déconnecter
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Paramètres */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Paramètres de synchronisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Synchronisation automatique</div>
                      <div className="text-sm text-muted-foreground">Sync toutes les heures</div>
                    </div>
                    <Button variant="outline" size="sm">Activé</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notifications d'objectifs</div>
                      <div className="text-sm text-muted-foreground">Alertes de progression</div>
                    </div>
                    <Button variant="outline" size="sm">Activé</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Partage des données</div>
                      <div className="text-sm text-muted-foreground">Avec votre coach</div>
                    </div>
                    <Button variant="outline" size="sm">Activé</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {config?.testMode && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Mode démo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button onClick={mockSyncData} variant="secondary" className="w-full">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Simuler synchronisation
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      En mode démo, vous pouvez simuler la synchronisation des données de santé.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* État de connexion */}
        {isConnecting && (
          <Card>
            <CardContent className="p-6 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Connexion en cours...</h3>
              <p className="text-muted-foreground">
                Synchronisation avec votre tracker
              </p>
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
          <Button onClick={() => setLocation('/challenges')} variant="outline">
            Voir les défis
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

