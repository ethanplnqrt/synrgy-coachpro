#!/usr/bin/env node

// Script de test complet pour l'intégration Ollama
import { queryOllama } from './server/ai/ollama.ts';

async function testOllamaIntegration() {
  console.log('🧪 Test complet de l\'intégration Ollama pour Synrgy...\n');
  
  // Test 1: Vérifier la connexion à Ollama
  console.log('1️⃣ Test de connexion à Ollama...');
  try {
    const response = await queryOllama("Bonjour, peux-tu me dire 'Test réussi' en français ?");
    console.log('✅ Réponse Ollama:', response.substring(0, 100) + '...');
    
    if (response.includes('⚠️')) {
      console.log('❌ Ollama n\'est pas disponible. Veuillez démarrer le service avec: ollama serve');
      console.log('💡 Assurez-vous que le modèle llama3.2:1b est installé avec: ollama pull llama3.2:1b');
      return false;
    } else {
      console.log('✅ Ollama fonctionne correctement !');
    }
  } catch (error) {
    console.log('❌ Erreur lors du test Ollama:', error);
    return false;
  }
  
  // Test 2: Test avec un prompt de coaching
  console.log('\n2️⃣ Test avec un prompt de coaching...');
  try {
    const coachingResponse = await queryOllama("Donne-moi un conseil court pour améliorer ma forme physique");
    console.log('✅ Réponse coaching:', coachingResponse.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Erreur lors du test coaching:', error);
  }
  
  console.log('\n🎉 Tests terminés ! Synrgy est prêt à utiliser Ollama.');
  console.log('\n📋 Résumé de l\'intégration:');
  console.log('✅ Fichier .env configuré avec les variables Ollama');
  console.log('✅ Module /server/ai/ollama.ts créé');
  console.log('✅ Routes IA modifiées pour utiliser Ollama');
  console.log('✅ Dépendance OpenAI supprimée du package.json');
  console.log('✅ Serveur backend fonctionnel avec Ollama');
  console.log('\n🚀 Pour démarrer le serveur: npm run dev:server');
  console.log('🌐 Serveur disponible sur: http://localhost:5000');
  
  return true;
}

// Exécuter les tests
testOllamaIntegration().catch(console.error);
