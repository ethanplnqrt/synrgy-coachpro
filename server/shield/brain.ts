// SHIELD SYSTEM v3.5 - Brain (Core Integration)
import { ShieldPredictor } from './predictor';

export class ShieldBrain {
  private predictor: ShieldPredictor;
  private lastPrediction: any = null;

  constructor() {
    this.predictor = new ShieldPredictor();
    this.startCycle();
    console.log('🧠 SHIELD Brain v3.5 activé');
  }

  async startCycle() {
    // Initial training
    await this.predictor.train();
    await this.predictNext();

    // Continuous monitoring every 15 minutes
    setInterval(async () => {
      await this.predictor.train();
      await this.predictNext();
    }, 1000 * 60 * 15);
  }

  private async predictNext() {
    this.lastPrediction = await this.predictor.predictNextFailure();
  }

  public getPrediction() {
    return this.lastPrediction || { risk: null, message: 'Analyse en cours...' };
  }

  public async getHealthReport() {
    return await this.predictor.getHealthReport();
  }
}
