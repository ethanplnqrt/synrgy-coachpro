/**
 * 💰 PRICING SECTION COMPONENT
 * 
 * Two-tier pricing with Stripe integration
 */

import { PricingCard } from './PricingCard';
import { startCheckout } from '@/lib/checkout';

const plans = [
  {
    tier: 'client' as const,
    title: 'Client Synrgy',
    price: 9.90,
    color: '#8AFFC1',
    gradient: 'from-[#8AFFC1] to-[#52D6A0]',
    features: [
      'Coaching IA personnalisé',
      'Programme d\'entraînement intelligent',
      'Plan nutrition interactif',
      'Chat IA + suivi automatisé',
      'Progression mesurée par SynrgyScore™',
    ],
  },
  {
    tier: 'coach' as const,
    title: 'Coach Synrgy Pro',
    price: 29.90,
    color: '#FFD66B',
    gradient: 'from-[#FFD66B] to-[#CBA24A]',
    features: [
      'Tableau de bord IA complet',
      'Gestion illimitée de clients',
      'Génération automatique de programmes',
      'SynrgyScore™ en temps réel',
      'Alertes et analytics IA',
      'Support prioritaire + API',
    ],
  },
];

export function PricingSection() {
  return (
    <section className="py-20 bg-[#0D1117] text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gradient-gold">
          Choisis ta formule Synrgy
        </h2>
        <p className="text-gray-400 text-lg mb-16">
          Paiement sécurisé via Stripe — 100% protégé, sans engagement.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {plans.map((plan) => (
            <PricingCard
              key={plan.tier}
              {...plan}
              onSelect={() => startCheckout(plan.tier)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

