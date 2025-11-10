import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../shared/schema.js";

const DATABASE_URL = process.env.DATABASE_URL || "./dev.db";

const sqlite = new Database(DATABASE_URL);
export const db = drizzle(sqlite, { schema });
