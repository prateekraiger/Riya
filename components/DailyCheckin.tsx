import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sun,
  Moon,
  Coffee,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { Modal } from "./ui/Modal";
import { useAuth } from "../hooks/useAuth";
import { useProfileStore } from "../store/useProfileStore";
import { addMoodEntry, getMoodHistory, MoodEntry } from "../database/supabase";

interface DailyCheckinProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation?: (message: string) => void;
}

const timeOfDayGreetings = {
  morning: {
    icon: Sun,
    greeting: "Good morning! ☀️",
    message: "How are you feeling this beautiful morning?",
    color: "text-yellow-500",
  },
  afternoon: {
    icon: Coffee,
    greeting: "Good afternoon! ☕",
    message: "How's your day going so far?",
    color: "text-orange-500",
  },
  evening: {
    icon: Moon,
    greeting: "Good evening! 🌙",
    message: "How was your day today?",
    color: "text-blue-500",
  },
};

const moodOptions = [
  { value: 1, emoji: "😢", label: "Very Sad", color: "bg-blue-500" },
  { value: 2, emoji: "😔", label: "Sad", color: "bg-blue-400" },
  { value: 3, emoji: "😐", label: "Okay", color: "bg-gray-400" },
  { value: 4, emoji: "🙂", label: "Good", color: "bg-green-400" },
  { value: 5, emoji: "😊", label: "Happy", color: "bg-green-500" },
  { value: 6, emoji: "😄", label: "Very Happy", color: "bg-yellow-400" },
  { value: 7, emoji: "🤩", label: "Excited", color: "bg-yellow-500" },
  { value: 8, emoji: "😍", label: "Amazing", color: "bg-pink-400" },
  { value: 9, emoji: "🥰", label: "Wonderful", color: "bg-pink-500" },
  { value: 10, emoji: "🤗", label: "Perfect", color: "bg-purple-500" },
];

const quickMoodTags = [
  "energetic",
  "tired",
  "stressed",
  "relaxed",
  "anxious",
  "confident",
  "lonely",
  "loved",
  "motivated",
  "overwhelmed",
  "peaceful",
  "excited",
];

export const DailyCheckin: React.FC<DailyCheckinProps> = ({
  isOpen,
  onClose,
  onStartConversation,
}) => {
  const { user } = useAuth();
  const { profile } = useProfileStore();
  const [currentMood, setCurrentMood] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [step, setStep] = useState<
    "greeting" | "mood" | "tags" | "notes" | "summary"
  >("greeting");

  // Get time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  const timeOfDay = getTimeOfDay();
  const currentGreeting = timeOfDayGreetings[timeOfDay];

  // Load recent mood history
  useEffect(() => {
    const loadMoodHistory = async () => {
      if (user) {
        const history = await getMoodHistory(user.id, 7); // Last 7 entries
        setRecentMoods(history);
      }
    };

    if (isOpen) {
      loadMoodHistory();
    }
  }, [user, isOpen]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const moodEntry = await addMoodEntry(
        user.id,
        currentMood,
        selectedTags,
        notes
      );
      if (moodEntry) {
        // Generate a personalized message based on mood
        const moodLabel =
          moodOptions.find((m) => m.value === currentMood)?.label || "okay";

        let conversationStarter = `Hi Riya! I just did my daily check-in. I'm feeling ${moodLabel} today`;
        if (selectedTags.length > 0) {
          conversationStarter += ` and I'm ${selectedTags
            .slice(0, 2)
            .join(" and ")}`;
        }
        if (notes.trim()) {
          conversationStarter += `. ${notes}`;
        }
        conversationStarter += ". How are you doing?";

        // Start conversation with Riya
        if (onStartConversation) {
          onStartConversation(conversationStarter);
        }

        onClose();
      }
    } catch (error) {
      console.error("Error submitting mood:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "greeting":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              <currentGreeting.icon
                className={`w-16 h-16 mx-auto ${currentGreeting.color}`}
              />
              <h2 className="text-2xl font-bold">{currentGreeting.greeting}</h2>
              <p className="text-lg text-muted-foreground">
                {currentGreeting.message}
              </p>

              {profile?.display_name && (
                <p className="text-primary font-medium">
                  Hey {profile.display_name}! Ready for your daily check-in with
                  Riya?
                </p>
              )}
            </div>

            {recentMoods.length > 0 && (
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Your Recent Mood</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {
                      moodOptions.find(
                        (m) => m.value === recentMoods[0].mood_score
                      )?.emoji
                    }
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(recentMoods[0].created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep("mood")}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Start Check-in
            </button>
          </motion.div>
        );

      case "mood":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                How are you feeling right now?
              </h3>
              <p className="text-muted-foreground">
                Choose the number that best represents your mood
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-2">
                  {moodOptions.find((m) => m.value === currentMood)?.emoji}
                </div>
                <div className="text-lg font-medium">
                  {moodOptions.find((m) => m.value === currentMood)?.label}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>😢 Very Sad</span>
                  <span>🤗 Perfect</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood}
                  onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                  className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-2xl font-bold text-primary">
                  {currentMood}/10
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("greeting")}
                className="flex-1 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep("tags")}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            </div>
          </motion.div>
        );

      case "tags":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                What describes your mood?
              </h3>
              <p className="text-muted-foreground">
                Select all that apply (optional)
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {quickMoodTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`p-3 rounded-lg text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("mood")}
                className="flex-1 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep("notes")}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            </div>
          </motion.div>
        );

      case "notes":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Anything else on your mind?
              </h3>
              <p className="text-muted-foreground">
                Share what's happening in your life (optional)
              </p>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell Riya what's on your mind today..."
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep("tags")}
                className="flex-1 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep("summary")}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Review
              </button>
            </div>
          </motion.div>
        );

      case "summary":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Check-in Summary</h3>
              <p className="text-muted-foreground">
                Ready to share this with Riya?
              </p>
            </div>

            <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {moodOptions.find((m) => m.value === currentMood)?.emoji}
                </span>
                <div>
                  <div className="font-medium">
                    {moodOptions.find((m) => m.value === currentMood)?.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentMood}/10
                  </div>
                </div>
              </div>

              {selectedTags.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Feeling:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/20 text-primary rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {notes.trim() && (
                <div>
                  <div className="text-sm font-medium mb-1">Notes:</div>
                  <div className="text-sm text-muted-foreground">{notes}</div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("notes")}
                className="flex-1 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <MessageCircle className="w-4 h-4" />
                )}
                Start Chat with Riya
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daily Check-in"
      icon={<Heart className="w-6 h-6 text-primary" />}
      maxWidth="md"
    >
      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 pb-6">
        <div className="flex gap-1">
          {["greeting", "mood", "tags", "notes", "summary"].map(
            (stepName, index) => (
              <div
                key={stepName}
                className={`flex-1 h-1.5 rounded-full ${
                  ["greeting", "mood", "tags", "notes", "summary"].indexOf(
                    step
                  ) >= index
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              />
            )
          )}
        </div>
      </div>
    </Modal>
  );
};
