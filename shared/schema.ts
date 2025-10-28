import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - both coaches and clients
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("athlete"), // 'coach' or 'athlete'
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
  isPro: boolean("is_pro").default(false).notNull(), // For coaches only
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  coachId: varchar("coach_id"), // For athletes - references their coach
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Programs table
export const programs = pgTable("programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  coachId: varchar("coach_id").notNull(),
  athleteId: varchar("athlete_id"),
  durationWeeks: integer("duration_weeks").notNull(),
  status: text("status").notNull().default("draft"), // draft, active, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Exercises table
export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  programId: varchar("program_id").notNull(),
  name: text("name").notNull(),
  sets: integer("sets"),
  reps: integer("reps"),
  weight: text("weight"), // e.g., "50 kg" or "bodyweight"
  notes: text("notes"),
  day: integer("day").notNull(), // Day number in the program
  orderIndex: integer("order_index").notNull(), // Order within the day
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages table - for AI coach conversations
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many, one }) => ({
  programsAsCoach: many(programs, { relationName: "coachPrograms" }),
  programsAsAthlete: many(programs, { relationName: "athletePrograms" }),
  messages: many(messages),
  coach: one(users, {
    fields: [users.coachId],
    references: [users.id],
    relationName: "athleteCoach",
  }),
  athletes: many(users, { relationName: "athleteCoach" }),
}));

export const programsRelations = relations(programs, ({ one, many }) => ({
  coach: one(users, {
    fields: [programs.coachId],
    references: [users.id],
    relationName: "coachPrograms",
  }),
  athlete: one(users, {
    fields: [programs.athleteId],
    references: [users.id],
    relationName: "athletePrograms",
  }),
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one }) => ({
  program: one(programs, {
    fields: [exercises.programId],
    references: [programs.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isPro: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;

export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Extended types with relations
export type ProgramWithExercises = Program & {
  exercises: Exercise[];
};

export type UserWithPrograms = User & {
  programsAsCoach?: Program[];
  programsAsAthlete?: Program[];
};
