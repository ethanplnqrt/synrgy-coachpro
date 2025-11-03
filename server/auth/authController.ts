import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { findUserByEmail, loadUsers, saveUsers, StoredUser, toPublicUser } from "./userStore.js";
import { signToken, AUTH_COOKIE_NAME, buildCookieOptions } from "./authToken.js";

const COOKIE_OPTIONS = buildCookieOptions();

export async function registerUser(email: string, password: string, role: "coach" | "client" | "athlete") {
  if (!email || !password || !role) {
    throw new Error("Missing email, password or role");
  }

  if (role !== "coach" && role !== "client" && role !== "athlete") {
    throw new Error("Invalid role");
  }

  const existing = findUserByEmail(email);
  if (existing) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const users = loadUsers();

  const newUser: StoredUser = {
    id: uuidv4(),
    email,
    passwordHash,
    role,
    createdAt: Date.now(),
    coachId: role === "client" ? null : undefined,
  };

  users.push(newUser);
  saveUsers(users);

  const token = signToken(newUser.id);
  
  return {
    user: toPublicUser(newUser),
    token,
    cookieName: AUTH_COOKIE_NAME,
    cookieOptions: COOKIE_OPTIONS,
  };
}

export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  const user = findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new Error("Invalid credentials");
  }

  const token = signToken(user.id);

  return {
    user: toPublicUser(user),
    token,
    cookieName: AUTH_COOKIE_NAME,
    cookieOptions: COOKIE_OPTIONS,
  };
}

export function logoutUser() {
  return {
    cookieName: AUTH_COOKIE_NAME,
    cookieOptions: { ...COOKIE_OPTIONS, maxAge: 0 },
  };
}

