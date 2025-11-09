import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  timestamp, 
  integer, 
  boolean, 
  decimal, 
  jsonb,
  primaryKey,
  index
} from "drizzle-orm/pg-core";
import { z } from "zod";

// Users table (coaches and clients)
export const users: any = pgTable("users", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role", { enum: ["coach", "client"] }).notNull(),
  avatarUrl: text("avatar_url"),
  isPro: boolean("is_pro").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  coachId: text("coach_id").references(() => users.id),
  integrations: jsonb("integrations").$type<{
    macrosToken?: string;
    macrosRefreshToken?: string;
    macrosExpiresAt?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Client relationships (clients linked to coaches)
export const clients: any = pgTable("clients", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  coachId: text("coach_id").notNull().references(() => users.id),
  clientId: text("client_id").notNull().references(() => users.id),
  status: text("status", { enum: ["active", "paused", "inactive"] }).default("active"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  coachIdx: index("clients_coach_idx").on(table.coachId),
  clientIdx: index("clients_client_idx").on(table.clientId),
}));

// Programs (TrueCoach-style, simplified structure)
export const programs = pgTable("programs", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  coachId: text("coach_id").notNull().references(() => users.id),
  clientId: text("client_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  blocks: jsonb("blocks").$type<{
    dayIndex: number;
    name: string;
    exercises: {
      id: string;
      name: string;
      sets: { reps: number; weight?: number; rir?: number }[];
      notes?: string;
    }[];
  }[]>().default([]),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  coachIdx: index("programs_coach_idx").on(table.coachId),
  clientIdx: index("programs_client_idx").on(table.clientId),
}));

// Sessions (Hevy-style workout logging)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: text("client_id").notNull().references(() => users.id),
  programId: text("program_id").references(() => programs.id),
  date: timestamp("date").notNull().defaultNow(),
  entries: jsonb("entries").$type<{
    exerciseId: string;
    exerciseName: string;
    performedSets: { reps: number; weight?: number; rir?: number }[];
  }[]>().default([]),
  durationMin: integer("duration_min"),
  rpeAvg: decimal("rpe_avg", { precision: 3, scale: 1 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  clientDateIdx: index("sessions_client_date_idx").on(table.clientId, table.date),
}));

// Exercises
export const exercises = pgTable("exercises", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., "chest", "back", "legs"
  muscleGroups: jsonb("muscle_groups").$type<string[]>(),
  equipment: text("equipment"),
  instructions: text("instructions"),
  videoUrl: text("video_url"),
  isCustom: boolean("is_custom").default(false),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feedbacks (daily client feedback)
export const feedbacks = pgTable("feedbacks", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: text("client_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }),
  stressLevel: integer("stress_level"), // 1-10
  sorenessLevel: integer("soreness_level"), // 1-10
  energyLevel: integer("energy_level"), // 1-10
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  clientDateIdx: index("feedbacks_client_date_idx").on(table.clientId, table.date),
}));

// Nutrition plans
export const nutritionPlans = pgTable("nutrition_plans", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  coachId: text("coach_id").references(() => users.id),
  clientId: text("client_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  targetCalories: integer("target_calories").notNull(),
  targetProtein: decimal("target_protein", { precision: 5, scale: 2 }),
  targetCarbs: decimal("target_carbs", { precision: 5, scale: 2 }),
  targetFat: decimal("target_fat", { precision: 5, scale: 2 }),
  preferences: jsonb("preferences").$type<{
    dietaryRestrictions: string[];
    allergies: string[];
    mealCount: number;
    cookingTime: number;
  }>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Meals
export const meals = pgTable("meals", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  planId: text("plan_id").notNull().references(() => nutritionPlans.id),
  name: text("name").notNull(),
  mealType: text("meal_type", { enum: ["breakfast", "lunch", "dinner", "snack"] }).notNull(),
  order: integer("order").notNull(),
  calories: integer("calories").notNull(),
  protein: decimal("protein", { precision: 5, scale: 2 }),
  carbs: decimal("carbs", { precision: 5, scale: 2 }),
  fat: decimal("fat", { precision: 5, scale: 2 }),
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Food items
export const foodItems = pgTable("food_items", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  brand: text("brand"),
  barcode: text("barcode"),
  caloriesPer100g: decimal("calories_per_100g", { precision: 8, scale: 2 }),
  proteinPer100g: decimal("protein_per_100g", { precision: 5, scale: 2 }),
  carbsPer100g: decimal("carbs_per_100g", { precision: 5, scale: 2 }),
  fatPer100g: decimal("fat_per_100g", { precision: 5, scale: 2 }),
  fiberPer100g: decimal("fiber_per_100g", { precision: 5, scale: 2 }),
  sugarPer100g: decimal("sugar_per_100g", { precision: 5, scale: 2 }),
  isCustom: boolean("is_custom").default(false),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Meal food items (junction table)
export const mealFoodItems = pgTable("meal_food_items", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  mealId: text("meal_id").notNull().references(() => meals.id),
  foodItemId: text("food_item_id").notNull().references(() => foodItems.id),
  quantity: decimal("quantity", { precision: 8, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // "g", "ml", "cup", "slice", etc.
  notes: text("notes"),
});

// Food logs (imported from Macros, read-only)
export const foodLogs = pgTable("food_logs", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: text("client_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  mealName: text("meal_name"),
  calories: integer("calories"),
  protein: decimal("protein", { precision: 6, scale: 2 }),
  carbs: decimal("carbs", { precision: 6, scale: 2 }),
  fat: decimal("fat", { precision: 6, scale: 2 }),
  fiber: decimal("fiber", { precision: 6, scale: 2 }),
  source: text("source").default("macros"),
  rawData: jsonb("raw_data"),
  syncedAt: timestamp("synced_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  clientDateIdx: index("food_logs_client_date_idx").on(table.clientId, table.date),
}));

// Message threads
export const messageThreads = pgTable("message_threads", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  coachId: text("coach_id").notNull().references(() => users.id),
  clientId: text("client_id").notNull().references(() => users.id),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  coachIdx: index("threads_coach_idx").on(table.coachId),
  clientIdx: index("threads_client_idx").on(table.clientId),
}));


// Messages (coach-client communication)
export const messages = pgTable("messages", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: text("thread_id").references(() => messageThreads.id),
  senderId: text("sender_id").notNull().references(() => users.id),
  recipientId: text("recipient_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  type: text("type", { enum: ["text", "image", "video", "file"] }).default("text"),
  mediaUrl: text("media_url"),
  isRead: boolean("is_read").default(false),
  isAiGenerated: boolean("is_ai_generated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  threadIdx: index("messages_thread_idx").on(table.threadId),
  senderIdx: index("messages_sender_idx").on(table.senderId),
  recipientIdx: index("messages_recipient_idx").on(table.recipientId),
}));




// Payments and subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  status: text("status", { enum: ["active", "cancelled", "past_due", "unpaid"] }).notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  trialEnd: timestamp("trial_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media (images, notes, files)
export const media = pgTable("media", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type", { enum: ["image", "video", "document", "note"] }).notNull(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;
export type Program = typeof programs.$inferSelect;
export type InsertProgram = typeof programs.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;
export type Feedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = typeof feedbacks.$inferInsert;
export type NutritionPlan = typeof nutritionPlans.$inferSelect;
export type InsertNutritionPlan = typeof nutritionPlans.$inferInsert;
export type Meal = typeof meals.$inferSelect;
export type InsertMeal = typeof meals.$inferInsert;
export type FoodItem = typeof foodItems.$inferSelect;
export type InsertFoodItem = typeof foodItems.$inferInsert;
export type FoodLog = typeof foodLogs.$inferSelect;
export type InsertFoodLog = typeof foodLogs.$inferInsert;
export type MessageThread = typeof messageThreads.$inferSelect;
export type InsertMessageThread = typeof messageThreads.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

// Login credentials type
export interface LoginCredentials {
  username: string;
  password: string;
}

// Schemas for validation
export const insertUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum(["coach", "client"]),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertProgramSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  muscleGroups: z.array(z.string()).optional(),
  equipment: z.string().optional(),
  instructions: z.string().optional(),
  videoUrl: z.string().url().optional(),
});

export const insertExerciseSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  muscleGroups: z.array(z.string()).optional(),
  equipment: z.string().optional(),
  instructions: z.string().optional(),
  videoUrl: z.string().url().optional(),
});

export const insertMessageSchema = z.object({
  content: z.string().min(1),
  senderId: z.string().min(1),
  recipientId: z.string().min(1),
  type: z.enum(["text", "image", "video", "file"]).optional(),
  mediaUrl: z.string().url().optional(),
});