import { db } from '../db';
import { checkIns, nutritionPlans, trainingPlans, users } from '../../shared/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

interface WeeklyAverages {
  weight: number;
  steps: number;
  sleep: number;
  hunger: number;
  energy: number;
  pain: number;
  adherence: number;
  weightTrend: number; // kg per week
}

interface NutritionAdjustment {
  type: 'calories' | 'macros' | 'timing';
  currentValue: string;
  proposedValue: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

interface TrainingAdjustment {
  type: 'volume' | 'intensity' | 'frequency' | 'deload';
  currentValue: string;
  proposedValue: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

interface AIApproval {
  athleteId: string;
  athleteName: string;
  type: 'nutrition' | 'training';
  suggestion: string;
  currentValue: string;
  proposedValue: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Calcule les moyennes hebdomadaires pour un athlète
 */
export async function computeWeeklyAverages(athleteId: string): Promise<WeeklyAverages> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Récupérer les check-ins de la dernière semaine
  const recentCheckIns = await db
    .select()
    .from(checkIns)
    .where(
      and(
        eq(checkIns.athleteId, athleteId),
        gte(checkIns.date, oneWeekAgo)
      )
    )
    .orderBy(checkIns.date);

  if (recentCheckIns.length === 0) {
    return {
      weight: 0,
      steps: 0,
      sleep: 0,
      hunger: 0,
      energy: 0,
      pain: 0,
      adherence: 0,
      weightTrend: 0
    };
  }

  // Calculer les moyennes
  const averages = recentCheckIns.reduce((acc, checkIn) => {
    acc.weight += checkIn.mood || 0; // Utiliser mood comme proxy pour le poids
    acc.steps += 0; // Pas de données de pas dans le schéma actuel
    acc.sleep += checkIn.sleep || 0;
    acc.hunger += 0; // Pas de données de faim dans le schéma actuel
    acc.energy += checkIn.energy || 0;
    acc.pain += checkIn.pain || 0;
    acc.adherence += checkIn.adherence || 0;
    return acc;
  }, {
    weight: 0,
    steps: 0,
    sleep: 0,
    hunger: 0,
    energy: 0,
    pain: 0,
    adherence: 0
  });

  const count = recentCheckIns.length;
  const weeklyAverages = {
    weight: averages.weight / count,
    steps: averages.steps / count,
    sleep: averages.sleep / count,
    hunger: averages.hunger / count,
    energy: averages.energy / count,
    pain: averages.pain / count,
    adherence: averages.adherence / count,
    weightTrend: 0 // Calculer la tendance du poids
  };

  // Calculer la tendance du poids (simulation)
  if (recentCheckIns.length >= 2) {
    const firstWeight = recentCheckIns[0].mood || 0;
    const lastWeight = recentCheckIns[recentCheckIns.length - 1].mood || 0;
    weeklyAverages.weightTrend = lastWeight - firstWeight;
  }

  return weeklyAverages;
}

/**
 * Suggère des ajustements nutritionnels basés sur les données
 */
export function suggestNutritionAdjustments(data: WeeklyAverages, goal: 'weight_loss' | 'maintenance' | 'weight_gain'): NutritionAdjustment[] {
  const suggestions: NutritionAdjustment[] = [];

  if (goal === 'weight_loss') {
    // Perte de poids
    if (data.weightTrend > -0.1) {
      suggestions.push({
        type: 'calories',
        currentValue: '2500 kcal',
        proposedValue: '2375 kcal (-5%)',
        reason: 'Perte de poids trop lente, réduire les calories',
        priority: 'medium'
      });
    } else if (data.weightTrend < -0.8) {
      suggestions.push({
        type: 'calories',
        currentValue: '2500 kcal',
        proposedValue: '2625 kcal (+5%)',
        reason: 'Perte de poids trop rapide, augmenter les calories',
        priority: 'high'
      });
    }

    if (data.hunger > 4) {
      suggestions.push({
        type: 'macros',
        currentValue: '300g glucides',
        proposedValue: '315g glucides (+5%)',
        reason: 'Niveau de faim élevé, augmenter les glucides',
        priority: 'medium'
      });
    }
  } else if (goal === 'weight_gain') {
    // Prise de poids
    if (data.weightTrend < 0.1) {
      suggestions.push({
        type: 'calories',
        currentValue: '2800 kcal',
        proposedValue: '2940 kcal (+5%)',
        reason: 'Prise de poids trop lente, augmenter les calories',
        priority: 'medium'
      });
    }

    if (data.energy < 3) {
      suggestions.push({
        type: 'macros',
        currentValue: 'Répartition standard',
        proposedValue: 'Plus de glucides, moins de lipides',
        reason: 'Énergie basse, optimiser la répartition des macros',
        priority: 'high'
      });
    }
  } else {
    // Maintien
    if (data.energy < 3 && data.adherence < 70) {
      suggestions.push({
        type: 'macros',
        currentValue: 'Répartition standard',
        proposedValue: 'Plus de protéines, moins de lipides',
        reason: 'Énergie et adhérence faibles, ajuster les macros',
        priority: 'high'
      });
    }
  }

  return suggestions;
}

/**
 * Suggère des ajustements d'entraînement basés sur les données
 */
export function suggestTrainingAdjustments(data: WeeklyAverages): TrainingAdjustment[] {
  const suggestions: TrainingAdjustment[] = [];

  // Adhérence faible
  if (data.adherence < 70) {
    suggestions.push({
      type: 'deload',
      currentValue: 'Volume normal',
      proposedValue: 'Volume -30%',
      reason: 'Adhérence faible, semaine de deload recommandée',
      priority: 'high'
    });
  }

  // Fatigue élevée
  if (data.energy < 3 || data.pain > 4) {
    suggestions.push({
      type: 'volume',
      currentValue: 'Volume normal',
      proposedValue: 'Volume -15%',
      reason: 'Fatigue ou douleur élevée, réduire le volume',
      priority: 'high'
    });
  }

  // Stagnation (simulation - dans un vrai système, on vérifierait les PR)
  if (data.adherence > 85 && data.energy > 4) {
    suggestions.push({
      type: 'intensity',
      currentValue: 'Intensité standard',
      proposedValue: '+1 série sur exercice principal',
      reason: 'Adhérence et énergie élevées, augmenter l\'intensité',
      priority: 'medium'
    });
  }

  return suggestions;
}

/**
 * Génère les approbations IA pour le coach
 */
export async function generateCoachApproval(athleteId: string, suggestions: (NutritionAdjustment | TrainingAdjustment)[]): Promise<AIApproval[]> {
  // Récupérer les infos de l'athlète
  const athlete = await db
    .select()
    .from(users)
    .where(eq(users.id, athleteId))
    .limit(1);

  if (athlete.length === 0) {
    return [];
  }

  const athleteName = athlete[0].fullName;
  const approvals: AIApproval[] = [];

  suggestions.forEach((suggestion) => {
    if ('type' in suggestion) {
      if (suggestion.type === 'calories' || suggestion.type === 'macros' || suggestion.type === 'timing') {
        approvals.push({
          athleteId,
          athleteName,
          type: 'nutrition',
          suggestion: suggestion.reason,
          currentValue: suggestion.currentValue,
          proposedValue: suggestion.proposedValue,
          reason: suggestion.reason,
          priority: suggestion.priority
        });
      } else {
        approvals.push({
          athleteId,
          athleteName,
          type: 'training',
          suggestion: suggestion.reason,
          currentValue: suggestion.currentValue,
          proposedValue: suggestion.proposedValue,
          reason: suggestion.reason,
          priority: suggestion.priority
        });
      }
    }
  });

  return approvals;
}

/**
 * Tâche planifiée quotidienne pour l'auto-régulation
 */
export async function dailyAutoRegulationTask(): Promise<void> {
  console.log('🤖 Démarrage de la tâche d\'auto-régulation quotidienne...');

  try {
    // Récupérer tous les athlètes actifs
    const athletes = await db
      .select()
      .from(users)
      .where(eq(users.role, 'athlete'));

    for (const athlete of athletes) {
      console.log(`📊 Analyse de l'athlète ${athlete.fullName}...`);

      // Calculer les moyennes hebdomadaires
      const averages = await computeWeeklyAverages(athlete.id);

      // Déterminer l'objectif (simulation - dans un vrai système, ce serait dans la base)
      const goal: 'weight_loss' | 'maintenance' | 'weight_gain' = 'weight_loss';

      // Générer les suggestions
      const nutritionSuggestions = suggestNutritionAdjustments(averages, goal);
      const trainingSuggestions = suggestTrainingAdjustments(averages);

      // Créer les approbations pour le coach
      const allSuggestions = [...nutritionSuggestions, ...trainingSuggestions];
      const approvals = await generateCoachApproval(athlete.id, allSuggestions);

      // Ici, on pourrait sauvegarder les approbations dans la base de données
      // et envoyer des notifications
      console.log(`✅ ${approvals.length} suggestions générées pour ${athlete.fullName}`);

      // Log des suggestions pour debug
      if (approvals.length > 0) {
        console.log('📋 Suggestions générées:');
        approvals.forEach(approval => {
          console.log(`  - ${approval.type}: ${approval.suggestion}`);
        });
      }
    }

    console.log('✅ Tâche d\'auto-régulation terminée');
  } catch (error) {
    console.error('❌ Erreur lors de l\'auto-régulation:', error);
  }
}

/**
 * API endpoint pour déclencher l'auto-régulation manuellement
 */
export async function triggerAutoRegulation(athleteId?: string): Promise<{ success: boolean; message: string }> {
  try {
    if (athleteId) {
      // Auto-régulation pour un athlète spécifique
      const averages = await computeWeeklyAverages(athleteId);
      const goal: 'weight_loss' | 'maintenance' | 'weight_gain' = 'weight_loss';
      
      const nutritionSuggestions = suggestNutritionAdjustments(averages, goal);
      const trainingSuggestions = suggestTrainingAdjustments(averages);
      const allSuggestions = [...nutritionSuggestions, ...trainingSuggestions];
      const approvals = await generateCoachApproval(athleteId, allSuggestions);

      return {
        success: true,
        message: `${approvals.length} suggestions générées pour l'athlète`
      };
    } else {
      // Auto-régulation pour tous les athlètes
      await dailyAutoRegulationTask();
      return {
        success: true,
        message: 'Auto-régulation exécutée pour tous les athlètes'
      };
    }
  } catch (error) {
    console.error('Erreur auto-régulation:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'auto-régulation'
    };
  }
}
