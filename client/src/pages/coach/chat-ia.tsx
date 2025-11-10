/**
 * 💬 CHAT IA PAGE
 * 
 * AI-powered chat assistant for coaches.
 * @module ChatIA
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlowButton } from '@/components/GlowButton';
import { MessageCircle, Sparkles, Brain, Zap } from 'lucide-react';

/**
 * ChatIA Component
 * AI chat assistant interface for coaches
 */
export default function ChatIA() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('💬 ChatIA page loaded');
  }, []);

  const handleBack = () => {
    navigate('/coach/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            💬 Assistant IA Synrgy
          </h1>
          <p className="text-xl text-gray-400">
            Cette section sera bientôt disponible.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="
            bg-white/10 
            border 
            border-white/20 
            rounded-3xl 
            p-10 
            shadow-2xl 
            backdrop-blur-xl
            hover:border-white/30
            transition-all
            duration-300
          "
        >
          {/* Icon Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: <MessageCircle className="w-8 h-8" />, label: "Chat" },
              { icon: <Brain className="w-8 h-8" />, label: "IA" },
              { icon: <Zap className="w-8 h-8" />, label: "Rapide" },
              { icon: <Sparkles className="w-8 h-8" />, label: "Smart" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="
                  flex 
                  flex-col 
                  items-center 
                  justify-center
                  p-6
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  hover:bg-white/10
                  transition-all
                  duration-300
                "
              >
                <div className="text-purple-400 mb-3">
                  {item.icon}
                </div>
                <p className="text-sm text-gray-300 font-medium">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-400/20 to-pink-400/20 border border-purple-400/30 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold">
                Assistant IA en développement
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">
              Bientôt disponible
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              L'assistant IA Synrgy arrive prochainement. 
              Posez vos questions et recevez des réponses intelligentes instantanément.
            </p>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="
              bg-white/5 
              border 
              border-white/10 
              rounded-2xl 
              p-6 
              mb-8
            "
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Fonctionnalités à venir :
            </h3>
            <ul className="space-y-3">
              {[
                "Chat en temps réel avec l'IA Synrgy",
                "Conseils personnalisés pour vos clients",
                "Génération de programmes et recettes",
                "Réponses basées sur vos données clients",
                "Historique des conversations sauvegardé",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="flex justify-center"
          >
            <GlowButton
              label="Retour au tableau de bord"
              onClick={handleBack}
              variant="primary"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

