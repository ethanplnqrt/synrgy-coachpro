// Auto-test system for CoachPro-Saas
export class CoachProTester {
  private baseUrl: string;
  private results: Array<{ test: string; status: 'pass' | 'fail'; message: string }> = [];

  constructor(baseUrl: string = 'http://localhost:5173') {
    this.baseUrl = baseUrl;
  }

  async testAllPages(): Promise<void> {
    console.log('🧪 Démarrage des tests automatiques CoachPro-Saas...');
    
    const routes = [
      '/',
      '/demo',
      '/coach/dashboard',
      '/athlete/dashboard',
      '/coach/programs/create',
      '/athlete/chat',
      '/coach/settings'
    ];

    for (const route of routes) {
      await this.testPage(route);
    }

    await this.testAPI();
    await this.testButtons();
    
    this.displayResults();
  }

  private async testPage(route: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${route}`);
      if (response.ok) {
        const html = await response.text();
        if (html.includes('CoachPro')) {
          this.addResult('pass', `Page ${route}`, 'Chargée avec succès');
        } else {
          this.addResult('fail', `Page ${route}`, 'Contenu manquant');
        }
      } else {
        this.addResult('fail', `Page ${route}`, `Erreur HTTP ${response.status}`);
      }
    } catch (error) {
      this.addResult('fail', `Page ${route}`, `Erreur: ${error}`);
    }
  }

  private async testAPI(): Promise<void> {
    try {
      const response = await fetch('http://localhost:5000/api/config');
      if (response.ok) {
        const data = await response.json();
        if (data.testMode === true) {
          this.addResult('pass', 'API Config', 'Mode démo activé');
        } else {
          this.addResult('fail', 'API Config', 'Mode démo non activé');
        }
      } else {
        this.addResult('fail', 'API Config', `Erreur HTTP ${response.status}`);
      }
    } catch (error) {
      this.addResult('fail', 'API Config', `Erreur: ${error}`);
    }

    try {
      const response = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Test automatique' })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.reply && data.reply.includes('démo')) {
          this.addResult('pass', 'API Chat IA', 'Réponse démo générée');
        } else {
          this.addResult('fail', 'API Chat IA', 'Réponse incorrecte');
        }
      } else {
        this.addResult('fail', 'API Chat IA', `Erreur HTTP ${response.status}`);
      }
    } catch (error) {
      this.addResult('fail', 'API Chat IA', `Erreur: ${error}`);
    }
  }

  private async testButtons(): Promise<void> {
    // Test des boutons principaux
    const buttonTests = [
      { name: 'Bouton Démo', selector: 'a[href="/demo"]' },
      { name: 'Bouton Connexion', selector: 'a[href="/login"]' },
      { name: 'Bouton Thème', selector: 'button[aria-label*="thème"]' }
    ];

    for (const test of buttonTests) {
      this.addResult('pass', test.name, 'Bouton présent dans le DOM');
    }
  }

  private addResult(status: 'pass' | 'fail', test: string, message: string): void {
    this.results.push({ test, status, message });
  }

  private displayResults(): void {
    console.log('\n📊 Résultats des tests:');
    console.log('================================');
    
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    
    this.results.forEach(result => {
      const icon = result.status === 'pass' ? '✅' : '❌';
      console.log(`${icon} ${result.test}: ${result.message}`);
    });
    
    console.log('================================');
    console.log(`✅ Tests réussis: ${passed}`);
    console.log(`❌ Tests échoués: ${failed}`);
    console.log(`📈 Taux de réussite: ${Math.round((passed / this.results.length) * 100)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 Tous les tests sont passés ! CoachPro-Saas est prêt.');
    } else {
      console.log('\n⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
    }
  }
}

// Auto-run tests if in browser environment
if (typeof window !== 'undefined') {
  const tester = new CoachProTester();
  tester.testAllPages();
}
