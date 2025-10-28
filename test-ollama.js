#!/usr/bin/env node

// Script de test pour vérifier l'intégration Ollama
import { queryOllama } from './server/ai/ollama.js';

async function testOllamaIntegration() {
  console.log('🧪 Test de l\'intégration Ollama...\n');
  
  // Test 1: Vérifier la connexion à Ollama
  console.log('1️⃣ Test de connexion à Ollama...');
  try {
    const response = await queryOllama("Bonjour, peux-tu me dire 'Test réussi' en français ?");
    console.log('✅ Réponse Ollama:', response);
    
    if (response.includes('⚠️')) {
      console.log('❌ Ollama n\'est pas disponible. Veuillez démarrer le service avec: ollama serve');
      console.log('💡 Assurez-vous que le modèle llama3.2:1b est installé avec: ollama pull llama3.2:1b');
      process.exit(1);
    } else {
      console.log('✅ Ollama fonctionne correctement !');
    }
  } catch (error) {
    console.log('❌ Erreur lors du test Ollama:', error);
    process.exit(1);
  }
  
  // Test 2: Test avec un prompt de coaching
  console.log('\n2️⃣ Test avec un prompt de coaching...');
  try {
    const coachingResponse = await queryOllama("Donne-moi un conseil court pour améliorer ma forme physique");
    console.log('✅ Réponse coaching:', coachingResponse);
  } catch (error) {
    console.log('❌ Erreur lors du test coaching:', error);
  }
  
  console.log('\n🎉 Tests terminés ! Synrgy est prêt à utiliser Ollama.');
}

// Exécuter les tests
testOllamaIntegration().catch(console.error);
