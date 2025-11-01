import { TrainingDoctrine } from "../../coreAI/TrainingDoctrine";
import { NutritionAdaptiveAddon } from "../addons/NutritionAdaptiveAddon";

export const buildAthletePrompt = (userPrompt: string): string => {
  return `${TrainingDoctrine}\n${NutritionAdaptiveAddon}\nUser request:\n${userPrompt}`;
};

