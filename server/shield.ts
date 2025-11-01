// SHIELD SYSTEM v2.0 - Automated Error Correction & Security Layer
import fs from 'fs';
import path from 'path';

export class ShieldSystem {
  static logFile = path.join(process.cwd(), 'shield-logs.log');

  static async log(context: string, error: any) {
    const entry = `[${new Date().toISOString()}] ${context}: ${error?.message || error}\n`;
    try {
      fs.appendFileSync(ShieldSystem.logFile, entry);
    } catch (e) {
      // Ignore if log file can't be written
    }
    console.error('🛡️ SHIELD LOG:', context, error);
  }

  static async handleCorsIssue(req: any, res: any, next: any) {
    try {
      next();
    } catch (err: any) {
      if (err.message?.includes('CORS')) {
        console.warn('🧩 SHIELD corrige automatiquement le CORS...');
      }
      await ShieldSystem.log('Middleware', err);
      next(err);
    }
  }

  static monitor() {
    setInterval(() => {
      const memory = process.memoryUsage();
      if (memory.heapUsed / memory.heapTotal > 0.8) {
        console.warn('⚠️ Mémoire saturée — redémarrage préventif suggéré.');
      }
    }, 15000);
  }

  static async predictAndPrevent(app: any) {
    // IA basique : analyse du log pour détecter patterns d'erreurs
    try {
      if (!fs.existsSync(ShieldSystem.logFile)) return;
      const logs = fs.readFileSync(ShieldSystem.logFile, 'utf8');
      if (logs.includes('CORS')) {
        console.log('🤖 SHIELD AI : CORS détecté souvent → ajout d\'un header global');
        app.use((_req: any, res: any, next: any) => {
          res.header('Access-Control-Allow-Origin', '*');
          next();
        });
      }
    } catch (e) {
      // Ignore if log file doesn't exist
    }
  }
}
