import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '.env.local' });
dotenv.config();

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing");
    return;
  }

  console.log(`Testing Gemini API Key: ${apiKey.substring(0, 6)}...`);
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log("\n--- Listing Available Models ---");
    // Note: The SDK doesn't have a direct listModels on genAI, usually it's handled via the client
    // But we can try to see if we can get any info
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("Success with flash");
  } catch (e: any) {
    console.log(`List check failed: ${e.message}`);
  }

  const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest"];

  for (const modelName of models) {
    console.log(`\n--- Testing Model: ${modelName} ---`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, respond with 'OK' if you can read this.");
      const response = await result.response;
      console.log(`✅ Success! Response: ${response.text()}`);
    } catch (error: any) {
      console.error(`❌ Failed with ${modelName}:`, error.message || error);
      if (error.status) console.error(`   Status: ${error.status}`);
    }
  }
}

test();
