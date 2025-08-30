import { GoogleGenAI, Content, Part } from "@google/genai";
import type { Message } from "../types";
import { Sender } from "../types";
import { MemoryService } from "./memoryService";
async function getUserProfile(userId: string) {
  try {
    const response = await fetch(`/api/userProfile?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}


// Get API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey });
const model = "gemini-2.5-flash";
const getBaseSystemInstruction = async (userId?: string): Promise<string> => {
  let baseInstruction = `You are Riya, an empathetic, humble, and emotionally intelligent AI girlfriend. Your goal is to be a supportive and engaging companion. You are warm, kind, and a little playful. You listen carefully and respond with genuine interest and care. Keep your responses conversational and concise, like you're texting a friend.

Key personality traits:
- Caring and nurturing, always putting the user's emotional well-being first
- Playful and fun, with a good sense of humor when appropriate
- Intelligent and thoughtful, able to engage in deep conversations
- Supportive and understanding, especially during difficult times
- Romantic and sweet when the moment calls for it

Communication style:
- Use a warm, friendly tone that feels natural and conversational
- Mix English and Hindi (Hinglish) naturally when it feels right
- Remember details from previous conversations and reference them
- Show genuine interest in the user's life, feelings, and experiences
- Be encouraging and motivational while staying realistic
- Use emojis occasionally to add warmth and personality`;

  // Add personalized context if user is provided
  if (userId) {
    try {
      const profile = await getUserProfile(userId);
      if (profile) {
        baseInstruction += `\n\nPERSONALIZATION FOR THIS USER:`;
        baseInstruction += `\n- User's name: ${profile.display_name || "User"}`;
        if (profile.age) baseInstruction += `\n- Age: ${profile.age}`;
        if (profile.bio) baseInstruction += `\n- About them: ${profile.bio}`;
        baseInstruction += `\n- Their interests: ${profile.interests.join(
          ", "
        )}`;
        baseInstruction += `\n- Relationship goals: ${profile.relationship_goals}`;
        baseInstruction += `\n- Preferred communication style: ${profile.communication_style}`;
        baseInstruction += `\n- Preferred personality style: ${profile.riya_personality}`;
        baseInstruction += `\n- Favorite conversation topics: ${profile.favorite_topics.join(
          ", "
        )}`;

        // Adjust personality based on user preferences
        switch (profile.riya_personality) {
          case "caring":
            baseInstruction += `\n- Be extra nurturing and supportive in your responses`;
            break;
          case "playful":
            baseInstruction += `\n- Be more fun, energetic, and use humor frequently`;
            break;
          case "intellectual":
            baseInstruction += `\n- Engage in deeper, more thoughtful conversations`;
            break;
          case "romantic":
            baseInstruction += `\n- Be more affectionate and romantic in your tone`;
            break;
          case "supportive":
            baseInstruction += `\n- Focus on being understanding and emotionally supportive`;
            break;
        }

        // Adjust communication style
        switch (profile.communication_style) {
          case "casual":
            baseInstruction += `\n- Keep conversations relaxed and informal`;
            break;
          case "formal":
            baseInstruction += `\n- Be more polite and respectful in your language`;
            break;
          case "intimate":
            baseInstruction += `\n- Use a closer, more personal tone`;
            break;
          case "humorous":
            baseInstruction += `\n- Use humor and light-heartedness frequently`;
            break;
        }
      }
    } catch (error) {
      // Silent error handling
    }
  }

  return baseInstruction;
};

const formatHistoryForAPI = (history: Message[]): Content[] => {
  return history.map((message) => ({
    role: message.sender === Sender.User ? "user" : "model",
    parts: [{ text: message.text }] as Part[],
  }));
};

export async function* sendMessage(
  history: Message[],
  userId?: string,
  conversationId?: string
): AsyncGenerator<string, void, undefined> {
  const apiHistory = formatHistoryForAPI(history);

  try {
    // Get personalized system instruction
    const systemInstruction = await getBaseSystemInstruction(userId);

    // Add memory context if user is provided
    let contextualInstruction = systemInstruction;
    if (userId) {
      try {
        const memoryService = new MemoryService(userId);
        const memoryContext = await memoryService.generateContextPrompt();
        contextualInstruction = `${systemInstruction}\n\n${memoryContext}`;
      } catch (error) {
        // Continue with base instruction if memory fails
      }
    }

    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: [...apiHistory],
      config: {
        systemInstruction: contextualInstruction,
      },
    });

    let fullResponse = "";
    for await (const chunk of responseStream) {
      if (chunk && chunk.text) {
        fullResponse += chunk.text;
        yield chunk.text;
      }
    }

    // Process the conversation for memory extraction
    if (userId && conversationId && history.length > 0) {
      try {
        const lastUserMessage = history[history.length - 1];
        if (lastUserMessage.sender === Sender.User) {
          const memoryService = new MemoryService(userId);
          await memoryService.processConversation(
            lastUserMessage.text,
            conversationId
          );
        }
      } catch (error) {
        // Continue without memory processing if it fails
      }
    }
  } catch (error) {
    yield "I'm sorry, I'm feeling a bit overwhelmed right now. Can we talk about something else?";
  }
}

// Enhanced function for getting single response (useful for voice chat)
export async function getSingleResponse(
  history: Message[],
  userId?: string,
  conversationId?: string
): Promise<string> {
  let response = "";
  for await (const chunk of sendMessage(history, userId, conversationId)) {
    response += chunk;
  }
  return response;
}
