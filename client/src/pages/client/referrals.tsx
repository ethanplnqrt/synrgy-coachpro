import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Heart, 
  Copy, 
  CheckCircle2, 
  Users,
  Sparkles,
  Gift
} from 'lucide-react';
import { PageWrapper } from '../../components/PageWrapper';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest } from '../../lib/queryClient';
import { useToast } from '../../hooks/use-toast';

export default function ClientReferrals() {
  const { data: user } = useAuth();
  const { toast } = useToast();
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock referred users data
  const referredUsers = [
    {
      name: 'Thomas Leroy',
      status: 'active',
      registeredAt: new Date('2024-01-18')
    },
    {
      name: 'Emma Rousseau',
      status: 'active',
      registeredAt: new Date('2024-01-22')
    }
  ];

  const generateReferralLink = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/referral/create', {
        ownerId: user?.id || 'client_1',
        ownerName: user?.fullName || 'Client',
        type: 'client'
      });

      const data = await response.json();
      setReferralLink(data.link);
      
      toast({
        title: 'Lien généré',
        description: 'Ton lien de parrainage est prêt !',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le lien',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: 'Copié !',
        description: 'Le lien a été copié dans le presse-papier',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-foreground">
            Parrainer un ami
          </h1>
          <p className="text-muted-foreground mt-2">
            💪 Fais découvrir Synrgy à un ami et débloque des avantages exclusifs !
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card bg-gradient-to-br from-secondary/10 to-blue-500/10 border-secondary/30">
            <CardHeader className="text-center">
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-secondary to-blue-500 mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">
                Partage ton énergie 💥
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Invite tes amis à rejoindre Synrgy et aide-les à progresser. 
                Plus d'athlètes, plus d'énergie partagée !
              </p>

              {!referralLink ? (
                <Button
                  onClick={generateReferralLink}
                  disabled={loading}
                  className="btn-secondary w-full"
                >
                  {loading ? 'Génération...' : 'Créer mon lien'}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Ton lien de parrainage</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 p-2 border border-border rounded-lg bg-background text-foreground text-sm"
                      />
                      <Button
                        onClick={copyToClipboard}
                        variant={copied ? 'default' : 'outline'}
                        className={copied ? 'bg-secondary' : ''}
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Copié
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copier
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div className="text-center p-4 bg-surface rounded-lg">
                  <Gift className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">Avantages exclusifs</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Débloque des récompenses
                  </p>
                </div>
                <div className="text-center p-4 bg-surface rounded-lg">
                  <Users className="w-6 h-6 text-info mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">Communauté grandissante</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Plus on est, plus on progresse
                  </p>
                </div>
                <div className="text-center p-4 bg-surface rounded-lg">
                  <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">Impact positif</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aide tes amis à progresser
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Referred Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Mes filleuls
                </CardTitle>
                <Badge className="badge-secondary">
                  {referredUsers.length} ami{referredUsers.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {referredUsers.map((ref, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-blue-500 flex items-center justify-center text-white font-bold">
                        {ref.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{ref.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Inscrit le {ref.registeredAt.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <Badge className="badge-success">Actif</Badge>
                  </motion.div>
                ))}
              </div>

              {referredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Aucune personne parrainée pour le moment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
