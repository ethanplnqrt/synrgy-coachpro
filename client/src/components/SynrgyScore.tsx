/**
 * 🎯 SYNRGY SCORE COMPONENT
 * 
 * Displays the SynrgyScore™ - a proprietary performance metric.
 * @module SynrgyScore
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface SynrgyScoreProps {
  score?: number; // 0-100
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

/**
 * SynrgyScore Component
 * Displays client performance score with visual indicator
 */
export function SynrgyScore({
  score = 0,
  trend = 'stable',
  className = '',
}: SynrgyScoreProps) {
  // Calculate score color and percentage
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-emerald-400';
    if (value >= 60) return 'text-cyan-400';
    if (value >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreGradient = (value: number) => {
    if (value >= 80) return 'from-emerald-500 to-cyan-500';
    if (value >= 60) return 'from-cyan-500 to-blue-500';
    if (value >= 40) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      case 'stable':
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendLabel = () => {
    switch (trend) {
      case 'up':
        return 'En hausse';
      case 'down':
        return 'En baisse';
      case 'stable':
      default:
        return 'Stable';
    }
  };

  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${className}`.trim()}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            SynrgyScore™
          </h3>
          <p className="text-sm text-gray-400">
            Score global de performance
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {getTrendIcon()}
          <span className="text-gray-400">{getTrendLabel()}</span>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-700"
            />
            {/* Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#score-gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                  offset="0%"
                  className={`${getScoreGradient(score).split(' ')[0].replace('from-', 'text-')}`}
                  style={{ stopColor: 'currentColor' }}
                />
                <stop
                  offset="100%"
                  className={`${getScoreGradient(score).split(' ')[1].replace('to-', 'text-')}`}
                  style={{ stopColor: 'currentColor' }}
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Score Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-sm text-gray-400 mt-1">/ 100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-3">
        {[
          { label: 'Adhérence entraînement', value: score * 0.9 },
          { label: 'Cohérence nutrition', value: score * 0.85 },
          { label: 'Progression mesurable', value: score * 0.95 },
        ].map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{item.label}</span>
              <span className={`font-semibold ${getScoreColor(item.value)}`}>
                {Math.round(item.value)}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getScoreGradient(item.value)} transition-all duration-1000`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">
          Le SynrgyScore™ mesure l'engagement et la progression globale
        </p>
      </div>
    </div>
  );
}

export default SynrgyScore;

