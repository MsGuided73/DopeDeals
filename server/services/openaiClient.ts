import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function chatJSON(messages: any[], model = process.env.OPENAI_MODEL || "gpt-4o") {
  return openai.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    temperature: 0,
    messages
  });
}