import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;

function getOpenAI() {
  if (!openaiInstance) {
    const key = process.env.OPENAI_API_KEY;
    console.log('[OpenAI Client] Initializing with key length:', key?.length || 0);
    if (!key) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    openaiInstance = new OpenAI({
      apiKey: key
    });
  }
  return openaiInstance;
}

export async function chatJSON(messages: any[], model = process.env.OPENAI_MODEL || "gpt-4o") {
  const client = getOpenAI();
  return client.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    temperature: 0,
    messages
  });
}