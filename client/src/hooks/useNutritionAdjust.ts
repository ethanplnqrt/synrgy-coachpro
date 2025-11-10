import { useState, useEffect } from 'react';

interface NutritionParams {
  weight: string;
  goal: string;
  activity: string;
}

export function useNutritionAdjust({ weight, goal, activity }: NutritionParams) {
  const [adjustment, setAdjustment] = useState("");

  useEffect(() => {
    if (goal === "perte de poids") {
      setAdjustment("⚖️ Réduction automatique de 15% des calories.");
    } else if (goal === "prise de masse") {
      setAdjustment("💪 Augmentation automatique de 10% des protéines.");
    } else if (activity === "intense") {
      setAdjustment("🔥 Ajout d'un repas léger post-entraînement.");
    } else if (goal === "performance") {
      setAdjustment("🏃 Optimisation des glucides pour l'endurance.");
    } else {
      setAdjustment("");
    }
  }, [goal, activity]);

  return adjustment;
}
