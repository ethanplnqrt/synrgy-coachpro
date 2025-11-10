/**
 * 💳 PRICING CARD COMPONENT
 * 
 * Premium pricing card with Stripe integration
 */

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingCardProps {
  tier: 'client' | 'coach';
  title: string;
  price: number;
  features: string[];
  color: string;
  gradient: string;
  onSelect: () => void;
}

export function PricingCard({
  tier,
  title,
  price,
  features,
  color,
  gradient,
  onSelect,
}: PricingCardProps) {
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);

  return (
    <motion.div
      initial={{ opacity: 0, x: tier === 'client' ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: tier === 'client' ? 0.2 : 0.3 }}
      data-testid={`tier-${tier}`}
      className={`rounded-2xl border border-[${color}]/20 p-10 bg-[#121418]/60 backdrop-blur-md hover:scale-[1.02] transition-all duration-300`}
    >
      {/* Title */}
      <div className={`text-3xl mb-4 font-semibold text-[${color}]`}>
        {title}
      </div>

      {/* Price */}
      <div className="mb-2">
        <span className="text-5xl font-bold">
          {formattedPrice.split(',')[0]}
          <span className="text-2xl align-top">,{formattedPrice.split(',')[1]?.replace('€', '')}</span>
        </span>
        <span className="text-xl font-light">/mois</span>
      </div>

      {/* Cancellation note */}
      <p className="text-sm text-gray-400 mb-8">Annulable à tout moment</p>

      {/* Features */}
      <ul className="space-y-3 text-gray-300 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 text-[${color}]`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onSelect}
        className={`w-full bg-gradient-to-r ${gradient} text-black font-semibold py-3 rounded-xl hover:brightness-110 transition-all`}
      >
        Démarrer
      </button>
    </motion.div>
  );
}

