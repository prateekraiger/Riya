import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Heart,
  MessageCircle,
  Calendar,
  Target,
  Award,
  Flame,
  Lock,
  CheckCircle,
} from "lucide-react";
import { Modal } from "./ui/Modal";
import { useAuth } from "../hooks/useAuth";
async function getUserPreference(userId: string, key: string) {
  try {
    const response = await fetch(`/api/userPreferences?userId=${userId}&key=${key}`);
    if (!response.ok) {
      if (response.status === 404) return null; // Preference not found
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user preference:", error);
    return null;
  }
}

async function setUserPreference(userId: string, key: string, value: any) {
  try {
    const response = await fetch('/api/userPreferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, preference_key: key, preference_value: value }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error setting user preference:", error);
    return false;
  }
}

async function getConversations(userId: string) {
  try {
    const response = await fetch(`/api/conversations?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
}

async function getMoodHistory(userId: string, limit: number) {
  try {
    const response = await fetch(`/api/moods?userId=${userId}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching mood history:", error);
    return [];
  }
}


interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: "conversation" | "streak" | "mood" | "voice" | "relationship";
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface Streak {
  current: number;
  longest: number;
  lastActivity: string;
  isActive: boolean;
}

interface AchievementSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const achievementDefinitions: Omit<
  Achievement,
  "progress" | "unlocked" | "unlockedAt"
>[] = [
  // Conversation Achievements
  {
    id: "first_chat",
    title: "First Hello",
    description: "Send your first message to Riya",
    icon: MessageCircle,
    category: "conversation",
    requirement: 1,
    reward: "Welcome badge",
    rarity: "common",
  },
  {
    id: "chatty_100",
    title: "Chatty Friend",
    description: "Send 100 messages",
    icon: MessageCircle,
    category: "conversation",
    requirement: 100,
    reward: "Chatty badge",
    rarity: "common",
  },
  {
    id: "conversationalist_500",
    title: "Great Conversationalist",
    description: "Send 500 messages",
    icon: MessageCircle,
    category: "conversation",
    requirement: 500,
    reward: "Conversationalist badge",
    rarity: "rare",
  },
  {
    id: "chatterbox_1000",
    title: "Chatterbox",
    description: "Send 1000 messages",
    icon: MessageCircle,
    category: "conversation",
    requirement: 1000,
    reward: "Chatterbox badge",
    rarity: "epic",
  },

  // Streak Achievements
  {
    id: "streak_3",
    title: "Getting Started",
    description: "Chat for 3 days in a row",
    icon: Flame,
    category: "streak",
    requirement: 3,
    reward: "Consistency badge",
    rarity: "common",
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Chat for 7 days in a row",
    icon: Flame,
    category: "streak",
    requirement: 7,
    reward: "Weekly badge",
    rarity: "rare",
  },
  {
    id: "streak_30",
    title: "Monthly Master",
    description: "Chat for 30 days in a row",
    icon: Flame,
    category: "streak",
    requirement: 30,
    reward: "Monthly badge",
    rarity: "epic",
  },
  {
    id: "streak_100",
    title: "Dedication Legend",
    description: "Chat for 100 days in a row",
    icon: Flame,
    category: "streak",
    requirement: 100,
    reward: "Legend badge",
    rarity: "legendary",
  },

  // Mood Achievements
  {
    id: "mood_tracker_7",
    title: "Mood Tracker",
    description: "Complete 7 daily check-ins",
    icon: Heart,
    category: "mood",
    requirement: 7,
    reward: "Wellness badge",
    rarity: "common",
  },
  {
    id: "mood_tracker_30",
    title: "Wellness Warrior",
    description: "Complete 30 daily check-ins",
    icon: Heart,
    category: "mood",
    requirement: 30,
    reward: "Wellness warrior badge",
    rarity: "rare",
  },

  // Relationship Achievements
  {
    id: "relationship_week",
    title: "One Week Together",
    description: "Chat with Riya for a week",
    icon: Calendar,
    category: "relationship",
    requirement: 7,
    reward: "Week anniversary badge",
    rarity: "common",
  },
  {
    id: "relationship_month",
    title: "One Month Together",
    description: "Chat with Riya for a month",
    icon: Calendar,
    category: "relationship",
    requirement: 30,
    reward: "Month anniversary badge",
    rarity: "rare",
  },
  {
    id: "relationship_year",
    title: "One Year Together",
    description: "Chat with Riya for a year",
    icon: Calendar,
    category: "relationship",
    requirement: 365,
    reward: "Year anniversary badge",
    rarity: "legendary",
  },
];

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streak, setStreak] = useState<Streak>({
    current: 0,
    longest: 0,
    lastActivity: "",
    isActive: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  const categories = [
    { id: "all", label: "All", icon: Trophy },
    { id: "conversation", label: "Chat", icon: MessageCircle },
    { id: "streak", label: "Streaks", icon: Flame },
    { id: "mood", label: "Wellness", icon: Heart },
    { id: "relationship", label: "Milestones", icon: Calendar },
  ];

  const rarityColors = {
    common: "text-gray-600 bg-gray-100",
    rare: "text-blue-600 bg-blue-100",
    epic: "text-purple-600 bg-purple-100",
    legendary: "text-yellow-600 bg-yellow-100",
  };

  useEffect(() => {
    if (isOpen && user) {
      loadAchievements();
    }
  }, [isOpen, user]);

  const loadAchievements = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Load user's achievement progress
      const achievementData =
        (await getUserPreference(user.id, "achievements")) || {};
      const streakData = (await getUserPreference(user.id, "streak")) || {
        current: 0,
        longest: 0,
        lastActivity: "",
        isActive: false,
      };

      // Calculate current progress
      const [messageCount, moodCount, relationshipDays] = await Promise.all([
        calculateMessageCount(),
        calculateMoodEntries(),
        calculateRelationshipDays(),
      ]);

      // Update achievements with current progress
      const updatedAchievements = achievementDefinitions.map((def) => {
        let progress = 0;

        switch (def.category) {
          case "conversation":
            progress = messageCount;
            break;
          case "streak":
            progress = streakData.longest || 0;
            break;
          case "mood":
            progress = moodCount;
            break;
          case "relationship":
            progress = relationshipDays;
            break;
        }

        const isUnlocked = progress >= def.requirement;
        const wasUnlocked = achievementData[def.id]?.unlocked || false;

        // Check for newly unlocked achievements
        if (isUnlocked && !wasUnlocked) {
          const newAchievement = {
            ...def,
            progress,
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          };
          setNewlyUnlocked((prev) => [...prev, newAchievement]);

          // Save to preferences
          achievementData[def.id] = {
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          };
        }

        return {
          ...def,
          progress: Math.min(progress, def.requirement),
          unlocked: isUnlocked,
          unlockedAt: achievementData[def.id]?.unlockedAt,
        };
      });

      setAchievements(updatedAchievements);
      setStreak(streakData);

      // Save updated achievement data
      await setUserPreference(user.id, "achievements", achievementData);
    } catch (error) {
      // Silent error handling
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMessageCount = async (): Promise<number> => {
    if (!user) return 0;

    try {
      const conversations = await getConversations(user.id);
      return conversations.reduce(
        (total, conv) => total + (conv.message_count || 0),
        0
      );
    } catch (error) {
      return 0;
    }
  };

  const calculateMoodEntries = async (): Promise<number> => {
    if (!user) return 0;

    try {
      const moodHistory = await getMoodHistory(user.id, 100);
      return moodHistory.length;
    } catch (error) {
      return 0;
    }
  };

  const calculateRelationshipDays = async (): Promise<number> => {
    if (!user) return 0;

    try {
      const conversations = await getConversations(user.id);
      if (conversations.length === 0) return 0;

      const firstConversation = conversations[conversations.length - 1];
      const firstDate = new Date(firstConversation.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - firstDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      return 0;
    }
  };

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Achievements"
        subtitle={`${unlockedCount} of ${totalCount} unlocked`}
        icon={
          <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
        }
        maxWidth="4xl"
      >
        {/* Header Content */}
        <div className="p-6 border-b border-border/30 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((unlockedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Streak Display */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/20 rounded-lg">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">
                {streak.current} day streak
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg">
              <Target className="w-4 h-4" />
              <span className="text-sm">Best: {streak.longest} days</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-300px)] sm:max-h-[calc(85vh-300px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative p-4 rounded-lg border transition-all duration-200 ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md"
                      : "bg-secondary/30 border-border/50"
                  }`}
                >
                  {/* Rarity Badge */}
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                      rarityColors[achievement.rarity]
                    }`}
                  >
                    {achievement.rarity}
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.unlocked
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {achievement.unlocked ? (
                        <achievement.icon className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`font-semibold mb-1 ${
                          achievement.unlocked
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {achievement.title}
                      </h3>
                      <p
                        className={`text-sm mb-3 ${
                          achievement.unlocked
                            ? "text-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {achievement.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Progress</span>
                          <span>
                            {achievement.progress}/{achievement.requirement}
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              achievement.unlocked
                                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                : "bg-primary"
                            }`}
                            style={{
                              width: `${Math.min(
                                (achievement.progress /
                                  achievement.requirement) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Reward */}
                      {achievement.reward && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Reward: {achievement.reward}
                        </div>
                      )}

                      {/* Unlocked Date */}
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Unlocked{" "}
                          {new Date(
                            achievement.unlockedAt
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Achievement Unlock Notifications */}
      <AnimatePresence>
        {newlyUnlocked.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg shadow-lg z-[70]"
            style={{ bottom: `${16 + index * 80}px` }}
          >
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6" />
              <div>
                <div className="font-semibold">Achievement Unlocked!</div>
                <div className="text-sm opacity-90">{achievement.title}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
};
