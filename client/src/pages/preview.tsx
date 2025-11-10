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
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0A1628] to-[#142038]">
      {/* Header translucide */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/60 border-b border-primary/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#D4AF37] animate-pulse-gold" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#E8C875] bg-clip-text text-transparent">
              Synrgy
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            Retour
          </Button>
        </div>
      </header>

      {/* Demo Alert Banner */}
      <Alert className="rounded-none border-x-0 border-t-0 bg-[#D4AF37]/10 border-[#D4AF37]/20">
        <Info className="h-4 w-4 text-[#D4AF37]" />
        <AlertDescription className="text-[#F5F5F5]">
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
        <Card className="mb-8 border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:shadow-[0_0_50px_rgba(212,175,55,0.25)] transition-all duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#F5F5F5]">
              <Sparkles className="h-5 w-5 text-[#D4AF37] animate-pulse" />
              Coach IA Synrgy - Mode Sandbox
            </CardTitle>
            <CardDescription className="text-[#CFCFCF]">
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
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E8C875] hover:from-[#E8C875] hover:to-[#D4AF37] text-[#0A0F1C] font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-[#0A0F1C] border-t-transparent rounded-full animate-spin" />
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
            className="group bg-gradient-to-r from-[#D4AF37] to-[#E8C875] hover:from-[#E8C875] hover:to-[#D4AF37] text-[#0A0F1C] font-bold shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] animate-pulse-gold"
          >
            Créer mon compte
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/')}
            className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300"
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
              <Card className="text-center border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-[#F5F5F5]">{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-[#CFCFCF]">{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

