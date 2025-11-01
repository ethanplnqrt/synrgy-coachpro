import { TrainingDoctrine } from "../../coreAI/TrainingDoctrine";
import { NutritionAdaptiveAddon } from "../addons/NutritionAdaptiveAddon";

export const buildCoachPrompt = (userPrompt: string): string => {
  return `${TrainingDoctrine}\n${NutritionAdaptiveAddon}\nUser request:\n${userPrompt}`;
};

