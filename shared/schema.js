"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMessageSchema = exports.insertExerciseSchema = exports.insertProgramSchema = exports.loginSchema = exports.insertUserSchema = exports.media = exports.subscriptions = exports.messages = exports.messageThreads = exports.foodLogs = exports.mealFoodItems = exports.foodItems = exports.meals = exports.nutritionPlans = exports.feedbacks = exports.exercises = exports.sessions = exports.programs = exports.clients = exports.users = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const zod_1 = require("zod");
// Users table (coaches and clients)
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    fullName: (0, pg_core_1.text)("full_name").notNull(),
    role: (0, pg_core_1.text)("role", { enum: ["coach", "client"] }).notNull(),
    avatarUrl: (0, pg_core_1.text)("avatar_url"),
    isPro: (0, pg_core_1.boolean)("is_pro").default(false),
    stripeCustomerId: (0, pg_core_1.text)("stripe_customer_id"),
    stripeSubscriptionId: (0, pg_core_1.text)("stripe_subscription_id"),
    coachId: (0, pg_core_1.text)("coach_id").references(() => exports.users.id),
    integrations: (0, pg_core_1.jsonb)("integrations").$type(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Client relationships (clients linked to coaches)
exports.clients = (0, pg_core_1.pgTable)("clients", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    coachId: (0, pg_core_1.text)("coach_id").notNull().references(() => exports.users.id),
    clientId: (0, pg_core_1.text)("client_id").notNull().references(() => exports.users.id),
    status: (0, pg_core_1.text)("status", { enum: ["active", "paused", "inactive"] }).default("active"),
    startDate: (0, pg_core_1.timestamp)("start_date").defaultNow(),
    endDate: (0, pg_core_1.timestamp)("end_date"),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => ({
    coachIdx: (0, pg_core_1.index)("clients_coach_idx").on(table.coachId),
    clientIdx: (0, pg_core_1.index)("clients_client_idx").on(table.clientId),
}));
// Programs (TrueCoach-style, simplified structure)
exports.programs = (0, pg_core_1.pgTable)("programs", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    coachId: (0, pg_core_1.text)("coach_id").notNull().references(() => exports.users.id),
    clientId: (0, pg_core_1.text)("client_id").notNull().references(() => exports.users.id),
    title: (0, pg_core_1.text)("title").notNull(),
    blocks: (0, pg_core_1.jsonb)("blocks").$type().default([]),
    notes: (0, pg_core_1.text)("notes"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => ({
    coachIdx: (0, pg_core_1.index)("programs_coach_idx").on(table.coachId),
    clientIdx: (0, pg_core_1.index)("programs_client_idx").on(table.clientId),
}));
// Sessions (Hevy-style workout logging)
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    clientId: (0, pg_core_1.text)("client_id").notNull().references(() => exports.users.id),
    programId: (0, pg_core_1.text)("program_id").references(() => exports.programs.id),
    date: (0, pg_core_1.timestamp)("date").notNull().defaultNow(),
    entries: (0, pg_core_1.jsonb)("entries").$type().default([]),
    durationMin: (0, pg_core_1.integer)("duration_min"),
    rpeAvg: (0, pg_core_1.decimal)("rpe_avg", { precision: 3, scale: 1 }),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => ({
    clientDateIdx: (0, pg_core_1.index)("sessions_client_date_idx").on(table.clientId, table.date),
}));
// Exercises
exports.exercises = (0, pg_core_1.pgTable)("exercises", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    category: (0, pg_core_1.text)("category").notNull(), // e.g., "chest", "back", "legs"
    muscleGroups: (0, pg_core_1.jsonb)("muscle_groups").$type(),
    equipment: (0, pg_core_1.text)("equipment"),
    instructions: (0, pg_core_1.text)("instructions"),
    videoUrl: (0, pg_core_1.text)("video_url"),
    isCustom: (0, pg_core_1.boolean)("is_custom").default(false),
    createdBy: (0, pg_core_1.text)("created_by").references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Feedbacks (daily client feedback)
exports.feedbacks = (0, pg_core_1.pgTable)("feedbacks", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    clientId: (0, pg_core_1.text)("client_id").notNull().references(() => exports.users.id),
    date: (0, pg_core_1.timestamp)("date").notNull(),
    sleepHours: (0, pg_core_1.decimal)("sleep_hours", { precision: 3, scale: 1 }),
    stressLevel: (0, pg_core_1.integer)("stress_level"), // 1-10
    sorenessLevel: (0, pg_core_1.integer)("soreness_level"), // 1-10
    energyLevel: (0, pg_core_1.integer)("energy_level"), // 1-10
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => ({
    clientDateIdx: (0, pg_core_1.index)("feedbacks_client_date_idx").on(table.clientId, table.date),
}));
// Nutrition plans
exports.nutritionPlans = (0, pg_core_1.pgTable)("nutrition_plans", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    coachId: (0, pg_core_1.text)("coach_id").references(() => exports.users.id),
    clientId: (0, pg_core_1.text)("client_id").notNull().references(() => exports.users.id),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    targetCalories: (0, pg_core_1.integer)("target_calories").notNull(),
    targetProtein: (0, pg_core_1.decimal)("target_protein", { precision: 5, scale: 2 }),
    targetCarbs: (0, pg_core_1.decimal)("target_carbs", { precision: 5, scale: 2 }),
    targetFat: (0, pg_core_1.decimal)("target_fat", { precision: 5, scale: 2 }),
    preferences: (0, pg_core_1.jsonb)("preferences").$type(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Meals
exports.meals = (0, pg_core_1.pgTable)("meals", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    planId: (0, pg_core_1.text)("plan_id").notNull().references(() => exports.nutritionPlans.id),
    name: (0, pg_core_1.text)("name").notNull(),
    mealType: (0, pg_core_1.text)("meal_type", { enum: ["breakfast", "lunch", "dinner", "snack"] }).notNull(),
    order: (0, pg_core_1.integer)("order").notNull(),
    calories: (0, pg_core_1.integer)("calories").notNull(),
    protein: (0, pg_core_1.decimal)("protein", { precision: 5, scale: 2 }),
    carbs: (0, pg_core_1.decimal)("carbs", { precision: 5, scale: 2 }),
    fat: (0, pg_core_1.decimal)("fat", { precision: 5, scale: 2 }),
    instructions: (0, pg_core_1.text)("instructions"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Food items
exports.foodItems = (0, pg_core_1.pgTable)("food_items", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    brand: (0, pg_core_1.text)("brand"),
    barcode: (0, pg_core_1.text)("barcode"),
    caloriesPer100g: (0, pg_core_1.decimal)("calories_per_100g", { precision: 8, scale: 2 }),
    proteinPer100g: (0, pg_core_1.decimal)("protein_per_100g", { precision: 5, scale: 2 }),
    carbsPer100g: (0, pg_core_1.decimal)("carbs_per_100g", { precision: 5, scale: 2 }),
    fatPer100g: (0, pg_core_1.decimal)("fat_per_100g", { precision: 5, scale: 2 }),
    fiberPer100g: (0, pg_core_1.decimal)("fiber_per_100g", { precision: 5, scale: 2 }),
    sugarPer100g: (0, pg_core_1.decimal)("sugar_per_100g", { precision: 5, scale: 2 }),
    isCustom: (0, pg_core_1.boolean)("is_custom").default(false),
    createdBy: (0, pg_core_1.text)("created_by").references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Meal food items (junction table)
exports.mealFoodItems = (0, pg_core_1.pgTable)("meal_food_items", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    mealId: (0, pg_core_1.text)("meal_id").notNull().references(() => exports.meals.id),
    foodItemId: (0, pg_core_1.text)("food_item_id").notNull().references(() => exports.foodItems.id),
    quantity: (0, pg_core_1.decimal)("quantity", { precision: 8, scale: 2 }).notNull(),
    unit: (0, pg_core_1.text)("unit").notNull(), // "g", "ml", "cup", "slice", etc.
    notes: (0, pg_core_1.text)("notes"),
});
// Food logs (imported from Macros, read-only)
exports.foodLogs = (0, pg_core_1.pgTable)("food_logs", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    clientId: (0, pg_core_1.text)("client_id").notNull().references(() => exports.users.id),
    date: (0, pg_core_1.timestamp)("date").notNull(),
    mealName: (0, pg_core_1.text)("meal_name"),
    calories: (0, pg_core_1.integer)("calories"),
    protein: (0, pg_core_1.decimal)("protein", { precision: 6, scale: 2 }),
    carbs: (0, pg_core_1.decimal)("carbs", { precision: 6, scale: 2 }),
    fat: (0, pg_core_1.decimal)("fat", { precision: 6, scale: 2 }),
    fiber: (0, pg_core_1.decimal)("fiber", { precision: 6, scale: 2 }),
    source: (0, pg_core_1.text)("source").default("macros"),
    rawData: (0, pg_core_1.jsonb)("raw_data"),
    syncedAt: (0, pg_core_1.timestamp)("synced_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => ({
    clientDateIdx: (0, pg_core_1.index)("food_logs_client_date_idx").on(table.clientId, table.date),
}));
// Message threads
exports.messageThreads = (0, pg_core_1.pgTable)("message_threads", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    coachId: (0, pg_core_1.text)("coach_id").notNull().references(() => exports.users.id),
    clientId: (0, pg_core_1.text)("client_id").notNull().references(() => exports.users.id),
    lastMessageAt: (0, pg_core_1.timestamp)("last_message_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => ({
    coachIdx: (0, pg_core_1.index)("threads_coach_idx").on(table.coachId),
    clientIdx: (0, pg_core_1.index)("threads_client_idx").on(table.clientId),
}));
// Messages (coach-client communication)
exports.messages = (0, pg_core_1.pgTable)("messages", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    threadId: (0, pg_core_1.text)("thread_id").references(() => exports.messageThreads.id),
    senderId: (0, pg_core_1.text)("sender_id").notNull().references(() => exports.users.id),
    recipientId: (0, pg_core_1.text)("recipient_id").notNull().references(() => exports.users.id),
    content: (0, pg_core_1.text)("content").notNull(),
    type: (0, pg_core_1.text)("type", { enum: ["text", "image", "video", "file"] }).default("text"),
    mediaUrl: (0, pg_core_1.text)("media_url"),
    isRead: (0, pg_core_1.boolean)("is_read").default(false),
    isAiGenerated: (0, pg_core_1.boolean)("is_ai_generated").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => ({
    threadIdx: (0, pg_core_1.index)("messages_thread_idx").on(table.threadId),
    senderIdx: (0, pg_core_1.index)("messages_sender_idx").on(table.senderId),
    recipientIdx: (0, pg_core_1.index)("messages_recipient_idx").on(table.recipientId),
}));
// Payments and subscriptions
exports.subscriptions = (0, pg_core_1.pgTable)("subscriptions", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.text)("user_id").notNull().references(() => exports.users.id),
    stripeSubscriptionId: (0, pg_core_1.text)("stripe_subscription_id").notNull().unique(),
    stripePriceId: (0, pg_core_1.text)("stripe_price_id").notNull(),
    status: (0, pg_core_1.text)("status", { enum: ["active", "cancelled", "past_due", "unpaid"] }).notNull(),
    currentPeriodStart: (0, pg_core_1.timestamp)("current_period_start").notNull(),
    currentPeriodEnd: (0, pg_core_1.timestamp)("current_period_end").notNull(),
    cancelAtPeriodEnd: (0, pg_core_1.boolean)("cancel_at_period_end").default(false),
    trialEnd: (0, pg_core_1.timestamp)("trial_end"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Media (images, notes, files)
exports.media = (0, pg_core_1.pgTable)("media", {
    id: (0, pg_core_1.text)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.text)("user_id").notNull().references(() => exports.users.id),
    type: (0, pg_core_1.text)("type", { enum: ["image", "video", "document", "note"] }).notNull(),
    filename: (0, pg_core_1.text)("filename").notNull(),
    originalName: (0, pg_core_1.text)("original_name").notNull(),
    mimeType: (0, pg_core_1.text)("mime_type").notNull(),
    size: (0, pg_core_1.integer)("size").notNull(),
    url: (0, pg_core_1.text)("url").notNull(),
    thumbnailUrl: (0, pg_core_1.text)("thumbnail_url"),
    metadata: (0, pg_core_1.jsonb)("metadata").$type(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Schemas for validation
exports.insertUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6),
    fullName: zod_1.z.string().min(2),
    role: zod_1.z.enum(["coach", "client"]),
});
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1),
});
exports.insertProgramSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    category: zod_1.z.string().min(1),
    muscleGroups: zod_1.z.array(zod_1.z.string()).optional(),
    equipment: zod_1.z.string().optional(),
    instructions: zod_1.z.string().optional(),
    videoUrl: zod_1.z.string().url().optional(),
});
exports.insertExerciseSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    muscleGroups: zod_1.z.array(zod_1.z.string()).optional(),
    equipment: zod_1.z.string().optional(),
    instructions: zod_1.z.string().optional(),
    videoUrl: zod_1.z.string().url().optional(),
});
exports.insertMessageSchema = zod_1.z.object({
    content: zod_1.z.string().min(1),
    senderId: zod_1.z.string().min(1),
    recipientId: zod_1.z.string().min(1),
    type: zod_1.z.enum(["text", "image", "video", "file"]).optional(),
    mediaUrl: zod_1.z.string().url().optional(),
});
