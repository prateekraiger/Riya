import {
  addUserMemory,
  getUserMemories,
  getUserProfile,
  UserMemory,
} from "../database/supabase";

export interface MemoryContext {
  personalInfo: Record<string, string>;
  preferences: Record<string, string>;
  importantEvents: UserMemory[];
  emotions: UserMemory[];
  conversationHistory: string[];
}

export class MemoryService {
  private userId: string;
  private memoryCache: MemoryContext | null = null;
  private lastCacheUpdate: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(userId: string) {
    this.userId = userId;
  }

  // Get comprehensive memory context for AI
  async getMemoryContext(): Promise<MemoryContext> {
    const now = Date.now();

    // Return cached context if still valid
    if (this.memoryCache && now - this.lastCacheUpdate < this.CACHE_DURATION) {
      return this.memoryCache;
    }

    try {
      // Load all memory types
      const [personalInfo, preferences, importantEvents, emotions] =
        await Promise.all([
          getUserMemories(this.userId, "personal_info"),
          getUserMemories(this.userId, "preference"),
          getUserMemories(this.userId, "important_event"),
          getUserMemories(this.userId, "emotion"),
        ]);

      // Convert memories to context format
      const context: MemoryContext = {
        personalInfo: this.memoriesToRecord(personalInfo),
        preferences: this.memoriesToRecord(preferences),
        importantEvents: importantEvents.slice(0, 10), // Last 10 important events
        emotions: emotions.slice(0, 5), // Last 5 emotional states
        conversationHistory: [], // Will be populated by conversation context
      };

      // Cache the context
      this.memoryCache = context;
      this.lastCacheUpdate = now;

      return context;
    } catch (error) {
      return {
        personalInfo: {},
        preferences: {},
        importantEvents: [],
        emotions: [],
        conversationHistory: [],
      };
    }
  }

  // Extract and store memories from conversation
  async processConversation(
    userMessage: string,
    conversationId: string
  ): Promise<void> {
    try {
      // Extract personal information
      await this.extractPersonalInfo(userMessage, conversationId);

      // Extract preferences
      await this.extractPreferences(userMessage, conversationId);

      // Detect emotional context
      await this.detectEmotionalContext(userMessage, conversationId);

      // Store important events
      await this.detectImportantEvents(userMessage, conversationId);

      // Invalidate cache to force refresh
      this.memoryCache = null;
    } catch (error) {
      // Silent error handling
    }
  }

  // Generate context prompt for AI
  async generateContextPrompt(): Promise<string> {
    const context = await this.getMemoryContext();
    const profile = await getUserProfile(this.userId);

    let prompt = "CONTEXT ABOUT USER:\n";

    // Add profile information
    if (profile) {
      prompt += `Name: ${profile.display_name || "User"}\n`;
      if (profile.age) prompt += `Age: ${profile.age}\n`;
      if (profile.bio) prompt += `Bio: ${profile.bio}\n`;
      prompt += `Interests: ${profile.interests.join(", ")}\n`;
      prompt += `Relationship Goals: ${profile.relationship_goals}\n`;
      prompt += `Communication Style: ${profile.communication_style}\n`;
      prompt += `Preferred Personality: ${profile.riya_personality}\n`;
    }

    // Add personal information from memories
    if (Object.keys(context.personalInfo).length > 0) {
      prompt += "\nPERSONAL INFORMATION:\n";
      Object.entries(context.personalInfo).forEach(([key, value]) => {
        prompt += `${key}: ${value}\n`;
      });
    }

    // Add preferences
    if (Object.keys(context.preferences).length > 0) {
      prompt += "\nUSER PREFERENCES:\n";
      Object.entries(context.preferences).forEach(([key, value]) => {
        prompt += `${key}: ${value}\n`;
      });
    }

    // Add recent important events
    if (context.importantEvents.length > 0) {
      prompt += "\nRECENT IMPORTANT EVENTS:\n";
      context.importantEvents.forEach((event) => {
        prompt += `- ${event.memory_value} (${new Date(
          event.created_at
        ).toLocaleDateString()})\n`;
      });
    }

    // Add emotional context
    if (context.emotions.length > 0) {
      prompt += "\nRECENT EMOTIONAL STATE:\n";
      context.emotions.forEach((emotion) => {
        prompt += `- ${emotion.memory_value} (${new Date(
          emotion.created_at
        ).toLocaleDateString()})\n`;
      });
    }

    prompt +=
      "\nPlease use this context to provide personalized, caring responses that show you remember and understand the user.\n";

    return prompt;
  }

  // Helper methods for memory extraction
  private memoriesToRecord(memories: UserMemory[]): Record<string, string> {
    const record: Record<string, string> = {};
    memories.forEach((memory) => {
      record[memory.memory_key] = memory.memory_value;
    });
    return record;
  }

  private async extractPersonalInfo(
    message: string,
    conversationId: string
  ): Promise<void> {
    const personalPatterns = [
      { pattern: /my name is (\w+)/i, key: "name" },
      { pattern: /i'm (\d+) years old/i, key: "age" },
      { pattern: /i work as a? (.+)/i, key: "job" },
      { pattern: /i live in (.+)/i, key: "location" },
      { pattern: /my birthday is (.+)/i, key: "birthday" },
      { pattern: /i study (.+)/i, key: "education" },
      { pattern: /my favorite color is (\w+)/i, key: "favorite_color" },
    ];

    for (const { pattern, key } of personalPatterns) {
      const match = message.match(pattern);
      if (match) {
        await addUserMemory({
          user_id: this.userId,
          conversation_id: conversationId,
          memory_type: "personal_info",
          memory_key: key,
          memory_value: match[1],
          importance_score: 8,
        });
      }
    }
  }

  private async extractPreferences(
    message: string,
    conversationId: string
  ): Promise<void> {
    const preferencePatterns = [
      { pattern: /i like (.+)/i, key: "likes" },
      { pattern: /i don't like (.+)/i, key: "dislikes" },
      { pattern: /i prefer (.+)/i, key: "preferences" },
      { pattern: /my favorite (.+) is (.+)/i, key: "favorites" },
      { pattern: /i hate (.+)/i, key: "dislikes" },
      { pattern: /i love (.+)/i, key: "loves" },
    ];

    for (const { pattern, key } of preferencePatterns) {
      const match = message.match(pattern);
      if (match) {
        const value = match.length > 2 ? `${match[1]}: ${match[2]}` : match[1];
        await addUserMemory({
          user_id: this.userId,
          conversation_id: conversationId,
          memory_type: "preference",
          memory_key: key,
          memory_value: value,
          importance_score: 6,
        });
      }
    }
  }

  private async detectEmotionalContext(
    userMessage: string,
    conversationId: string
  ): Promise<void> {
    const emotionalKeywords = {
      happy: ["happy", "joy", "excited", "great", "awesome", "wonderful"],
      sad: ["sad", "depressed", "down", "upset", "crying", "hurt"],
      anxious: ["anxious", "worried", "nervous", "stressed", "panic"],
      angry: ["angry", "mad", "furious", "annoyed", "frustrated"],
      lonely: ["lonely", "alone", "isolated", "miss", "empty"],
    };

    const lowerMessage = userMessage.toLowerCase();

    for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        await addUserMemory({
          user_id: this.userId,
          conversation_id: conversationId,
          memory_type: "emotion",
          memory_key: emotion,
          memory_value: `User expressed ${emotion}: "${userMessage.substring(
            0,
            100
          )}..."`,
          importance_score: 7,
        });
        break; // Only store the first detected emotion
      }
    }
  }

  private async detectImportantEvents(
    message: string,
    conversationId: string
  ): Promise<void> {
    const eventPatterns = [
      { pattern: /got a new job/i, type: "career" },
      { pattern: /graduated/i, type: "education" },
      { pattern: /got married/i, type: "relationship" },
      { pattern: /moved to/i, type: "life_change" },
      { pattern: /birthday/i, type: "celebration" },
      { pattern: /promotion/i, type: "career" },
      { pattern: /broke up/i, type: "relationship" },
      { pattern: /passed away/i, type: "loss" },
    ];

    for (const { pattern, type } of eventPatterns) {
      if (pattern.test(message)) {
        await addUserMemory({
          user_id: this.userId,
          conversation_id: conversationId,
          memory_type: "important_event",
          memory_key: type,
          memory_value: message.substring(0, 200),
          importance_score: 9,
        });
      }
    }
  }

  // Clear memory cache (useful for testing or manual refresh)
  clearCache(): void {
    this.memoryCache = null;
    this.lastCacheUpdate = 0;
  }
}
