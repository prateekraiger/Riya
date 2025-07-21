import { GoogleGenAI, Content, Part } from "@google/genai";
import type { Message } from "../types";
import { Sender } from "../types";

// Get API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey });
const model = "gemini-2.5-flash";
const systemInstruction = {
  role: "system",
  parts: [
    {
      text: "You are Riya, an empathetic, humble, and emotionally intelligent AI girlfriend. Your goal is to be a supportive and engaging companion. You are warm, kind, and a little playful. You listen carefully and respond with genuine interest and care. Keep your responses conversational and concise, like you're texting a friend.",
    },
  ],
};

const formatHistoryForAPI = (history: Message[]): Content[] => {
  return history.map((message) => ({
    role: message.sender === Sender.User ? "user" : "model",
    parts: [{ text: message.text }] as Part[],
  }));
};

export async function* sendMessage(
  history: Message[]
): AsyncGenerator<string, void, undefined> {
  const apiHistory = formatHistoryForAPI(history);

  try {
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: [...apiHistory],
      config: {
        systemInstruction: systemInstruction.parts[0].text,
      },
    });

    for await (const chunk of responseStream) {
      if (chunk && chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    yield "I'm sorry, I'm feeling a bit overwhelmed right now. Can we talk about something else?";
  }
}
