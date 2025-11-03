import fs from "fs";
import path from "path";

const usersPath = path.join(process.cwd(), "server/data/users.json");

export type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: "coach" | "client" | "athlete";
  createdAt: number;
  coachId?: string | null;
};

function ensureUsersFile(): StoredUser[] {
  if (!fs.existsSync(usersPath)) {
    fs.mkdirSync(path.dirname(usersPath), { recursive: true });
    fs.writeFileSync(usersPath, JSON.stringify([], null, 2));
    return [];
  }

  const raw = fs.readFileSync(usersPath, "utf8");
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as StoredUser[];
    }
  } catch (error) {
    // fall back to empty
  }

  fs.writeFileSync(usersPath, JSON.stringify([], null, 2));
  return [];
}

export function loadUsers(): StoredUser[] {
  return ensureUsersFile();
}

export function saveUsers(users: StoredUser[]): void {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const users = loadUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(userId: string): StoredUser | undefined {
  const users = loadUsers();
  return users.find((user) => user.id === userId);
}

export function toPublicUser(user: StoredUser) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.email,
    avatarUrl: null,
    isPro: user.role === "coach",
    isClient: user.role === "client",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    coachId: user.coachId || null,
    createdAt: new Date(user.createdAt).toISOString(),
  };
}

