import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { GraduationCap, Dumbbell, Brain, Users, Target, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'wouter';

const coachBenefits = [
  "Gère tes clients avec une interface intuitive",
  "Suivi de progression en temps réel",
  "Suggestions IA pour optimiser les programmes",
  "Messagerie directe avec tes athlètes",
  "Analytics avancés et rapports détaillés"
];

const athleteBenefits = [
  "Programmes personnalisés générés par IA",
  "Auto-régulation intelligente de nutrition",
  "Suivi quotidien de tes métriques",
  "Photos de progression avec comparateur",
  "Accompagnement humain de ton coach"
];

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<'coach' | 'athlete' | null>(null);
  const [currentBenefit, setCurrentBenefit] = useState(0);

  // Animation des avantages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelection = (role: 'coach' | 'athlete') => {
    setSelectedRole(role);
    setTimeout(() => {
      setLocation(`/dashboard/${role}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-primary rounded-xl p-3">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Synrgy</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            La plateforme de coaching sportif intelligente
          </p>
          <p className="text-muted-foreground">
            Que tu accompagnes ou que tu performes, Synrgy s'adapte à tes besoins
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Coach Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <Card 
              className={`card hover-lift cursor-pointer transition-all duration-300 ${
                selectedRole === 'coach' 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleRoleSelection('coach')}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Je suis Coach</h2>
                  <p className="text-muted-foreground">
                    Accompagne tes athlètes avec des outils professionnels
                  </p>
                </div>

                {/* Animated Benefits */}
                <div className="space-y-3 mb-6">
                  {coachBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: currentBenefit === index ? 1 : 0.6,
                        x: currentBenefit === index ? 0 : -10,
                        scale: currentBenefit === index ? 1.02 : 1
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3 text-left"
                    >
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-sm text-foreground">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <Button 
                  className="w-full btn-primary"
                  disabled={selectedRole !== null}
                >
                  {selectedRole === 'coach' ? (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Redirection...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Accéder au Dashboard Coach
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Athlete Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <Card 
              className={`card hover-lift cursor-pointer transition-all duration-300 ${
                selectedRole === 'athlete' 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleRoleSelection('athlete')}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Dumbbell className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Je suis Athlète</h2>
                  <p className="text-muted-foreground">
                    Optimise tes performances avec l'IA et ton coach
                  </p>
                </div>

                {/* Animated Benefits */}
                <div className="space-y-3 mb-6">
                  {athleteBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: currentBenefit === index ? 1 : 0.6,
                        x: currentBenefit === index ? 0 : -10,
                        scale: currentBenefit === index ? 1.02 : 1
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3 text-left"
                    >
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-sm text-foreground">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <Button 
                  className="w-full btn-secondary"
                  disabled={selectedRole !== null}
                >
                  {selectedRole === 'athlete' ? (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Redirection...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Accéder au Dashboard Athlète
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Une plateforme pensée pour l'humain
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-surface rounded-lg">
              <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-2">IA Humaine</h4>
              <p className="text-sm text-muted-foreground">
                L'IA propose, tu décides. Ton coach a toujours le dernier mot.
              </p>
            </div>
            <div className="p-6 bg-surface rounded-lg">
              <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Progression Continue</h4>
              <p className="text-sm text-muted-foreground">
                Suivi automatique de tes métriques et ajustements intelligents.
              </p>
            </div>
            <div className="p-6 bg-surface rounded-lg">
              <Users className="w-8 h-8 text-info mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Relation Humaine</h4>
              <p className="text-sm text-muted-foreground">
                Communication directe avec ton coach, photos de progression.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
            <p className="text-lg text-foreground italic">
              "Tu n'as pas besoin d'être parfait, juste constant 💪"
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              — L'équipe Synrgy
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
