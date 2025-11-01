// SHIELD SYSTEM v3.5 - Data Collector
import fs from 'fs';

export class ShieldCollector {
  private logPath = './shield-logs.log';
  private archivePath = './shield/data/';
  private maxAge = 1000 * 60 * 60 * 48; // 48h

  constructor() {
    try {
      if (!fs.existsSync(this.archivePath)) {
        fs.mkdirSync(this.archivePath, { recursive: true });
      }
    } catch (e) {
      // Ignore directory creation errors
    }
  }

  async collect() {
    try {
      const stats = fs.existsSync(this.logPath) ? fs.statSync(this.logPath) : null;
      if (stats && Date.now() - stats.mtimeMs > this.maxAge) {
        const archiveName = `${this.archivePath}/archive-${new Date().toISOString()}.log`;
        fs.renameSync(this.logPath, archiveName);
        console.log('🧾 SHIELD: logs archivés pour apprentissage prédictif');
      }
    } catch (e) {
      // Ignore collection errors
    }
  }

  async summarize() {
    try {
      if (!fs.existsSync(this.logPath)) return {};

      const logs = fs.readFileSync(this.logPath, 'utf8').split('\n');
      const counts: Record<string, number> = {};

      logs.forEach((line) => {
        if (line.includes('CORS')) counts['CORS'] = (counts['CORS'] || 0) + 1;
        if (line.includes('DB') || line.includes('database')) counts['DB'] = (counts['DB'] || 0) + 1;
        if (line.includes('fetch')) counts['fetch'] = (counts['fetch'] || 0) + 1;
        if (line.includes('timeout')) counts['timeout'] = (counts['timeout'] || 0) + 1;
        if (line.includes('crash')) counts['crash'] = (counts['crash'] || 0) + 1;
      });

      return counts;
    } catch (e) {
      return {};
    }
  }
}
