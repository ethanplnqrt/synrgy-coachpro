/**
 * 🎭 PREVIEW MODE - Public Demo Page
 * 
 * Allows visitors to test Synrgy Codex AI without authentication
 * All data is mocked, no database writes
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, ArrowRight, Info } from 'lucide-react';

export default function PreviewPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskCodex = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    // Mock response for demo (no actual API call in preview mode)
    setTimeout(() => {
      setResponse(
        `🎯 Analyse Synrgy:\n\n` +
        `Basé sur votre demande "${prompt}", voici mes recommandations:\n\n` +
        `1. Focus sur la progression régulière\n` +
        `2. Adapter l'intensité selon votre niveau\n` +
        `3. Maintenir la cohérence dans vos entraînements\n\n` +
        `💡 Cette démo utilise des données fictives. Créez un compte pour accéder à votre coach IA personnalisé !`
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Demo Alert Banner */}
      <Alert className="rounded-none border-x-0 border-t-0 bg-amber-500/10 border-amber-500/20">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Mode Démo</strong> – Les données ne sont pas sauvegardées. Créez un compte pour une expérience complète.
        </AlertDescription>
      </Alert>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Démo Interactive Synrgy</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Bienvenue sur la démo Synrgy
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Testez le coach IA librement et découvrez comment Synrgy peut transformer votre entraînement 👇
          </p>
        </div>

        {/* Codex Sandbox */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Coach IA Synrgy - Mode Sandbox
            </CardTitle>
            <CardDescription>
              Posez une question sur l'entraînement, la nutrition ou la récupération
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ex: Comment optimiser ma récupération musculaire ? Quels exercices pour progresser aux tractions ?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none rounded-xl"
              disabled={loading}
            />
            
            <Button
              onClick={handleAskCodex}
              disabled={loading || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Codex réfléchit...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Demander au Coach IA
                </>
              )}
            </Button>

            {response && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-primary/5 border border-primary/20 rounded-xl"
              >
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {response}
                </pre>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="group"
          >
            Créer mon compte
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/')}
          >
            Découvrir Synrgy
          </Button>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { title: 'Coach IA 24/7', desc: 'Réponses personnalisées instantanées' },
            { title: 'Plans sur mesure', desc: 'Programmes et nutrition adaptés' },
            { title: 'Suivi complet', desc: 'Progression, analytics et objectifs' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
            >
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

