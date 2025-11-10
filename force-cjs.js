// force-cjs.js
import { createRequire } from "module";
global.require = createRequire(import.meta.url);

