import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useLocation } from 'wouter';
import { 
  Utensils, 
  Target, 
  Calendar, 
  Settings,
  ArrowRight
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';

export default function AthleteNutritionCreate() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    mealsPerDay: 4,
    dietaryRestrictions: [] as string[],
    allergies: '',
    cookingTime: 30,
    budget: 'medium'
  });

  const goals = [
    { id: 'weight_loss', label: 'Perte de poids' },
    { id: 'weight_gain', label: 'Prise de poids' },
    { id: 'maintenance', label: 'Maintien' }
  ];

  const restrictions = [
    { id: 'vegetarian', label: 'Végétarien' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten_free', label: 'Sans gluten' },
    { id: 'lactose_free', label: 'Sans lactose' }
  ];

  const handleGeneratePlan = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store the created plan
    localStorage.setItem('athlete_nutrition_plan', JSON.stringify({
      ...formData,
      created: true
    }));
    
    // Redirect to nutrition page
    setLocation('/dashboard/athlete/nutrition');
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
            Créer mon plan nutritionnel
          </h1>
          <p className="text-muted-foreground mt-2">
            L'IA va générer un plan adapté à tes besoins et préférences
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objectif nutritionnel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Goal */}
              <div>
                <Label>Quel est ton objectif ?</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setFormData(prev => ({ ...prev, goal: goal.id }))}
                      className={`p-4 border rounded-lg transition-all ${
                        formData.goal === goal.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meals per day */}
              <div>
                <Label>Nombre de repas par jour</Label>
                <div className="flex gap-2 mt-2">
                  {[3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setFormData(prev => ({ ...prev, mealsPerDay: num }))}
                      className={`flex-1 p-3 border rounded-lg transition-all ${
                        formData.mealsPerDay === num
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary restrictions */}
              <div>
                <Label>Régime alimentaire</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {restrictions.map((restriction) => (
                    <button
                      key={restriction.id}
                      onClick={() => {
                        const restrictions = formData.dietaryRestrictions;
                        if (restrictions.includes(restriction.id)) {
                          setFormData(prev => ({ 
                            ...prev, 
                            dietaryRestrictions: restrictions.filter(id => id !== restriction.id)
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            dietaryRestrictions: [...restrictions, restriction.id]
                          }));
                        }
                      }}
                      className={`p-3 border rounded-lg transition-all text-left ${
                        formData.dietaryRestrictions.includes(restriction.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {restriction.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cooking time */}
              <div>
                <Label>Temps disponible pour cuisiner (min)</Label>
                <Input
                  type="number"
                  value={formData.cookingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: parseInt(e.target.value) || 30 }))}
                  min="10"
                  max="120"
                  className="mt-2"
                />
              </div>

              {/* Allergies */}
              <div>
                <Label>Allergies (optionnel)</Label>
                <Input
                  type="text"
                  placeholder="Ex: noix, crustacés..."
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  className="mt-2"
                />
              </div>

              <Button
                className="w-full btn-primary"
                onClick={handleGeneratePlan}
                disabled={!formData.goal}
              >
                Générer mon plan nutritionnel
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
