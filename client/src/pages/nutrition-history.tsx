import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, Utensils, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

interface NutritionPlan {
  meals: Array<{
    name: string;
    items: Array<{
      food: string;
      amount: string;
      variant: string;
    }>;
  }>;
  calories: number;
  macros: {
    prot: number;
    carbs: number;
    fat: number;
  };
  timestamp: string;
  adjustments?: string;
}

export default function NutritionHistory() {
  const [history, setHistory] = useState<NutritionPlan[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('nutritionHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const getMacroPercentage = (plan: NutritionPlan, macro: 'prot' | 'carbs' | 'fat') => {
    const total = plan.macros.prot + plan.macros.carbs + plan.macros.fat;
    return Math.round((plan.macros[macro] / total) * 100);
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/nutrition">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au plan nutritionnel
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Historique nutritionnel</h1>
            <p className="text-muted-foreground">Consulte tes plans alimentaires précédents</p>
          </div>

          {history.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Utensils className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Aucun historique</h3>
                <p className="text-muted-foreground mb-4">
                  Génère ton premier plan nutritionnel pour voir l'historique ici.
                </p>
                <Link href="/nutrition">
                  <Button>Générer un plan</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((plan, index) => (
                <Card key={index} className="hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      Plan du {new Date(plan.timestamp).toLocaleDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Macros Summary */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-green-600">Résumé nutritionnel</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-xl font-bold text-green-600">{plan.calories}</div>
                            <div className="text-xs text-green-600">Calories</div>
                          </div>
                          
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-xl font-bold text-blue-600">{plan.macros.prot}g</div>
                            <div className="text-xs text-blue-600">Protéines</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Protéines</span>
                            <span className="font-medium">{getMacroPercentage(plan, 'prot')}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${getMacroPercentage(plan, 'prot')}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span>Glucides</span>
                            <span className="font-medium">{getMacroPercentage(plan, 'carbs')}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-600 h-2 rounded-full" 
                              style={{ width: `${getMacroPercentage(plan, 'carbs')}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span>Lipides</span>
                            <span className="font-medium">{getMacroPercentage(plan, 'fat')}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${getMacroPercentage(plan, 'fat')}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Meals */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-green-600">Repas</h3>
                        <div className="space-y-3">
                          {plan.meals.map((meal, mealIndex) => (
                            <div key={mealIndex} className="p-3 border rounded-lg">
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
                      </div>
                    </div>

                    {plan.adjustments && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-700">Ajustements appliqués</span>
                        </div>
                        <p className="text-sm text-blue-600">{plan.adjustments}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Statistiques globales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{history.length}</div>
                    <div className="text-sm text-green-600">Plans générés</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(history.reduce((sum, plan) => sum + plan.calories, 0) / history.length)}
                    </div>
                    <div className="text-sm text-blue-600">Calories moyennes</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(history.reduce((sum, plan) => sum + plan.macros.prot, 0) / history.length)}g
                    </div>
                    <div className="text-sm text-orange-600">Protéines moyennes</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {history.reduce((sum, plan) => sum + plan.meals.length, 0)}
                    </div>
                    <div className="text-sm text-purple-600">Total repas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
