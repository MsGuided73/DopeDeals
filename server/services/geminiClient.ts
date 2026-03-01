import { GoogleGenerativeAI } from "@google/generative-ai";

let genAIInstance: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }
    console.log(`[Gemini Client] Initializing with key starting: ${apiKey.substring(0, 6)}...`);
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
}

export async function geminiChatJSON(messages: { role: string; content: string }[], model = "gemini-2.0-flash") {
  const genAI = getGenAI();
  const geminiModel = genAI.getGenerativeModel({ 
    model,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  // Convert chat history format
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  
  const lastMessage = messages[messages.length - 1].content;

  try {
    const chat = geminiModel.startChat({
      history,
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return {
      choices: [
        {
          message: {
            content: text
          }
        }
      ]
    };
  } catch (error: any) {
    console.error(`[Gemini Client] Error calling model ${model}:`, error);
    throw error;
  }
}
