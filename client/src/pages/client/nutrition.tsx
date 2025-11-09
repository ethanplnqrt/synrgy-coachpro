/**
 * 🍽 CLIENT NUTRITION PAGE
 * 
 * Nutrition plan + Macros sync integration.
 * - View coach's nutrition plan
 * - Connect Macros app
 * - Sync and view imported data
 * - Coherence report
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Apple, Link as LinkIcon, RefreshCw, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClientNutrition() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [nutritionPlan, setNutritionPlan] = useState<any>(null);
  const [macrosConnected, setMacrosConnected] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchNutritionData();
  }, []);

  const fetchNutritionData = async () => {
    try {
      setLoading(true);

      // Fetch nutrition plan
      const planRes = await fetch(`/api/nutrition/plan/${user?.id}`, {
        credentials: 'include',
      });
      if (planRes.ok) {
        const data = await planRes.json();
        setNutritionPlan(data);
      }

      // Check if Macros is connected
      setMacrosConnected(!!user?.integrations?.macrosToken);
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectMacros = async () => {
    try {
      const res = await fetch('/api/nutrition/macros/auth-url', {
        credentials: 'include',
      });

      if (res.ok) {
        const { authUrl } = await res.json();
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error('Error connecting Macros:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de se connecter à Macros',
        variant: 'destructive',
      });
    }
  };

  const syncMacros = async () => {
    try {
      setSyncing(true);

      const res = await fetch('/api/nutrition/macros/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          useMock: true, // Use mock data for demo
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setSyncResult(result);
        toast({
          title: 'Synchronisation réussie !',
          description: `${result.entriesImported} entrées importées`,
        });
      }
    } catch (error) {
      console.error('Error syncing Macros:', error);
      toast({
        title: 'Erreur',
        description: 'Échec de la synchronisation',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Nutrition</h1>
        <p className="text-muted-foreground mt-1">Ton plan et tes données nutritionnelles</p>
      </div>

      {/* Nutrition Plan */}
      {nutritionPlan ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Plan Nutrition
            </CardTitle>
            <CardDescription>{nutritionPlan.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {nutritionPlan.targetCalories}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {nutritionPlan.targetProtein}g
                </div>
                <div className="text-sm text-muted-foreground mt-1">Protéines</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {nutritionPlan.targetCarbs}g
                </div>
                <div className="text-sm text-muted-foreground mt-1">Glucides</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {nutritionPlan.targetFat}g
                </div>
                <div className="text-sm text-muted-foreground mt-1">Lipides</div>
              </div>
            </div>

            {nutritionPlan.description && (
              <div className="mt-6 p-4 bg-accent rounded-lg">
                <p className="text-sm">{nutritionPlan.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Apple className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Aucun plan nutrition</h2>
            <p className="text-muted-foreground">
              Ton coach n'a pas encore créé de plan pour toi.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Macros Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Intégration Macros
              </CardTitle>
              <CardDescription>
                Connecte Macros pour synchroniser automatiquement tes données
              </CardDescription>
            </div>
            {macrosConnected ? (
              <Badge variant="default">Connecté</Badge>
            ) : (
              <Badge variant="secondary">Non connecté</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!macrosConnected ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Connecte ton compte Macros pour importer automatiquement tes données nutritionnelles.
              </p>
              <Button onClick={connectMacros}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Connecter Macros
              </Button>
            </div>
          ) : (
            <>
              <Button onClick={syncMacros} disabled={syncing} className="w-full">
                {syncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Synchronisation...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Synchroniser maintenant
                  </>
                )}
              </Button>

              {syncResult && (
                <div className="p-4 bg-accent rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Dernière synchronisation</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(syncResult.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xl font-bold">{syncResult.totals.calories}</div>
                      <div className="text-xs text-muted-foreground">Calories</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{syncResult.totals.protein}g</div>
                      <div className="text-xs text-muted-foreground">Protéines</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{syncResult.totals.carbs}g</div>
                      <div className="text-xs text-muted-foreground">Glucides</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{syncResult.totals.fat}g</div>
                      <div className="text-xs text-muted-foreground">Lipides</div>
                    </div>
                  </div>

                  {syncResult.coherenceReport && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Adhérence</span>
                        <span className="text-sm font-bold">{syncResult.coherenceReport.adherence}%</span>
                      </div>
                      <Progress value={syncResult.coherenceReport.adherence} />
                      <p className="text-sm text-muted-foreground">
                        {syncResult.coherenceReport.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Astuce Synrgy</h3>
              <p className="text-sm text-muted-foreground">
                Pour de meilleurs résultats, synchronise tes données Macros quotidiennement. 
                L'IA Synrgy analysera la cohérence entre ton plan et ta consommation réelle 
                pour t'aider à atteindre tes objectifs plus rapidement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
