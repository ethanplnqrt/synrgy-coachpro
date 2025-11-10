/**
 * 👤 CLIENT PROFILE PAGE
 * 
 * Displays detailed client information in the coach dashboard.
 * Premium glassmorphism design with smooth animations.
 * @module ClientProfile
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlowButton } from '@/components/GlowButton';
import { ArrowLeft, User } from 'lucide-react';

/**
 * ClientProfile Component
 * Displays a client's summary and details for coaches
 */
export default function ClientProfile() {
  const navigate = useNavigate();
  const { id: clientId } = useParams<{ id?: string }>();

  useEffect(() => {
    console.log('📄 ClientProfile page loaded');
    if (clientId) {
      console.log(`   → Client ID: ${clientId}`);
    }
  }, [clientId]);

  const handleBack = () => {
    navigate('/coach/clients');
  };

  return (
    <div className="min-h-screen bg-[#0D1117] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <GlowButton
            label="Retour"
            onClick={handleBack}
            variant="secondary"
            icon={<ArrowLeft className="w-4 h-4" />}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">
            Profil client
          </h1>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="
            bg-white/10 
            backdrop-blur-md 
            border 
            border-white/20 
            rounded-3xl 
            p-8 
            shadow-xl
            hover:border-white/30
            transition-all
            duration-300
          "
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="
              w-20 
              h-20 
              rounded-full 
              bg-gradient-to-br 
              from-cyan-400/20 
              to-emerald-400/20 
              flex 
              items-center 
              justify-center
              border
              border-white/20
            ">
              <User className="w-10 h-10 text-cyan-400" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Informations client
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              Sélectionnez un client pour afficher ses informations.
            </p>

            {clientId && (
              <div className="
                mt-6 
                p-4 
                bg-white/5 
                border 
                border-white/10 
                rounded-xl
              ">
                <p className="text-sm text-gray-400">
                  ID du client sélectionné:
                </p>
                <p className="text-white font-mono text-sm mt-1">
                  {clientId}
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-center">
            <GlowButton
              label="Voir tous les clients"
              onClick={handleBack}
              variant="primary"
            />
          </div>
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="
            mt-6 
            bg-white/5 
            backdrop-blur-sm 
            border 
            border-white/10 
            rounded-2xl 
            p-6
          "
        >
          <h3 className="text-lg font-semibold text-white mb-3">
            À venir
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Historique d'entraînement</li>
            <li>• Suivi nutrition</li>
            <li>• Progression et statistiques</li>
            <li>• Chat IA personnalisé</li>
            <li>• Notes et observations</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}

