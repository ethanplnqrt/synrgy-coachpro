/**
 * 🏠 CLIENT HOME PAGE
 * 
 * Main home page for athlete/client users.
 * @module ClientHome
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlowButton } from '@/components/GlowButton';
import { Home, Dumbbell, Apple, MessageCircle, TrendingUp } from 'lucide-react';

/**
 * ClientHome Component
 * Main landing page for clients after login
 */
export default function ClientHome() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🏠 ClientHome page loaded');
  }, []);

  const quickActions = [
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Entraînement",
      description: "Voir mes programmes",
      action: () => navigate('/client/training'),
    },
    {
      icon: <Apple className="w-8 h-8" />,
      title: "Nutrition",
      description: "Plan alimentaire",
      action: () => navigate('/client/nutrition'),
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progrès",
      description: "Suivre ma progression",
      action: () => navigate('/client/progress'),
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Chat",
      description: "Parler à mon coach",
      action: () => navigate('/client/chat'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Home className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Bienvenue !
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Prêt à atteindre tes objectifs ?
          </p>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              onClick={action.action}
              className="
                bg-white/10 
                border 
                border-white/20 
                rounded-3xl 
                p-8 
                shadow-xl 
                backdrop-blur-xl
                hover:border-white/40
                hover:bg-white/15
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
                text-center
              "
            >
              <div className="text-cyan-400 mb-4 flex justify-center">
                {action.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-400">
                {action.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="
            bg-white/10 
            border 
            border-white/20 
            rounded-3xl 
            p-10 
            shadow-2xl 
            backdrop-blur-xl
          "
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ton tableau de bord
            </h2>
            <p className="text-gray-400 mb-8">
              Accède à toutes tes fonctionnalités depuis ton dashboard
            </p>
            <GlowButton
              label="Ouvrir le tableau de bord"
              onClick={() => navigate('/client/dashboard')}
              variant="primary"
            />
          </div>
        </motion.div>

        {/* Stats Overview (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: "Séances cette semaine", value: "0" },
            { label: "Objectif nutrition", value: "En cours" },
            { label: "Prochaine séance", value: "À programmer" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
              className="
                bg-white/5 
                border 
                border-white/10 
                rounded-2xl 
                p-6 
                text-center
              "
            >
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

