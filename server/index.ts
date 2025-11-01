import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/auth.js";
import chatRouter from "./routes/chat.js";
import nutritionRouter from "./routes/nutrition.js";
import goalsRouter from "./routes/goals.js";
import { loadDB } from "./utils/db.js";

const app = express();

// Ensure demo database exists on startup
loadDB();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/goals", goalsRouter);

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", mode: "production", version: "v1.0" })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("🚀 Synrgy Production Server Ready on http://localhost:" + PORT);
  console.log("✅ Frontend served from /dist");
  console.log("✅ Auth, Chat, Nutrition, Goals endpoints active");
});