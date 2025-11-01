// SHIELD v10.0 - Semaphore for bulkhead pattern
export class Semaphore {
  private count = 0;
  
  constructor(private max: number) {}
  
  async acquire(): Promise<void> {
    while (this.count >= this.max) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.count++;
  }
  
  release(): void {
    this.count = Math.max(0, this.count - 1);
  }
}
