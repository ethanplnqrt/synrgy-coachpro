import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import Header from "../components/Header";
import { UserCheck, Dumbbell, Brain, BarChart3, Calendar, UtensilsCrossed, FileText, Sparkles } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const coachFeatures: Feature[] = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Génération IA complète d'entraînements & nutrition",
    description: "Crée des programmes personnalisés en quelques secondes grâce à l'intelligence artificielle"
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Suivi automatique des progrès de tes athlètes",
    description: "Analyse en temps réel les performances et ajuste les programmes automatiquement"
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Gestion intelligente du planning",
    description: "Organise les séances, optimise les créneaux et évite les conflits automatiquement"
  },
];

const athleteFeatures: Feature[] = [
  {
    icon: <Dumbbell className="w-5 h-5" />,
    title: "Programme IA évolutif selon ton niveau",
    description: "Un entraînement qui s'adapte à tes performances et progresse avec toi"
  },
  {
    icon: <UtensilsCrossed className="w-5 h-5" />,
    title: "Plan nutrition ajusté automatiquement",
    description: "Nutrition personnalisée qui évolue selon tes objectifs et tes résultats"
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Historique et conseils personnalisés",
    description: "Suis ta progression avec des insights détaillés et des recommandations ciblées"
  },
];

export default function Demo() {
  const [, setLocation] = useLocation();

  const handleCoachExplore = () => {
    // Sauvegarder les données de démo dans localStorage
    const demoData = {
      role: "coach",
      name: "Coach Démo",
      email: "demo.coach@synrgy.app",
      plan: "Programme Force & Performance",
      objectives: ["Gagner de la masse musculaire", "Améliorer l'endurance"],
    };
    localStorage.setItem("synrgy_demo_data", JSON.stringify(demoData));
    setLocation("/demo/coach");
  };

  const handleAthleteExplore = () => {
    // Sauvegarder les données de démo dans localStorage
    const demoData = {
      role: "athlete",
      name: "Athlète Démo",
      email: "demo.athlete@synrgy.app",
      plan: "Programme Fitness Complet",
      objectives: ["Perte de poids", "Tonification musculaire"],
    };
    localStorage.setItem("synrgy_demo_data", JSON.stringify(demoData));
    setLocation("/demo/athlete");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F172A" }}>
      <Header demoBanner />
      <main className="pt-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <h1 className="text-5xl font-extrabold mb-4 text-white">
              Mode Démo Synrgy
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Découvre Synrgy sous ton angle : que tu accompagnes ou que tu performes.
            </p>
          </motion.div>

          {/* Demo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Coach Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <Card
                className="border-0 bg-gradient-to-br from-orange-900/40 to-rose-900/40 backdrop-blur-sm overflow-hidden hover:scale-105 transition-transform duration-300 shadow-2xl"
                style={{
                  boxShadow: "0 20px 50px rgba(249, 115, 22, 0.3)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-rose-500/10" />
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600">
                      <UserCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Explorer en tant que Coach</h2>
                      <p className="text-orange-200 text-sm mt-1">
                        Outils professionnels de coaching
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 space-y-6">
                  <p className="text-gray-200 text-base leading-relaxed">
                    Accède aux outils de gestion pour coachs : programmes IA, nutrition, suivi d'athlètes avec des analytics avancés.
                  </p>

                  {/* Features List with Animation */}
                  <div className="space-y-3">
                    {coachFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-orange-500/20"
                      >
                        <div className="text-orange-400 mt-0.5 flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{feature.title}</p>
                          <p className="text-orange-100/80 text-xs mt-1">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-2">
                    <Button
                      onClick={handleCoachExplore}
                      className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Explorer le dashboard Coach
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full border-orange-500/50 text-orange-300 hover:bg-orange-500/20 hover:text-white font-medium"
                        >
                          Découvrir les fonctionnalités
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-orange-400">
                            Fonctionnalités Coach
                          </DialogTitle>
                          <DialogDescription className="text-gray-300">
                            Découvre toutes les capacités de Synrgy pour les coachs
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          {coachFeatures.map((feature, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg bg-slate-800/50 border border-orange-500/20"
                            >
                              <div className="flex items-start gap-3">
                                <div className="text-orange-400 mt-0.5">
                                  {feature.icon}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white mb-1">
                                    {feature.title}
                                  </h4>
                                  <p className="text-gray-300 text-sm">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Athlete Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <Card
                className="border-0 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm overflow-hidden hover:scale-105 transition-transform duration-300 shadow-2xl"
                style={{
                  boxShadow: "0 20px 50px rgba(37, 99, 235, 0.3)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" />
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                      <Dumbbell className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Explorer en tant qu'Athlète</h2>
                      <p className="text-blue-200 text-sm mt-1">
                        Coaching personnel avec IA
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 space-y-6">
                  <p className="text-gray-200 text-base leading-relaxed">
                    Accède à ton espace personnel : suivi de programme, nutrition adaptative, coach IA intégré pour un accompagnement complet.
                  </p>

                  {/* Features List with Animation */}
                  <div className="space-y-3">
                    {athleteFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-blue-500/20"
                      >
                        <div className="text-blue-400 mt-0.5 flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{feature.title}</p>
                          <p className="text-blue-100/80 text-xs mt-1">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-2">
                    <Button
                      onClick={handleAthleteExplore}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Explorer le dashboard Athlète
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:text-white font-medium"
                        >
                          Découvrir les fonctionnalités
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-blue-400">
                            Fonctionnalités Athlète
                          </DialogTitle>
                          <DialogDescription className="text-gray-300">
                            Découvre toutes les capacités de Synrgy pour les athlètes
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          {athleteFeatures.map((feature, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/20"
                            >
                              <div className="flex items-start gap-3">
                                <div className="text-blue-400 mt-0.5">
                                  {feature.icon}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white mb-1">
                                    {feature.title}
                                  </h4>
                                  <p className="text-gray-300 text-sm">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 text-center"
          >
            <p className="text-gray-300 text-sm">
              <span className="font-semibold text-purple-300">Mode démo activé</span> • 
              Aucune authentification requise • 
              Données fictives préchargées • 
              Expérience complète disponible
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
