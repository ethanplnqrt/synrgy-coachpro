/**
 * 💰 REVENUE CHART COMPONENT
 * 
 * Displays revenue/income chart for coaches.
 * @module RevenueChart
 */

import React from 'react';
import { TrendingUp } from 'lucide-react';

export interface RevenueChartProps {
  data?: Array<{ month: string; revenue: number }>;
  className?: string;
}

/**
 * RevenueChart Component
 * Simplified chart component (full implementation with recharts can be added later)
 */
export function RevenueChart({ data, className = '' }: RevenueChartProps) {
  // Placeholder data
  const defaultData = [
    { month: 'Jan', revenue: 0 },
    { month: 'Fév', revenue: 0 },
    { month: 'Mar', revenue: 0 },
    { month: 'Avr', revenue: 0 },
    { month: 'Mai', revenue: 0 },
    { month: 'Juin', revenue: 0 },
  ];

  const chartData = data || defaultData;
  const total = chartData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${className}`.trim()}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Revenu Total
          </h3>
          <p className="text-3xl font-bold text-cyan-400">
            {total.toFixed(2)} €
          </p>
        </div>
        <div className="bg-emerald-500/20 p-3 rounded-full">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
        </div>
      </div>

      {/* Simple Bar Chart Placeholder */}
      <div className="flex items-end justify-between gap-2 h-32">
        {chartData.map((item, index) => {
          const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);
          const height = (item.revenue / maxRevenue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                <div
                  className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{ height: height > 0 ? `${height}%` : '2%' }}
                />
              </div>
              <span className="text-xs text-gray-400">{item.month}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Basé sur les abonnements actifs</span>
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;

