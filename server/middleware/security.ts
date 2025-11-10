/**
 * 🔒 SECURITY MIDDLEWARE
 * 
 * Helmet and CORS configuration
 */

import helmet from "helmet";
import cors from "cors";

// Helmet configuration for security headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS configuration
// Allows multiple origins: Render frontend, Vercel, Netlify, and local development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://synrgy-api.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean); // Remove undefined values

export const corsConfig = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // ✅ CRITICAL: Enable cookies/credentials
});

