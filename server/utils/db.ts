import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "server/db.json");

export type SynrgyMessage = {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type SynrgyNutritionEntry = {
  id: string;
  userId: string;
  timestamp: number;
  notes?: string;
  calories?: number;
  macros?: Record<string, number>;
};

export type SynrgyGoal = {
  id: string;
  userId: string;
  title: string;
  targetDate?: string;
  status: "active" | "completed" | "paused";
  progress?: number;
  createdAt: number;
};

export type SynrgyDB = {
  messages: SynrgyMessage[];
  nutrition: SynrgyNutritionEntry[];
  goals: SynrgyGoal[];
};

const defaultDB: SynrgyDB = {
  messages: [],
  nutrition: [],
  goals: [],
};

function ensureFile(): SynrgyDB {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(defaultDB, null, 2));
    return { ...defaultDB };
  }

  const raw = fs.readFileSync(dbPath, "utf8");
  let parsed: Partial<SynrgyDB>;
  try {
    parsed = JSON.parse(raw) as Partial<SynrgyDB>;
  } catch (error) {
    parsed = {};
  }

  const merged: SynrgyDB = {
    messages: Array.isArray(parsed.messages) ? parsed.messages : [],
    nutrition: Array.isArray(parsed.nutrition) ? parsed.nutrition : [],
    goals: Array.isArray(parsed.goals) ? parsed.goals : [],
  };

  if (JSON.stringify(merged) !== raw) {
    fs.writeFileSync(dbPath, JSON.stringify(merged, null, 2));
  }

  return merged;
}

export function loadDB(): SynrgyDB {
  return ensureFile();
}

export function saveDB(data: SynrgyDB): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export { dbPath };

