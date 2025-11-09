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

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-gradient-gold mb-4 uppercase tracking-wider">
              {t('landing.pricing.title')}
            </h2>
            <p className="text-text-secondary text-lg">
              {t('landing.pricing.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Coach Plan */}
            <AnimatedCard delay={0.2}>
              <div className="text-center p-8">
                <div className="mb-6">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="text-2xl font-medium mb-2">{t('landing.pricing.coach.title')}</h3>
                  <p className="text-text-secondary">{t('landing.pricing.coach.subtitle')}</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-light text-gradient-gold">{t('landing.pricing.coach.price')}</span>
                  <span className="text-text-secondary">{t('landing.pricing.coach.period')}</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2 text-text-secondary">
                    <span className="text-primary">✓</span> {t('landing.pricing.coach.features.clients')}
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <span className="text-primary">✓</span> {t('landing.pricing.coach.features.builder')}
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <span className="text-primary">✓</span> {t('landing.pricing.coach.features.insights')}
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <span className="text-primary">✓</span> {t('landing.pricing.coach.features.earnings')}
                  </li>
                </ul>
                <GlowButton
                  onClick={() => navigate('/signup?role=coach')}
                  className="w-full"
                >
                  {t('landing.pricing.coach.cta')}
                </GlowButton>
              </div>
            </AnimatedCard>

            {/* Client Plan */}
            <AnimatedCard delay={0.3}>
              <div className="text-center p-8">
                <div className="mb-6">
                  <Dumbbell className="w-12 h-12 text-success mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="text-2xl font-medium mb-2">{t('landing.pricing.client.title')}</h3>
                  <p className="text-text-secondary">{t('landing.pricing.client.subtitle')}</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-light text-success">{t('landing.pricing.client.price')}</span>
                  <span className="text-text-secondary">{t('landing.pricing.client.period')}</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2 text-text-secondary">
                    <span className="text-success">✓</span> {t('landing.pricing.client.features.logging')}
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <span className="text-success">✓</span> {t('landing.pricing.client.features.sync')}
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <span className="text-success">✓</span> {t('landing.pricing.client.features.ai')}
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <span className="text-success">✓</span> {t('landing.pricing.client.features.discount')}
                  </li>
                </ul>
                <GlowButton
                  onClick={() => navigate('/signup?role=client')}
                  className="w-full bg-success hover:bg-success/90"
                >
                  {t('landing.pricing.client.cta')}
                </GlowButton>
              </div>
            </AnimatedCard>
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
