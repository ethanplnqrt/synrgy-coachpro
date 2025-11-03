import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "client");
const distDir = path.resolve(__dirname, "dist");

export default defineConfig({
  root: rootDir,
  plugins: [react()],
  build: {
    outDir: distDir,
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== "production",
  },
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});