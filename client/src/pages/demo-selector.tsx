import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { useLocation } from 'wouter';
import { 
  GraduationCap, 
  Dumbbell, 
  User,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const roles = [
  {
    id: 'coach',
    title: 'Je suis Coach',
    description: 'Gère tes clients, créé des programmes et suive leur progression',
    icon: GraduationCap,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    features: ['Gestion clients', 'Analytics IA', 'Programmes personnalisés']
  },
  {
    id: 'athlete',
    title: 'Je suis Athlète',
    description: 'Crée tes propres programmes, suive ta progression et utilise l\'IA',
    icon: Dumbbell,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    features: ['Training Actif', 'Nutrition IA', 'Auto-suivi']
  },
  {
    id: 'client',
    title: 'Je suis Client',
    description: 'Rejoins un coach, suive son programme et communique avec lui',
    icon: User,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    features: ['Programmes coach', 'Chat direct', 'Feedback quotidien']
  }
];

export default function DemoSelector() {
  const [, setLocation] = useLocation();

  const handleRoleSelect = (roleId: string) => {
    // Store selected role in localStorage for demo mode
    localStorage.setItem('demo_role', roleId);
    localStorage.setItem('demo_mode', 'true');
    
    // Redirect to demo dashboard
    setLocation(`/demo/${roleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#0F172A] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-4 rounded-full bg-gradient-to-br from-primary to-orange-500 mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Bienvenue dans Synrgy
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Plateforme IA de coaching sportif personnalisé
          </p>
          <p className="text-sm text-muted-foreground">
            Mode Démo — Choisis ton rôle pour découvrir les fonctionnalités
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect(role.id)}
              >
                <Card className={`card cursor-pointer transition-all border-2 ${role.borderColor} ${role.bgColor}`}>
                  <CardContent className="p-8 text-center">
                    <div className={`inline-block p-6 rounded-full bg-gradient-to-br ${role.color} mb-6`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">{role.title}</h2>
                    <p className="text-muted-foreground mb-6">{role.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {role.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2 className="w-4 h-4 text-secondary" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r ${role.color} text-white font-semibold hover:opacity-90 transition-opacity`}>
                      Explorer
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            💡 Mode démo — Toutes les fonctionnalités sont simulées pour la démonstration
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
