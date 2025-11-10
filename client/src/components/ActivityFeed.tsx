/**
 * 📋 ACTIVITY FEED COMPONENT
 * 
 * Displays recent activity/events for coaches.
 * @module ActivityFeed
 */

import React from 'react';
import { Clock, User, CheckCircle, AlertCircle } from 'lucide-react';

export interface Activity {
  id: string;
  type: 'user' | 'success' | 'warning';
  title: string;
  description: string;
  timestamp: string;
}

export interface ActivityFeedProps {
  activities?: Activity[];
  className?: string;
}

/**
 * ActivityFeed Component
 * Shows list of recent activities
 */
export function ActivityFeed({ activities, className = '' }: ActivityFeedProps) {
  // Placeholder activities
  const defaultActivities: Activity[] = [
    {
      id: '1',
      type: 'success',
      title: 'Bienvenue !',
      description: 'Configuration de votre compte terminée',
      timestamp: 'Il y a quelques instants',
    },
  ];

  const items = activities || defaultActivities;

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5 text-blue-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBackgroundColor = (type: Activity['type']) => {
    switch (type) {
      case 'user':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${className}`.trim()}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          Activité Récente
        </h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {items.map((activity) => (
          <div
            key={activity.id}
            className={`
              flex 
              items-start 
              gap-4 
              p-4 
              rounded-xl 
              border
              transition-all
              duration-300
              hover:bg-white/5
              ${getBackgroundColor(activity.type)}
            `.trim()}
          >
            <div className="flex-shrink-0 mt-1">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white mb-1">
                {activity.title}
              </h4>
              <p className="text-sm text-gray-400 mb-2">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">Aucune activité récente</p>
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;

