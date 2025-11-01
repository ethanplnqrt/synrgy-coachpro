import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Users, 
  Copy, 
  CheckCircle2, 
  UserPlus,
  Target,
  Calendar,
  Zap
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';

export default function CoachReferrals() {
  const { data: user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock followers data
  const followers = [
    {
      name: 'Léa Martin',
      status: 'active',
      registeredAt: new Date('2024-01-15'),
      progress: 85
    },
    {
      name: 'Maxime Dubois',
      status: 'active',
      registeredAt: new Date('2024-01-20'),
      progress: 72
    },
    {
      name: 'Sophie Bernard',
      status: 'inactive',
      registeredAt: new Date('2024-01-10'),
      progress: 45
    }
  ];

  const generateReferralLink = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/referral/create', {
        ownerId: user?.id || 'coach_1',
        ownerName: user?.fullName || 'Coach',
        type: 'coach'
      });

      const data = await response.json();
      setReferralCode(data.code);
      setReferralLink(data.link);
      
      toast({
        title: 'Lien généré',
        description: 'Ton lien d\'invitation est prêt !',
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">
            Mes invitations
          </h1>
          <p className="text-muted-foreground mt-2">
            Invite tes clients via un lien unique et suive leur progression
          </p>
        </motion.div>

        {/* Generate Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card bg-gradient-to-br from-primary/10 to-orange-500/10 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-primary" />
                Générer un lien d'invitation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!referralLink ? (
                <Button
                  onClick={generateReferralLink}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Génération...' : 'Créer mon lien d\'invitation'}
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Code d'invitation</p>
                    <div className="flex items-center gap-3">
                      <code className="text-2xl font-bold text-primary font-mono">
                        {referralCode}
                      </code>
                      <Badge className="badge-primary">Actif</Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Lien d'invitation</p>
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

                  <p className="text-sm text-muted-foreground">
                    💡 Partage ce lien avec tes clients. Ils pourront s'inscrire et seront automatiquement liés à ton compte.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Followers List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Mes clients invités
                </CardTitle>
                <Badge className="badge-primary">
                  {followers.length} client{followers.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {followers.map((follower, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold">
                          {follower.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{follower.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Inscrit le {follower.registeredAt.toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Badge className={follower.status === 'active' ? 'badge-success' : 'badge-muted'}>
                        {follower.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progression</span>
                          <span className="font-semibold text-foreground">{follower.progress}%</span>
                        </div>
                        <div className="w-full bg-surface rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${follower.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {followers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Aucun client invité pour le moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="card">
            <CardContent className="p-6">
              <div className="text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {followers.filter(f => f.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Clients actifs</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="text-center">
                <Zap className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(followers.reduce((acc, f) => acc + f.progress, 0) / followers.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Progression moyenne</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-info mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{followers.length}</p>
                <p className="text-sm text-muted-foreground">Total invités</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
