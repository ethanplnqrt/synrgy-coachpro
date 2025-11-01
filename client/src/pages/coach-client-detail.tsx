import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Brain, TrendingUp, TrendingDown, Minus, Calendar, Target, Heart, Activity, MessageSquare, FileText, StickyNote, BarChart3 } from "lucide-react";
import { mockClients } from "../lib/mockData";
import { MessagePanel } from "../components/MessagePanel";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageWrapper } from "../components/PageWrapper";

export default function CoachClientDetail() {
  const [, params] = useRoute("/coach/client/:id");
  const [, setLocation] = useLocation();
  const [client, setClient] = useState<any>(null);
  const [coachNotes, setCoachNotes] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  useEffect(() => {
    if (params?.id) {
      const found = mockClients.find(c => c.id === params.id);
      if (found) {
        setClient(found);
        // Charger les notes du coach depuis localStorage
        const notes = localStorage.getItem(`synrgy_coach_notes_${params.id}`);
        if (notes) setCoachNotes(notes);
      }
    }
  }, [params?.id]);

  if (!client) {
    return (
      <PageWrapper className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Client non trouvé</p>
          <Button onClick={() => setLocation("/coach/dashboard")} className="mt-4">
            Retour au dashboard
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const statusConfig = {
    progressing: { 
      color: "bg-green-500", 
      textColor: "text-green-600", 
      bgColor: "bg-green-50 dark:bg-green-900/20",
      icon: TrendingUp,
      label: "En progrès"
    },
    stagnating: { 
      color: "bg-orange-500", 
      textColor: "text-orange-600", 
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      icon: Minus,
      label: "Stagnation"
    },
    struggling: { 
      color: "bg-red-500", 
      textColor: "text-red-600", 
      bgColor: "bg-red-50 dark:bg-red-900/20",
      icon: TrendingDown,
      label: "En difficulté"
    },
  };

  const config = statusConfig[client.status];
  const StatusIcon = config.icon;

  // Préparer les données pour les graphiques
  const weightData = client.weight?.map((w: number, i: number) => ({
    week: `S${i + 1}`,
    weight: w,
  })) || [];

  const performanceData = client.performance?.map((p: number, i: number) => ({
    week: `S${i + 1}`,
    performance: p,
  })) || [];

  const sleepData = client.sleep?.map((s: number, i: number) => ({
    week: `S${i + 1}`,
    sleep: s,
  })) || [];

  const handleAnalyzeWithAI = () => {
    // Simulation d'analyse IA
    const analysis = {
      recommendations: [
        client.status === "stagnating" 
          ? "Augmenter la variété des exercices pour relancer la progression"
          : client.status === "struggling"
          ? "Réduire l'intensité et augmenter la période de récupération"
          : "Maintenir le rythme actuel, excellente progression",
        client.feedback?.fatigue?.includes("Très")
          ? "Suggérer 1 jour de repos supplémentaire par semaine"
          : "Planning actuel adapté à la récupération",
        "Vérifier l'adhésion au plan nutritionnel",
      ],
      nextSteps: [
        "Programmer un suivi dans 3 jours",
        "Ajuster le programme selon les recommandations",
        "Encourager avec un message personnalisé",
      ],
    };
    setAiAnalysis(analysis);
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`synrgy_coach_notes_${client.id}`, coachNotes);
    alert("Notes sauvegardées !");
  };

  return (
    <PageWrapper className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/30 dark:to-purple-950/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec retour */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button variant="ghost" onClick={() => setLocation("/coach/dashboard")}>
            ← Retour
          </Button>
          <div className="flex-1" />
        </motion.div>

        {/* Fiche profil complète */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-orange-500 via-green-500 to-orange-500 dark:from-purple-600 dark:via-blue-600 dark:to-purple-600 text-white p-8 rounded-2xl shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white/30">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback className="text-2xl">{client.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{client.name}</h1>
                <Badge className={`${config.bgColor} ${config.textColor} border-0`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-orange-50 dark:text-purple-100">Âge</p>
                  <p className="text-lg font-semibold">{client.age} ans</p>
                </div>
                <div>
                  <p className="text-sm text-orange-50 dark:text-purple-100">Niveau</p>
                  <p className="text-lg font-semibold">{client.level}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-50 dark:text-purple-100">Objectif</p>
                  <p className="text-lg font-semibold truncate">{client.mainGoal}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-50 dark:text-purple-100">Progression</p>
                  <p className="text-lg font-semibold">{client.progress}</p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleAnalyzeWithAI}
              className="bg-white text-orange-600 hover:bg-white/90 dark:bg-purple-900 dark:text-white"
              size="lg"
            >
              <Brain className="w-5 h-5 mr-2" />
              Analyser avec IA
            </Button>
          </div>
        </motion.div>

        {/* Analyse IA */}
        {aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold">Analyse IA</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Recommandations</h4>
                <ul className="space-y-2">
                  {aiAnalysis.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Prochaines étapes</h4>
                <ul className="space-y-2">
                  {aiAnalysis.nextSteps.map((step: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="evolution">Évolution</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="notes">Notes Coach</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Messages récents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Derniers messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{client.latestMessage}</p>
                  <MessagePanel clientId={client.id} clientName={client.name} clientAvatar={client.avatar} role="coach" />
                </CardContent>
              </Card>

              {/* Feedback du client */}
              {client.feedback && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Feedback du client
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Émotions</p>
                      <p className="font-medium">{client.feedback.emotions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Fatigue</p>
                      <p className="font-medium">{client.feedback.fatigue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Motivation</p>
                      <p className="font-medium">{client.feedback.motivation}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="evolution" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4" />
                    Poids (kg)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#F97316" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4" />
                    Performance (%)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4" />
                    Sommeil (h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={sleepData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique des programmes et repas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Programme Force & Endurance</h4>
                      <Badge>Actif</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Démarré le 15 janvier 2024 • Progression: 65%</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Plan Nutrition Complet</h4>
                      <Badge variant="outline">En cours</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Calories: 2100 kcal/jour • Macronutriments équilibrés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5" />
                  Notes du coach (privé)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={coachNotes}
                  onChange={(e) => setCoachNotes(e.target.value)}
                  placeholder="Ajoute tes notes privées sur ce client..."
                  className="w-full min-h-[300px] p-4 border rounded-lg resize-none"
                />
                <Button onClick={handleSaveNotes}>
                  Sauvegarder les notes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}

