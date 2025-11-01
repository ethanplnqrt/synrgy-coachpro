import { TrainingDoctrine } from "./TrainingDoctrine";

export const buildPrompt = (userPrompt: string): string => {
  return `${TrainingDoctrine}\n\nUser request:\n${userPrompt}`;
};

