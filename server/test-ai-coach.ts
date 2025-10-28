#!/usr/bin/env tsx
/**
 * End-to-end test for AI Coach functionality
 * Tests the complete flow: auth → send message → receive AI response
 * Logs token usage and performance metrics
 */

import { storage } from "./storage";
import { getAICoachResponse } from "./openai";

const TEST_USER = {
  username: "test_ai_coach_user",
  email: "test_ai@coachpro.com",
  password: "test123",
  fullName: "Test User",
  role: "coach" as const,
};

const TEST_MESSAGE = "Je veux un programme pour perdre 5 kg";

interface TestResult {
  success: boolean;
  duration: number;
  estimatedTokens: number;
  responsePreview: string;
  error?: string;
}

async function runTest(): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    console.log("\n=== AI Coach End-to-End Test ===\n");
    
    // Step 1: Ensure test user exists
    console.log("Step 1: Setting up test user...");
    let user = await storage.getUserByUsername(TEST_USER.username);
    if (!user) {
      console.log("Creating test user...");
      user = await storage.createUser(TEST_USER);
    }
    console.log(`✓ User ready: ${user.username} (${user.id})\n`);
    
    // Step 2: Send AI request
    console.log("Step 2: Sending message to AI Coach...");
    console.log(`Message: "${TEST_MESSAGE}"\n`);
    
    const aiStartTime = Date.now();
    const response = await getAICoachResponse(TEST_MESSAGE, user.id);
    const aiDuration = Date.now() - aiStartTime;
    
    // Step 3: Analyze response
    console.log("Step 3: Analyzing response...");
    const responseLength = response.length;
    const estimatedTokens = Math.ceil(responseLength / 4);
    const responsePreview = response.substring(0, 150) + (response.length > 150 ? "..." : "");
    
    console.log(`\n✓ AI Response received in ${aiDuration}ms`);
    console.log(`✓ Response length: ${responseLength} characters`);
    console.log(`✓ Estimated tokens: ${estimatedTokens}`);
    console.log(`\nResponse preview:\n"${responsePreview}"\n`);
    
    // Step 4: Validate response
    const isValid = response.length > 50 && 
                    !response.includes("temporairement indisponible") &&
                    !response.includes("Désolé");
    
    if (!isValid) {
      throw new Error("AI response appears to be an error message or too short");
    }
    
    const totalDuration = Date.now() - startTime;
    
    console.log("=== Test Summary ===");
    console.log(`Status: ✓ SUCCESS`);
    console.log(`Total duration: ${totalDuration}ms`);
    console.log(`AI latency: ${aiDuration}ms`);
    console.log(`Estimated tokens used: ~${estimatedTokens}`);
    console.log(`Estimated cost per request: ~${(estimatedTokens * 0.00002).toFixed(6)} USD`);
    console.log(`(Based on rough estimate of $0.02 per 1000 tokens)\n`);
    
    return {
      success: true,
      duration: totalDuration,
      estimatedTokens,
      responsePreview,
    };
  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    
    console.error("\n=== Test FAILED ===");
    console.error(`Error: ${error.message}`);
    console.error(`Duration before failure: ${totalDuration}ms\n`);
    
    return {
      success: false,
      duration: totalDuration,
      estimatedTokens: 0,
      responsePreview: "",
      error: error.message,
    };
  }
}

// Run test if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTest()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Unexpected error:", error);
      process.exit(1);
    });
}

export { runTest };
