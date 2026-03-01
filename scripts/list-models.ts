import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
      console.log("AVAILABLE MODELS:");
      data.models.forEach((m: any) => {
        if (m.name.includes('flash')) {
           console.log(`- ${m.name}`);
        }
      });
    } else {
      console.log("NO MODELS FOUND OR ERROR:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Fetch failed:", error);
  }
}

listModels();
