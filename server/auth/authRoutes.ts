import express from "express";
import { registerUser, loginUser, logoutUser } from "./authController.js";
import { authenticate, type AuthenticatedRequest } from "./authMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body || {};
    const result = await registerUser(email, password, role);
    
    res.cookie(result.cookieName, result.token, result.cookieOptions);
    return res.status(201).json({ success: true, user: result.user });
  } catch (error: any) {
    const status = error.message === "User already exists" ? 409 : 400;
    return res.status(status).json({ success: false, error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const result = await loginUser(email, password);
    
    res.cookie(result.cookieName, result.token, result.cookieOptions);
    return res.json({ success: true, user: result.user });
  } catch (error: any) {
    const status = error.message === "Invalid credentials" ? 401 : 400;
    return res.status(status).json({ success: false, error: error.message });
  }
});

router.post("/logout", (req, res) => {
  const result = logoutUser();
  res.clearCookie(result.cookieName, result.cookieOptions);
  return res.json({ success: true });
});

router.get("/me", authenticate, (req: AuthenticatedRequest, res) => {
  return res.json({ success: true, user: req.user });
});

export default router;

