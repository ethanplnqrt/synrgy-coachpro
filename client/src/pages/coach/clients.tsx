/**
 * 👥 COACH CLIENTS PAGE
 * 
 * List and manage all clients
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProCard } from '@/components/ProCard';
import { ProButton } from '@/components/ProButton';
import { SynrgyScore } from '@/components/SynrgyScore';
import { Users, Search, Plus, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const demoClients = [
  {
    id: 1,
    name: 'Marie Dubois',
    email: 'marie.d@email.com',
    score: 85,
    trend: 'up' as const,
    status: 'active',
    joinedAt: '2025-01-15',
    lastActivity: 'Il y a 2 heures',
  },
  {
    id: 2,
    name: 'Thomas Martin',
    email: 'thomas.m@email.com',
    score: 72,
    trend: 'stable' as const,
    status: 'active',
    joinedAt: '2024-12-10',
    lastActivity: 'Hier',
  },
  {
    id: 3,
    name: 'Sarah Lopez',
    email: 'sarah.l@email.com',
    score: 91,
    trend: 'up' as const,
    status: 'active',
    joinedAt: '2025-02-01',
    lastActivity: 'Il y a 4 heures',
  },
];

export default function CoachClients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = demoClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="heading-1 flex items-center gap-3">
              <Users className="w-8 h-8 accent-text" />
              Mes Clients
            </h1>
            <p className="text-secondary mt-2">
              Gère tes clients et suis leur progression
            </p>
          </div>
          
          <ProButton variant="primary" onClick={() => navigate('/coach/clients/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau client
          </ProButton>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-accent-color/30 outline-none transition-all"
            />
          </div>
          <ProButton variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </ProButton>
        </div>
      </motion.div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProCard hover onClick={() => navigate(`/coach/clients/${client.id}`)}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full accent-bg flex items-center justify-center text-2xl font-bold accent-text">
                  {client.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{client.name}</h3>
                  <p className="text-sm text-secondary">{client.email}</p>
                  <p className="text-xs text-secondary mt-1">{client.lastActivity}</p>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-secondary">SynrgyScore™</span>
                <span className={`text-2xl font-bold ${
                  client.score >= 80 ? 'text-success' : 'accent-text'
                }`}>
                  {client.score}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${client.score}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  className="h-full accent-bg"
                />
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <ProButton
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/coach/clients/${client.id}/program`);
                  }}
                >
                  Programme
                </ProButton>
                <ProButton
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/coach/clients/${client.id}/chat`);
                  }}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Chat
                </ProButton>
              </div>
            </ProCard>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Users className="w-16 h-16 mx-auto mb-4 text-secondary" />
          <h3 className="heading-3 mb-2">Aucun client trouvé</h3>
          <p className="text-secondary mb-6">
            {searchQuery ? 'Essaye une autre recherche' : 'Commence par ajouter ton premier client'}
          </p>
          {!searchQuery && (
            <ProButton variant="primary" onClick={() => navigate('/coach/clients/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un client
            </ProButton>
          )}
        </motion.div>
      )}
    </div>
  );
}
