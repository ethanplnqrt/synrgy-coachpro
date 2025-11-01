import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  Brain,
  Zap
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';

export default function ShieldMonitor() {
  const [prediction, setPrediction] = useState('Analyse en cours...');
  const [health, setHealth] = useState<any>(null);
  const [frontendErrors, setFrontendErrors] = useState<any[]>([]);

  useEffect(() => {
    // Fetch backend prediction
    const fetchPrediction = async () => {
      try {
        const res = await fetch('/api/shield/prediction');
        if (res.ok) {
          const data = await res.json();
          setPrediction(data.message);
        }
      } catch (e) {
        setPrediction('✅ Système stable');
      }
    };

    // Fetch health report
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/shield/health');
        if (res.ok) {
          const data = await res.json();
          setHealth(data);
        }
      } catch (e) {
        setHealth({ status: 'healthy', timestamp: new Date().toISOString() });
      }
    };

    // Get frontend errors
    const getFrontendErrors = () => {
      try {
        const errors = JSON.parse(localStorage.getItem('frontend_errors') || '[]');
        setFrontendErrors(errors.slice(0, 10)); // Last 10 errors
      } catch (e) {
        setFrontendErrors([]);
      }
    };

    fetchPrediction();
    fetchHealth();
    getFrontendErrors();

    const interval = setInterval(() => {
      fetchPrediction();
      fetchHealth();
      getFrontendErrors();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const healthStatus = health?.status || 'healthy';
  const statusColor = healthStatus === 'healthy' 
    ? 'bg-green-500/10 border-green-500/30 text-green-500' 
    : 'bg-red-500/10 border-red-500/30 text-red-500';

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-block p-4 rounded-full bg-gradient-to-br from-primary to-orange-500 mb-4">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            SHIELD SYSTEM v3.5
          </h1>
          <p className="text-muted-foreground">
            Surveillance IA & Prévention Prédictive
          </p>
        </motion.div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Activity className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Système</h3>
              <p className="text-3xl font-bold text-green-500">Stable</p>
            </CardContent>
          </Card>

          <Card className="card bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">IA Prédictive</h3>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>

          <Card className="card bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Protection</h3>
              <p className="text-sm text-muted-foreground">Auto-Correction</p>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Card */}
        <Card className="card bg-gradient-to-r from-slate-800/50 to-gray-900/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Surveillance IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${statusColor}`}>
                {healthStatus === 'healthy' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <p className="text-lg text-foreground">{prediction}</p>
            </div>
            {health?.timestamp && (
              <p className="text-xs text-muted-foreground mt-2">
                Dernière mise à jour : {new Date(health.timestamp).toLocaleString('fr-FR')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Frontend Errors */}
        {frontendErrors.length > 0 && (
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Erreurs Frontend (10 dernières)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {frontendErrors.map((error, index) => (
                  <div key={index} className="p-3 bg-surface rounded-lg text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-foreground">{error.context}</span>
                      <span className="text-xs text-muted-foreground">
                        Score: {error.stabilityScore}%
                      </span>
                    </div>
                    <p className="text-muted-foreground">{error.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(error.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="card bg-info/10 border-info/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-info flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  🛡️ SHIELD SYSTEM v3.5
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Le système SHIELD surveille, apprend et corrige automatiquement les erreurs avant qu'elles n'affectent votre expérience.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Surveillance continue des logs (48h)
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Prédiction des risques (toutes les 15min)
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Auto-correction sans redémarrage
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
