/**
 * 🔐 AUTHENTICATION ROUTES - PRISMA + JWT + COOKIES
 * 
 * Production-ready authentication with PostgreSQL
 */

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "synrgy_secret_key_dev";

/**
 * POST /api/auth/signup
 * Create new user account
 */
router.post("/signup", async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password and role are required" });
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        fullName: fullName || null,
      },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        createdAt: true,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("synrgy_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      message: "Account created successfully",
      user,
      token,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("synrgy_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.synrgy_token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (err: any) {
    console.error("Auth verification error:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post("/logout", (req, res) => {
  res.clearCookie("synrgy_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.json({ message: "Logged out successfully" });
});

export default router;
