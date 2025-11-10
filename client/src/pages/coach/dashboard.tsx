/**
 * 🧑‍🏫 COACH DASHBOARD
 * 
 * Main dashboard for coaches with revenue, clients, activity, and AI status
 */

import { useAuth } from "@/hooks/useAuth";
import { ProCard, ProCardHeader, ProCardTitle, ProCardContent } from "@/components/ProCard";
import { ProButton } from "@/components/ProButton";
import { RevenueChart } from "@/components/RevenueChart";
import { ActivityFeed } from "@/components/ActivityFeed";
import { AIStatusBadge } from "@/components/AIStatusBadge";
import { SynrgyScore } from "@/components/SynrgyScore";
import { Users, MessageCircle, TrendingUp, Plus, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CoachDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      label: "Clients actifs",
      value: "12",
      change: "+2 ce mois",
      icon: Users,
      trend: "up",
    },
    {
      label: "Messages",
      value: "24",
      change: "8 non lus",
      icon: MessageCircle,
      trend: "neutral",
    },
    {
      label: "Programmes créés",
      value: "18",
      change: "+3 cette semaine",
      icon: TrendingUp,
      trend: "up",
    },
    {
      label: "Sessions planifiées",
      value: "7",
      change: "Cette semaine",
      icon: Calendar,
      trend: "neutral",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bonjour, {user?.fullName || "Coach"} 👋
            </h1>
            <p className="text-secondary">
              Optimise ton business, inspire tes athlètes.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <AIStatusBadge />
            <ProButton
              variant="primary"
              onClick={() => navigate('/coach/clients/new')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau client
            </ProButton>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <ProCard hover>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl accent-bg flex items-center justify-center">
                    <Icon className="w-6 h-6 accent-text" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-secondary">{stat.change}</p>
                  </div>
                </div>
              </ProCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RevenueChart />
          </motion.div>

          {/* Recent Clients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ProCard>
              <ProCardHeader>
                <div className="flex items-center justify-between">
                  <ProCardTitle>Clients récents</ProCardTitle>
                  <button
                    onClick={() => navigate('/coach/clients')}
                    className="text-sm accent-text hover:underline"
                  >
                    Voir tous →
                  </button>
                </div>
              </ProCardHeader>
              <ProCardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Marie Dubois', progress: 85, status: 'active' },
                    { name: 'Thomas Martin', progress: 72, status: 'active' },
                    { name: 'Sarah Lopez', progress: 91, status: 'active' },
                  ].map((client, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => navigate(`/coach/clients/${i + 1}`)}
                    >
                      <div className="w-10 h-10 rounded-full accent-bg flex items-center justify-center font-semibold accent-text">
                        {client.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{client.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full accent-bg transition-all"
                              style={{ width: `${client.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-secondary">{client.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ProCardContent>
            </ProCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ProCard>
              <h3 className="heading-3 mb-4">Actions rapides</h3>
              <div className="grid grid-cols-2 gap-3">
                <ProButton
                  variant="secondary"
                  onClick={() => navigate('/coach/program-builder')}
                  className="justify-center"
                >
                  Créer un programme
                </ProButton>
                <ProButton
                  variant="secondary"
                  onClick={() => navigate('/coach/nutrition-builder')}
                  className="justify-center"
                >
                  Plan nutrition IA
                </ProButton>
                <ProButton
                  variant="secondary"
                  onClick={() => navigate('/coach/chat-ia')}
                  className="justify-center"
                >
                  Chat IA Synrgy
                </ProButton>
                <ProButton
                  variant="secondary"
                  onClick={() => navigate('/coach/settings')}
                  className="justify-center"
                >
                  Paramètres
                </ProButton>
              </div>
            </ProCard>
          </motion.div>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ActivityFeed />
          </motion.div>

          {/* SynrgyScore Example */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SynrgyScore
              clientName="Marie Dubois"
              score={85}
              trend="up"
              insights={[
                "Volume hebdomadaire en hausse (+12%)",
                "Nutrition cohérente sur 6 jours",
                "Récupération optimale"
              ]}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
