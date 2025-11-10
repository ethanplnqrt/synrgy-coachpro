import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, integer, boolean, decimal, jsonb, index } from "drizzle-orm/pg-core";
import { z } from "zod";
// Users table (coaches and athletes)
export const users = pgTable("users", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    email: text("email").notNull().unique(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    fullName: text("full_name").notNull(),
    role: text("role", { enum: ["coach", "athlete"] }).notNull(),
    avatarUrl: text("avatar_url"),
    isPro: boolean("is_pro").default(false),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    coachId: text("coach_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Client relationships (athletes linked to coaches)
export const clients = pgTable("clients", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    coachId: text("coach_id").notNull().references(() => users.id),
    athleteId: text("athlete_id").notNull().references(() => users.id),
    status: text("status", { enum: ["active", "paused", "inactive"] }).default("active"),
    startDate: timestamp("start_date").defaultNow(),
    endDate: timestamp("end_date"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
    coachIdx: index("clients_coach_idx").on(table.coachId),
    athleteIdx: index("clients_athlete_idx").on(table.athleteId),
}));
// Training plans
export const trainingPlans = pgTable("training_plans", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    coachId: text("coach_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    description: text("description"),
    type: text("type", { enum: ["strength", "hypertrophy", "endurance", "power", "custom"] }).notNull(),
    duration: integer("duration_weeks").notNull(),
    isTemplate: boolean("is_template").default(false),
    isPublic: boolean("is_public").default(false),
    tags: jsonb("tags").$type(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Training sessions
export const trainingSessions = pgTable("training_sessions", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    planId: text("plan_id").notNull().references(() => trainingPlans.id),
    athleteId: text("athlete_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    scheduledDate: timestamp("scheduled_date").notNull(),
    completedDate: timestamp("completed_date"),
    status: text("status", { enum: ["scheduled", "in_progress", "completed", "skipped"] }).default("scheduled"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Exercises
export const exercises = pgTable("exercises", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    name: text("name").notNull(),
    category: text("category").notNull(), // e.g., "chest", "back", "legs"
    muscleGroups: jsonb("muscle_groups").$type(),
    equipment: text("equipment"),
    instructions: text("instructions"),
    videoUrl: text("video_url"),
    isCustom: boolean("is_custom").default(false),
    createdBy: text("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
});
// Exercise logs (Heavy/Strong style)
export const exerciseLogs = pgTable("exercise_logs", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    sessionId: text("session_id").notNull().references(() => trainingSessions.id),
    exerciseId: text("exercise_id").notNull().references(() => exercises.id),
    athleteId: text("athlete_id").notNull().references(() => users.id),
    sets: jsonb("sets").$type(),
    totalVolume: decimal("total_volume", { precision: 10, scale: 2 }),
    isPr: boolean("is_pr").default(false),
    prType: text("pr_type"), // "weight", "reps", "volume"
    completedAt: timestamp("completed_at").defaultNow(),
});
// Nutrition plans
export const nutritionPlans = pgTable("nutrition_plans", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    coachId: text("coach_id").references(() => users.id),
    athleteId: text("athlete_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    description: text("description"),
    targetCalories: integer("target_calories").notNull(),
    targetProtein: decimal("target_protein", { precision: 5, scale: 2 }),
    targetCarbs: decimal("target_carbs", { precision: 5, scale: 2 }),
    targetFat: decimal("target_fat", { precision: 5, scale: 2 }),
    preferences: jsonb("preferences").$type(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Meals
export const meals = pgTable("meals", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
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
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
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
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    mealId: text("meal_id").notNull().references(() => meals.id),
    foodItemId: text("food_item_id").notNull().references(() => foodItems.id),
    quantity: decimal("quantity", { precision: 8, scale: 2 }).notNull(),
    unit: text("unit").notNull(), // "g", "ml", "cup", "slice", etc.
    notes: text("notes"),
});
// Check-ins (TrueCoach style)
export const checkIns = pgTable("check_ins", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    athleteId: text("athlete_id").notNull().references(() => users.id),
    coachId: text("coach_id").references(() => users.id),
    date: timestamp("date").notNull(),
    mood: integer("mood"), // 1-10 scale
    sleep: decimal("sleep", { precision: 3, scale: 1 }), // hours
    stress: integer("stress"), // 1-10 scale
    pain: integer("pain"), // 1-10 scale
    motivation: integer("motivation"), // 1-10 scale
    adherence: integer("adherence"), // 1-10 scale
    energy: integer("energy"), // 1-10 scale
    notes: text("notes"),
    coachNotes: text("coach_notes"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Habits tracking
export const habits = pgTable("habits", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    athleteId: text("athlete_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    description: text("description"),
    target: integer("target").notNull(), // daily target
    unit: text("unit").notNull(), // "glasses", "steps", "minutes", etc.
    color: text("color").default("#4ADE80"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});
// Habit logs
export const habitLogs = pgTable("habit_logs", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    habitId: text("habit_id").notNull().references(() => habits.id),
    athleteId: text("athlete_id").notNull().references(() => users.id),
    date: timestamp("date").notNull(),
    value: integer("value").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Messages (coach-athlete communication)
export const messages = pgTable("messages", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    senderId: text("sender_id").notNull().references(() => users.id),
    recipientId: text("recipient_id").notNull().references(() => users.id),
    content: text("content").notNull(),
    type: text("type", { enum: ["text", "image", "video", "file"] }).default("text"),
    mediaUrl: text("media_url"),
    isRead: boolean("is_read").default(false),
    isAiGenerated: boolean("is_ai_generated").default(false),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
    senderIdx: index("messages_sender_idx").on(table.senderId),
    recipientIdx: index("messages_recipient_idx").on(table.recipientId),
}));
// Tasks (coach tasks and athlete tasks)
export const tasks = pgTable("tasks", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    coachId: text("coach_id").references(() => users.id),
    athleteId: text("athlete_id").references(() => users.id),
    title: text("title").notNull(),
    description: text("description"),
    type: text("type", { enum: ["coach", "athlete", "ai_generated"] }).notNull(),
    priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium"),
    status: text("status", { enum: ["pending", "in_progress", "completed", "cancelled"] }).default("pending"),
    dueDate: timestamp("due_date"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Bookings (Cal integration)
export const bookings = pgTable("bookings", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    coachId: text("coach_id").notNull().references(() => users.id),
    athleteId: text("athlete_id").notNull().references(() => users.id),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    type: text("type", { enum: ["consultation", "check_in", "training", "nutrition"] }).notNull(),
    status: text("status", { enum: ["scheduled", "confirmed", "completed", "cancelled", "no_show"] }).default("scheduled"),
    notes: text("notes"),
    videoUrl: text("video_url"),
    meetingId: text("meeting_id"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Availability (coach availability)
export const availability = pgTable("availability", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    coachId: text("coach_id").notNull().references(() => users.id),
    dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
    startTime: text("start_time").notNull(), // "09:00"
    endTime: text("end_time").notNull(), // "17:00"
    isRecurring: boolean("is_recurring").default(true),
    specificDate: timestamp("specific_date"), // for one-time availability
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});
// Payments and subscriptions
export const subscriptions = pgTable("subscriptions", {
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
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
    id: text("id").primaryKey().default(sql `gen_random_uuid()`),
    userId: text("user_id").notNull().references(() => users.id),
    type: text("type", { enum: ["image", "video", "document", "note"] }).notNull(),
    filename: text("filename").notNull(),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    metadata: jsonb("metadata").$type(),
    createdAt: timestamp("created_at").defaultNow(),
});
// Schemas for validation
export const insertUserSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(6),
    fullName: z.string().min(2),
    role: z.enum(["coach", "athlete"]),
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
