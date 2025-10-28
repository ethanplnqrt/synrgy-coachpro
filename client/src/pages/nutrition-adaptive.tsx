import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { RefreshCw, Target, TrendingUp, Loader2, CheckCircle, AlertCircle, Package } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface NutritionPlan {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  meals: Meal[];
  createdAt: Date;
  adapted: boolean;
}

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  foods: Food[];
}

interface Food {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

export default function NutritionAdaptivePage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [isAdapting, setIsAdapting] = useState(false);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [myFoods, setMyFoods] = useState<Food[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("plan");

  // États pour la génération de plan
  const [planForm, setPlanForm] = useState({
    goal: "maintenance",
    activity: "moderate",
    weight: "",
    height: "",
    age: "",
    preferences: "none"
  });

  // Charger les aliments depuis localStorage
  useEffect(() => {
    const savedFoods = localStorage.getItem('synrgy-my-foods');
    if (savedFoods) {
      try {
        const foods = JSON.parse(savedFoods);
        setMyFoods(foods.map((food: any) => ({
          id: food.id,
          name: food.name,
          quantity: "100g",
          calories: food.calories,
          proteins: food.proteins,
          carbs: food.carbs,
          fats: food.fats
        })));
      } catch (e) {
        console.error('Erreur lors du chargement des aliments:', e);
      }
    }
  }, []);

  const generatePlan = async () => {
    setIsAdapting(true);
    setError(null);

    try {
      const response = await fetch('/api/nutrition/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...planForm,
          foods: myFoods
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const result = await response.json();
      setNutritionPlan(result);
    } catch (err) {
      setError('Erreur lors de la génération du plan');
    } finally {
      setIsAdapting(false);
    }
  };

  const adaptPlan = async () => {
    if (!nutritionPlan) return;

    setIsAdapting(true);
    setError(null);

    try {
      const response = await fetch('/api/nutrition/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan: nutritionPlan,
          foods: myFoods,
          preferences: planForm.preferences
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'adaptation');
      }

      const result = await response.json();
      setNutritionPlan({ ...result, adapted: true });
    } catch (err) {
      setError('Erreur lors de l\'adaptation du plan');
    } finally {
      setIsAdapting(false);
    }
  };

  const mockGeneratePlan = () => {
    setIsAdapting(true);
    setError(null);

    setTimeout(() => {
      const mockPlan: NutritionPlan = {
        id: Date.now().toString(),
        name: "Plan Nutrition IA",
        calories: 2200,
        proteins: 150,
        carbs: 250,
        fats: 80,
        meals: [
          {
            id: "1",
            name: "Petit-déjeuner",
            time: "08:00",
            calories: 500,
            foods: [
              { id: "1", name: "Flocons d'avoine", quantity: "50g", calories: 200, proteins: 8, carbs: 35, fats: 4 },
              { id: "2", name: "Banane", quantity: "1 unité", calories: 90, proteins: 1, carbs: 23, fats: 0.3 },
              { id: "3", name: "Lait d'amande", quantity: "200ml", calories: 60, proteins: 2, carbs: 8, fats: 2 }
            ]
          },
          {
            id: "2",
            name: "Collation",
            time: "11:00",
            calories: 200,
            foods: [
              { id: "4", name: "Yaourt grec", quantity: "150g", calories: 80, proteins: 9, carbs: 6, fats: 3 },
              { id: "5", name: "Noix", quantity: "15g", calories: 90, proteins: 2, carbs: 2, fats: 8 }
            ]
          },
          {
            id: "3",
            name: "Déjeuner",
            time: "13:00",
            calories: 700,
            foods: [
              { id: "6", name: "Poulet grillé", quantity: "150g", calories: 250, proteins: 45, carbs: 0, fats: 6 },
              { id: "7", name: "Riz basmati", quantity: "80g", calories: 280, proteins: 6, carbs: 60, fats: 1 },
              { id: "8", name: "Brocolis", quantity: "100g", calories: 35, proteins: 3, carbs: 7, fats: 0.4 }
            ]
          },
          {
            id: "4",
            name: "Goûter",
            time: "16:00",
            calories: 300,
            foods: [
              { id: "9", name: "Pomme", quantity: "1 unité", calories: 80, proteins: 0.3, carbs: 21, fats: 0.2 },
              { id: "10", name: "Amandes", quantity: "20g", calories: 120, proteins: 4, carbs: 4, fats: 10 }
            ]
          },
          {
            id: "5",
            name: "Dîner",
            time: "19:00",
            calories: 500,
            foods: [
              { id: "11", name: "Saumon", quantity: "120g", calories: 200, proteins: 35, carbs: 0, fats: 8 },
              { id: "12", name: "Quinoa", quantity: "60g", calories: 200, proteins: 8, carbs: 35, fats: 3 },
              { id: "13", name: "Épinards", quantity: "80g", calories: 20, proteins: 2, carbs: 3, fats: 0.3 }
            ]
          }
        ],
        createdAt: new Date(),
        adapted: false
      };

      setNutritionPlan(mockPlan);
      setIsAdapting(false);
    }, 2000);
  };

  const mockAdaptPlan = () => {
    if (!nutritionPlan) return;

    setIsAdapting(true);
    setError(null);

    setTimeout(() => {
      // Simuler une adaptation du plan
      const adaptedPlan = {
        ...nutritionPlan,
        calories: nutritionPlan.calories + 100,
        proteins: nutritionPlan.proteins + 10,
        adapted: true,
        name: "Plan Nutrition IA (Adapté)"
      };

      setNutritionPlan(adaptedPlan);
      setIsAdapting(false);
    }, 1500);
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🍎 Nutrition IA Adaptative
          </h1>
          <p className="text-muted-foreground">
            Plans nutritionnels intelligents qui s'adaptent à vos besoins et préférences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plan">Mon Plan</TabsTrigger>
            <TabsTrigger value="generate">Générer</TabsTrigger>
            <TabsTrigger value="foods">Mes Aliments</TabsTrigger>
          </TabsList>

          {/* Tab Mon Plan */}
          <TabsContent value="plan" className="space-y-6">
            {nutritionPlan ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {nutritionPlan.name}
                    </span>
                    <div className="flex gap-2">
                      {config?.testMode && (
                        <Button onClick={mockAdaptPlan} variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Adapter automatiquement
                        </Button>
                      )}
                      <Button onClick={adaptPlan} variant="outline" size="sm" disabled={isAdapting}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Adapter
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Résumé nutritionnel */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{nutritionPlan.calories}</div>
                      <div className="text-sm text-muted-foreground">Calories</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{nutritionPlan.proteins}g</div>
                      <div className="text-sm text-muted-foreground">Protéines</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{nutritionPlan.carbs}g</div>
                      <div className="text-sm text-muted-foreground">Glucides</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{nutritionPlan.fats}g</div>
                      <div className="text-sm text-muted-foreground">Lipides</div>
                    </div>
                  </div>

                  {/* Repas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Repas de la journée</h3>
                    {nutritionPlan.meals.map((meal) => (
                      <Card key={meal.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">{meal.name}</span>
                            <span className="text-sm text-muted-foreground">{meal.time}</span>
                          </CardTitle>
                          <div className="text-sm text-blue-600 font-medium">
                            {meal.calories} calories
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {meal.foods.map((food) => (
                              <div key={food.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <span className="font-medium">{food.name}</span>
                                  <span className="text-sm text-muted-foreground ml-2">({food.quantity})</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {food.calories} kcal • P: {food.proteins}g • C: {food.carbs}g • L: {food.fats}g
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {nutritionPlan.adapted && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-medium">Plan adapté avec succès !</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Aucun plan nutritionnel</h3>
                  <p className="text-muted-foreground mb-4">
                    Générez votre premier plan nutritionnel personnalisé
                  </p>
                  <Button onClick={() => setActiveTab("generate")}>
                    Créer un plan
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* État d'adaptation */}
            {isAdapting && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Adaptation en cours...</h3>
                  <p className="text-muted-foreground">
                    L'IA Synrgy adapte votre plan selon vos préférences
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Erreur */}
            {error && (
              <Card className="border-destructive">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
                  <h3 className="text-lg font-semibold mb-2 text-destructive">Erreur</h3>
                  <p className="text-muted-foreground">{error}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab Générer */}
          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Générer un plan nutritionnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal">Objectif</Label>
                    <Select value={planForm.goal} onValueChange={(value) => setPlanForm({...planForm, goal: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un objectif" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight_loss">Perte de poids</SelectItem>
                        <SelectItem value="weight_gain">Prise de poids</SelectItem>
                        <SelectItem value="maintenance">Maintien</SelectItem>
                        <SelectItem value="muscle_gain">Prise de muscle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="activity">Niveau d'activité</Label>
                    <Select value={planForm.activity} onValueChange={(value) => setPlanForm({...planForm, activity: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sédentaire</SelectItem>
                        <SelectItem value="light">Léger</SelectItem>
                        <SelectItem value="moderate">Modéré</SelectItem>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="very_active">Très actif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={planForm.weight}
                      onChange={(e) => setPlanForm({...planForm, weight: e.target.value})}
                      placeholder="70"
                    />
                  </div>

                  <div>
                    <Label htmlFor="height">Taille (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={planForm.height}
                      onChange={(e) => setPlanForm({...planForm, height: e.target.value})}
                      placeholder="175"
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">Âge</Label>
                    <Input
                      id="age"
                      type="number"
                      value={planForm.age}
                      onChange={(e) => setPlanForm({...planForm, age: e.target.value})}
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferences">Préférences alimentaires</Label>
                    <Select value={planForm.preferences} onValueChange={(value) => setPlanForm({...planForm, preferences: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir les préférences" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune</SelectItem>
                        <SelectItem value="vegetarian">Végétarien</SelectItem>
                        <SelectItem value="vegan">Végan</SelectItem>
                        <SelectItem value="keto">Cétogène</SelectItem>
                        <SelectItem value="paleo">Paléo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  {config?.testMode && (
                    <Button onClick={mockGeneratePlan} variant="secondary">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Test démo
                    </Button>
                  )}
                  <Button onClick={generatePlan} disabled={isAdapting}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Générer le plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Mes Aliments */}
          <TabsContent value="foods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Mes aliments disponibles ({myFoods.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myFoods.map((food) => (
                    <div key={food.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{food.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {food.calories} kcal • P: {food.proteins}g • C: {food.carbs}g • L: {food.fats}g
                        </p>
                      </div>
                    </div>
                  ))}
                  {myFoods.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Aucun aliment dans votre banque. Ajoutez-en depuis la page Scan !
                      </p>
                      <Button onClick={() => setLocation('/scan')} className="mt-4">
                        Aller au Scan IA
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation('/coach/dashboard')} variant="outline">
            Retour au dashboard
          </Button>
          <Button onClick={() => setLocation('/scan')} variant="outline">
            Scanner des aliments
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

