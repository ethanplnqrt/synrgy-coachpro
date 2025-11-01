import fs from "fs";
import path from "path";

const distRoot = path.join(process.cwd(), "dist");
const source = path.join(distRoot, "server/index.js");
const destination = path.join(distRoot, "server.js");

if (!fs.existsSync(source)) {
  console.warn("⚠️  No compiled server found at", source);
  process.exit(0);
}

fs.mkdirSync(distRoot, { recursive: true });
fs.copyFileSync(source, destination);
console.log("✅ Server entry copied to", destination);

