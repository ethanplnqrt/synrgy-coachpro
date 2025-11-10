/**
 * 🏠 LANDING PAGE
 * 
 * Premium landing experience with gold accents and smooth animations.
 * "Train Smart. Live Synrgy."
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlowButton } from '@/components/GlowButton';
import { AnimatedCard } from '@/components/AnimatedCard';
import LanguageSelector from '@/components/LanguageSelector';
import { Dumbbell, Brain, TrendingUp, Sparkles, Users, Apple } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Handle plan selection (avoid 401 on public page)
  const handleSelectPlan = (plan: 'client' | 'coach') => {
    try {
      // Check if user is logged in
      const token = document.cookie.split(';').find(c => c.trim().startsWith('synrgy_token='));
      
      if (!token) {
        // Not logged in → redirect to signup with role
        navigate(`/signup?role=${plan}`);
      } else {
        // Logged in → redirect to checkout
        navigate(`/checkout?plan=${plan}`);
      }
    } catch (e) {
      console.error("Plan selection error:", e);
      navigate(`/signup?role=${plan}`);
    }
  };

  const features = [
    {
      icon: Dumbbell,
      title: t('landing.features.hevy.title'),
      description: t('landing.features.hevy.description'),
    },
    {
      icon: Apple,
      title: t('landing.features.macros.title'),
      description: t('landing.features.macros.description'),
    },
    {
      icon: Brain,
      title: t('landing.features.ai.title'),
      description: t('landing.features.ai.description'),
    },
    {
      icon: TrendingUp,
      title: t('landing.features.truecoach.title'),
      description: t('landing.features.truecoach.description'),
    },
    {
      icon: Users,
      title: t('landing.features.referral.title'),
      description: t('landing.features.referral.description'),
    },
    {
      icon: Sparkles,
      title: t('landing.features.premium.title'),
      description: t('landing.features.premium.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Language Selector - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-success/20 border border-primary/30 mb-6">
                <span className="text-4xl font-light text-gradient-gold">S</span>
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-light mb-6">
              <span className="text-gradient-gold">SYNRGY</span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-text-secondary mb-12 font-light tracking-wide"
            >
              {t('landing.hero.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <GlowButton
                onClick={() => navigate('/signup')}
                size="lg"
              >
                {t('landing.cta.start')}
              </GlowButton>
              <GlowButton
                onClick={() => navigate('/login')}
                variant="ghost"
                size="lg"
                className="border border-primary/50"
              >
                {t('landing.cta.signin')}
              </GlowButton>
            </motion.div>

            {/* Social Proof */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-sm text-text-secondary"
            >
              Trusted by coaches and athletes who demand excellence.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-surface/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-gradient-gold mb-4 uppercase tracking-wider">
              {t('landing.features.title')}
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <AnimatedCard key={index} delay={index * 0.1} hover={true}>
                <div className="flex flex-col items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <feature.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Premium Glassmorphism */}
      <section className="py-20 bg-[#0D1117] text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gradient-gold">Choisis ta formule Synrgy</h2>
            <p className="text-gray-400 text-lg">
              Paiement sécurisé via Stripe — 100% protégé, sans engagement.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* FORMULE CLIENT */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border border-[#8AFFC1]/20 p-10 bg-[#121418]/60 backdrop-blur-md hover:scale-[1.02] transition-all duration-300"
            >
              <div className="text-3xl mb-4 font-semibold text-[#8AFFC1]">Client Synrgy</div>
              <p className="text-5xl font-bold mb-6">
                9<span className="text-2xl align-top">,90€</span>
                <span className="text-xl font-light">/mois</span>
              </p>
              <ul className="space-y-3 text-gray-300 text-left mb-8">
                <li>✅ Coaching IA personnalisé</li>
                <li>✅ Programme d'entraînement intelligent</li>
                <li>✅ Plan nutrition interactif</li>
                <li>✅ Chat IA + suivi automatisé</li>
                <li>✅ Progression mesurée par SynrgyScore™</li>
              </ul>
              <button
                onClick={() => handleSelectPlan('client')}
                className="w-full bg-gradient-to-r from-[#8AFFC1] to-[#52D6A0] text-black font-semibold py-3 rounded-xl hover:brightness-110 transition-all"
              >
                Choisir cette formule
              </button>
            </motion.div>

            {/* FORMULE COACH */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl border border-[#FFD66B]/20 p-10 bg-[#121418]/60 backdrop-blur-md hover:scale-[1.02] transition-all duration-300"
            >
              <div className="text-3xl mb-4 font-semibold text-[#FFD66B]">Coach Synrgy Pro</div>
              <p className="text-5xl font-bold mb-6">
                29<span className="text-2xl align-top">,90€</span>
                <span className="text-xl font-light">/mois</span>
              </p>
              <ul className="space-y-3 text-gray-300 text-left mb-8">
                <li>✅ Tableau de bord IA complet</li>
                <li>✅ Gestion illimitée de clients</li>
                <li>✅ Génération automatique de programmes</li>
                <li>✅ SynrgyScore™ en temps réel</li>
                <li>✅ Alertes et analytics IA</li>
                <li>✅ Support prioritaire + API</li>
              </ul>
              <button
                onClick={() => handleSelectPlan('coach')}
                className="w-full bg-gradient-to-r from-[#FFD66B] to-[#CBA24A] text-black font-semibold py-3 rounded-xl hover:brightness-110 transition-all"
              >
                Choisir cette formule
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-secondary text-sm">
              {t('landing.footer.copyright')}
            </p>
            <p className="text-primary text-sm font-medium tracking-wider uppercase">
              {t('landing.footer.tagline')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
