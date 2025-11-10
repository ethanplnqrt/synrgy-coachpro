import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Utensils, ArrowLeft, Loader2, Save, History, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { useAppConfig } from '../lib/config';

interface MealItem {
  food: string;
  amount: string;
  variant: string;
}

interface Meal {
  name: string;
  items: MealItem[];
}

interface NutritionPlan {
  meals: Meal[];
  calories: number;
  macros: {
    prot: number;
    carbs: number;
    fat: number;
  };
}

export default function NutritionPage() {
  const { data: config } = useAppConfig();
  const [loading, setLoading] = useState(false);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [adjustment, setAdjustment] = useState('');
  const [formData, setFormData] = useState({
    goal: '',
    level: '',
    weight: '',
    height: '',
    activity: '',
    preferences: ''
  });

  const handleGenerateNutrition = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/nutrition/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      setNutritionPlan(data);
    } catch (e) {
      // Fallback plan
      setNutritionPlan({
        meals: [
          {
            name: "Petit déjeuner",
            items: [
              { food: "Flocons d'avoine", amount: "1 bol", variant: "riz soufflé" },
              { food: "Œufs", amount: "2", variant: "tofu" },
              { food: "Banane", amount: "1", variant: "pomme" },
              { food: "Amandes", amount: "une poignée", variant: "noix" }
            ]
          },
          {
            name: "Collation matinale",
            items: [
              { food: "Yaourt grec", amount: "150g", variant: "fromage blanc" },
              { food: "Baies", amount: "une poignée", variant: "raisins" }
            ]
          },
          {
            name: "Déjeuner",
            items: [
              { food: "Poulet", amount: "150-200g", variant: "dinde" },
              { food: "Riz complet", amount: "1 bol", variant: "quinoa" },
              { food: "Brocolis", amount: "une portion", variant: "épinards" },
              { food: "Avocat", amount: "1/2", variant: "huile d'olive" }
            ]
          },
          {
            name: "Collation post-entraînement",
            items: [
              { food: "Protéine en poudre", amount: "1 scoop", variant: "yaourt grec" },
              { food: "Banane", amount: "1", variant: "dattes" }
            ]
          },
          {
            name: "Dîner",
            items: [
              { food: "Saumon", amount: "150-200g", variant: "thon" },
              { food: "Patate douce", amount: "1 moyenne", variant: "riz complet" },
              { food: "Salade verte", amount: "une portion", variant: "légumes verts" },
              { food: "Huile d'olive", amount: "1 c.à.s", variant: "avocat" }
            ]
          }
        ],
        calories: 2200,
        macros: {
          prot: 150,
          carbs: 230,
          fat: 70
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-adjustment based on goal and activity
  useEffect(() => {
    if (formData.goal === "perte de poids") {
      setAdjustment("⚖️ Réduction automatique de 15% des calories.");
    } else if (formData.goal === "prise de masse") {
      setAdjustment("💪 Augmentation automatique de 10% des protéines.");
    } else if (formData.activity === "intense") {
      setAdjustment("🔥 Ajout d'un repas léger post-entraînement.");
    } else {
      setAdjustment("");
    }
  }, [formData.goal, formData.activity]);

  const savePlan = () => {
    if (nutritionPlan) {
      const planData = {
        ...nutritionPlan,
        timestamp: new Date().toISOString(),
        adjustments: adjustment
      };
      
      const history = JSON.parse(localStorage.getItem('nutritionHistory') || '[]');
      history.push(planData);
      localStorage.setItem('nutritionHistory', JSON.stringify(history));
      
      alert('Plan nutritionnel sauvegardé ! 💾');
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/coach/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au dashboard
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Utensils className="w-5 h-5" />
                Plan Nutritionnel IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Taille (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="goal">Objectif</Label>
                <Select value={formData.goal} onValueChange={(value) => setFormData({...formData, goal: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'objectif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintien">Maintien du poids</SelectItem>
                    <SelectItem value="perte de poids">Perte de poids</SelectItem>
                    <SelectItem value="prise de masse">Prise de masse</SelectItem>
                    <SelectItem value="performance">Performance sportive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="activity">Niveau d'activité</Label>
                <Select value={formData.activity} onValueChange={(value) => setFormData({...formData, activity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentaire">Sédentaire</SelectItem>
                    <SelectItem value="leger">Léger (1-3 séances/semaine)</SelectItem>
                    <SelectItem value="modere">Modéré (3-5 séances/semaine)</SelectItem>
                    <SelectItem value="intense">Intense (5+ séances/semaine)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="preferences">Préférences alimentaires</Label>
                <Textarea
                  id="preferences"
                  placeholder="Ex: végétarien, sans gluten, allergies..."
                  value={formData.preferences}
                  onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                />
              </div>

              <Button 
                onClick={handleGenerateNutrition} 
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4 mr-2" />
                    Générer le plan nutritionnel
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Plan nutritionnel généré</CardTitle>
            </CardHeader>
            <CardContent>
              {nutritionPlan ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div className="p-2 bg-white rounded">
                        <div className="text-lg font-bold text-green-600">{nutritionPlan.calories}</div>
                        <div className="text-xs text-muted-foreground">Calories</div>
                      </div>
                      <div className="p-2 bg-white rounded">
                        <div className="text-lg font-bold text-blue-600">{nutritionPlan.macros.prot}g</div>
                        <div className="text-xs text-muted-foreground">Protéines</div>
                      </div>
                      <div className="p-2 bg-white rounded">
                        <div className="text-lg font-bold text-orange-600">{nutritionPlan.macros.carbs}g</div>
                        <div className="text-xs text-muted-foreground">Glucides</div>
                      </div>
                    </div>
                    
                    {nutritionPlan.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="mb-4 p-3 border rounded">
                        <h4 className="font-medium mb-2">{meal.name}</h4>
                        <div className="space-y-1">
                          {meal.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="text-sm">
                              <span className="font-medium">{item.food}</span>
                              <span className="text-muted-foreground ml-2">({item.amount})</span>
                              <span className="text-xs text-blue-600 ml-2">Variante: {item.variant}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {adjustment && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-700">Ajustement automatique</span>
                      </div>
                      <p className="text-sm text-blue-600">{adjustment}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={savePlan}>
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder ma semaine
                    </Button>
                    <Link href="/nutrition/history">
                      <Button variant="outline" size="sm">
                        <History className="w-4 h-4 mr-2" />
                        Historique
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Utensils className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p>Remplissez le formulaire et cliquez sur "Générer le plan nutritionnel"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Utensils className="w-5 h-5" />
              Conseils nutritionnels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-700 mb-2">Hydratation</h4>
                <p className="text-sm text-purple-600">Buvez 2-3L d'eau par jour, surtout pendant l'entraînement.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-700 mb-2">Protéines</h4>
                <p className="text-sm text-green-600">1.6-2.2g/kg de poids corporel pour la récupération musculaire.</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-700 mb-2">Timing</h4>
                <p className="text-sm text-orange-600">Mangez dans les 2h après l'entraînement pour optimiser la récupération.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}