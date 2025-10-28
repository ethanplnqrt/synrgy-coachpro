import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Heart, Activity, Target, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface RehabPlan {
  id: string;
  title: string;
  description: string;
  exercises: string[];
  frequency: string;
  duration: number;
  precautions: string[];
}

export default function RehabPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [isGenerating, setIsGenerating] = useState(false);
  const [rehabPlan, setRehabPlan] = useState<RehabPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    injury: "",
    severity: "",
    duration: "",
    goals: "",
    limitations: ""
  });

  const generateRehabPlan = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/rehab/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const result = await response.json();
      setRehabPlan(result);
    } catch (err) {
      setError('Erreur lors de la génération du plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const mockGeneratePlan = () => {
    setIsGenerating(true);
    setError(null);

    setTimeout(() => {
      const mockPlan: RehabPlan = {
        id: Date.now().toString(),
        title: "Plan de réhabilitation personnalisé",
        description: "Programme adapté à votre situation pour une récupération optimale",
        exercises: [
          "Étirements doux 2x/jour",
          "Renforcement musculaire progressif",
          "Exercices de mobilité articulaire",
          "Marche quotidienne 30 min"
        ],
        frequency: "3x/semaine",
        duration: 6,
        precautions: [
          "Éviter les mouvements brusques",
          "Arrêter en cas de douleur",
          "Progression graduelle",
          "Hydratation importante"
        ]
      };

      setRehabPlan(mockPlan);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🏥 Santé & Réhabilitation
          </h1>
          <p className="text-muted-foreground">
            Plans de réhabilitation personnalisés pour votre récupération
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Questionnaire de santé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="injury">Blessure/Problème</Label>
                <Input
                  id="injury"
                  value={formData.injury}
                  onChange={(e) => setFormData({...formData, injury: e.target.value})}
                  placeholder="Ex: Entorse genou"
                />
              </div>
              <div>
                <Label htmlFor="severity">Sévérité</Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Légère</SelectItem>
                    <SelectItem value="moderate">Modérée</SelectItem>
                    <SelectItem value="severe">Sévère</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Durée</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="Ex: 2 semaines"
                />
              </div>
              <div>
                <Label htmlFor="goals">Objectifs</Label>
                <Input
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  placeholder="Ex: Retour au sport"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="limitations">Limitations</Label>
              <Input
                id="limitations"
                value={formData.limitations}
                onChange={(e) => setFormData({...formData, limitations: e.target.value})}
                placeholder="Ex: Pas de flexion profonde"
              />
            </div>

            <div className="flex gap-2 justify-center">
              {config?.testMode && (
                <Button onClick={mockGeneratePlan} variant="secondary" disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Test démo
                </Button>
              )}
              <Button onClick={generateRehabPlan} disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Target className="w-4 h-4 mr-2" />
                )}
                Générer le plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {rehabPlan && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                Plan de réhabilitation généré
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{rehabPlan.title}</h3>
                <p className="text-muted-foreground">{rehabPlan.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <Activity className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold">Fréquence</div>
                  <div className="text-sm text-muted-foreground">{rehabPlan.frequency}</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold">Durée</div>
                  <div className="text-sm text-muted-foreground">{rehabPlan.duration} semaines</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
                  <div className="font-semibold">Exercices</div>
                  <div className="text-sm text-muted-foreground">{rehabPlan.exercises.length}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Exercices recommandés</h4>
                  <ul className="space-y-1">
                    {rehabPlan.exercises.map((exercise, index) => (
                      <li key={index} className="text-sm">• {exercise}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Précautions</h4>
                  <ul className="space-y-1">
                    {rehabPlan.precautions.map((precaution, index) => (
                      <li key={index} className="text-sm">⚠️ {precaution}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2 text-destructive">Erreur</h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation('/coach/dashboard')} variant="outline">
            Retour au dashboard
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

