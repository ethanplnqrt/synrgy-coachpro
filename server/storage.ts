// Database storage implementation - using Replit's PostgreSQL blueprint
import {
  users,
  programs,
  exercises,
  messages,
  type User,
  type InsertUser,
  type Program,
  type InsertProgram,
  type Exercise,
  type InsertExercise,
  type Message,
  type InsertMessage,
} from "../shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(
    id: string,
    stripeCustomerId: string,
    stripeSubscriptionId: string
  ): Promise<User>;
  updateUserProStatus(id: string, isPro: boolean): Promise<User>;

  // Client methods
  getClientsByCoach(coachId: string): Promise<User[]>;
  deleteClient(id: string): Promise<void>;

  // Program methods
  getProgramsByCoach(coachId: string): Promise<Program[]>;
  getProgramsByClient(clientId: string): Promise<Program[]>;
  getProgram(id: string): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: string, program: Partial<InsertProgram>): Promise<Program>;
  deleteProgram(id: string): Promise<void>;

  // Exercise methods
  getExercisesByProgram(programId: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: string, exercise: Partial<InsertExercise>): Promise<Exercise>;
  deleteExercise(id: string): Promise<void>;

  // Message methods
  getMessagesByUser(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserStripeInfo(
    id: string,
    stripeCustomerId: string,
    stripeSubscriptionId: string
  ): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId, stripeSubscriptionId, isPro: true })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserProStatus(id: string, isPro: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isPro })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Client methods
  async getClientsByCoach(coachId: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(and(eq(users.role, "client"), eq(users.coachId, coachId)));
  }

  async deleteClient(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Program methods
  async getProgramsByCoach(coachId: string): Promise<Program[]> {
    return await db.select().from(programs).where(eq(programs.coachId, coachId));
  }

  async getProgramsByClient(clientId: string): Promise<Program[]> {
    return await db
      .select()
      .from(programs)
      .where(eq(programs.clientId, clientId));
  }

  async getProgram(id: string): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program || undefined;
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const [program] = await db
      .insert(programs)
      .values(insertProgram)
      .returning();
    return program;
  }

  async updateProgram(
    id: string,
    programData: Partial<InsertProgram>
  ): Promise<Program> {
    const [program] = await db
      .update(programs)
      .set({ ...programData, updatedAt: new Date() })
      .where(eq(programs.id, id))
      .returning();
    return program;
  }

  async deleteProgram(id: string): Promise<void> {
    await db.delete(programs).where(eq(programs.id, id));
  }

  // Exercise methods
  async getExercisesByProgram(programId: string): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.programId, programId));
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const [exercise] = await db
      .insert(exercises)
      .values(insertExercise)
      .returning();
    return exercise;
  }

  async updateExercise(
    id: string,
    exerciseData: Partial<InsertExercise>
  ): Promise<Exercise> {
    const [exercise] = await db
      .update(exercises)
      .set(exerciseData)
      .where(eq(exercises.id, id))
      .returning();
    return exercise;
  }

  async deleteExercise(id: string): Promise<void> {
    await db.delete(exercises).where(eq(exercises.id, id));
  }

  // Message methods
  async getMessagesByUser(userId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.userId, userId));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
