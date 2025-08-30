import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, Settings, Edit3, Save } from "lucide-react";
import { Modal } from "./ui/Modal";
import { useAuth } from "../hooks/useAuth";
import { useProfileStore } from "../store/useProfileStore";
import { UserProfile as UserProfileType } from "../types";

async function getUserProfile(userId: string) {
  try {
    const response = await fetch(`/api/userProfile?userId=${userId}`);
    if (!response.ok) {
      if (response.status === 404) return null; // Profile not found
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

async function createUserProfile(profile: Partial<UserProfileType>) {
  try {
    const response = await fetch('/api/userProfileManagement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating user profile:", error);
    return null;
  }
}

async function updateUserProfile(userId: string, updates: Partial<UserProfileType>) {
  try {
    const response = await fetch(`/api/userProfileManagement?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
}


interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const interestOptions = [
  "Movies",
  "Music",
  "Books",
  "Travel",
  "Cooking",
  "Gaming",
  "Sports",
  "Art",
  "Technology",
  "Nature",
  "Photography",
  "Fitness",
  "Dancing",
  "Writing",
  "Meditation",
  "Fashion",
  "Science",
  "History",
];

const topicOptions = [
  "Daily Life",
  "Dreams & Goals",
  "Relationships",
  "Career",
  "Hobbies",
  "Philosophy",
  "Humor",
  "Emotional Support",
  "Adventure",
  "Learning",
  "Creativity",
  "Wellness",
];

export const UserProfile: React.FC<UserProfileProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { profile, setProfile, setIsLoading, isLoading } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "preferences">(
    "profile"
  );

  const [formData, setFormData] = useState<Partial<UserProfileType>>({
    display_name: "",
    age: "",
    bio: "",
    interests: [],
    relationship_goals: "companionship",
    communication_style: "casual",
    favorite_topics: [],
    riya_personality: "caring",
    voice_preference: "soft",
    timezone: "",
    language_preference: "en",
  });

  // Load user profile on mount
  useEffect(() => {
    if (user && isOpen) {
      loadUserProfile();
    }
  }, [user, isOpen]);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        age: profile.age || "",
        bio: profile.bio || "",
        interests: profile.interests || [],
        relationship_goals: profile.relationship_goals || "companionship",
        communication_style: profile.communication_style || "casual",
        favorite_topics: profile.favorite_topics || [],
        riya_personality: profile.riya_personality || "caring",
        voice_preference: profile.voice_preference || "soft",
        timezone: profile.timezone || "",
        language_preference: profile.language_preference || "en",
      });
    }
  }, [profile]);

  const loadUserProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let userProfile = await getUserProfile(user.id);

      if (!userProfile) {
        // Create a new profile if none exists
        userProfile = await createUserProfile({
          user_id: user.id,
          display_name: user.displayName || "",
        });
      }

      setProfile(userProfile);
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !formData) return;

    setIsLoading(true);
    try {
      const updatedProfile = await updateUserProfile(user.id, formData);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (!isEditing) return;
    const newInterests = formData.interests?.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...(formData.interests || []), interest];
    setFormData({ ...formData, interests: newInterests });
  };

  const toggleTopic = (topic: string) => {
    if (!isEditing) return;
    const newTopics = formData.favorite_topics?.includes(topic)
      ? formData.favorite_topics.filter((t) => t !== topic)
      : [...(formData.favorite_topics || []), topic];
    setFormData({ ...formData, favorite_topics: newTopics });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Your Profile"
      subtitle="Personalize your experience with Riya"
      icon={<User className="w-6 h-6 text-primary" />}
      maxWidth="4xl"
      headerActions={
        activeTab === "profile" && (
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isEditing ? (
              <Save className="w-4 h-4" />
            ) : (
              <Edit3 className="w-4 h-4" />
            )}
            {isEditing ? "Save" : "Edit"}
          </button>
        )
      }
    >
      {/* Tabs */}
      <div className="p-6 pb-0">
        <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "preferences", label: "Preferences", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
                activeTab === id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.display_name || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          display_name: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background disabled:opacity-60 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="How should Riya call you?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Age
                    </label>
                    <input
                      type="text"
                      value={formData.age || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background disabled:opacity-60 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Your age"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={formData.bio || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background disabled:opacity-60 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="Tell Riya a bit about yourself..."
                  />
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Your Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      disabled={!isEditing}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        formData.interests?.includes(interest)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorite Topics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Favorite Conversation Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topicOptions.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      disabled={!isEditing}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        formData.favorite_topics?.includes(topic)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "preferences" && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Riya's Personality */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Riya's Personality
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Personality Style
                    </label>
                    <select
                      value={formData.riya_personality}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          riya_personality: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background disabled:opacity-60 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="caring">Caring & Nurturing</option>
                      <option value="playful">Playful & Fun</option>
                      <option value="intellectual">Intellectual & Deep</option>
                      <option value="romantic">Romantic & Sweet</option>
                      <option value="supportive">
                        Supportive & Understanding
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Communication Style
                    </label>
                    <select
                      value={formData.communication_style}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          communication_style: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background disabled:opacity-60 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="casual">Casual & Friendly</option>
                      <option value="formal">Polite & Formal</option>
                      <option value="intimate">Intimate & Close</option>
                      <option value="humorous">Humorous & Light</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Voice & Language */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Voice & Language Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Voice Preference
                    </label>
                    <select
                      value={formData.voice_preference}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          voice_preference: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background disabled:opacity-60 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="soft">Soft & Gentle</option>
                      <option value="energetic">Energetic & Lively</option>
                      <option value="calm">Calm & Soothing</option>
                      <option value="warm">Warm & Friendly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Relationship Goals
                    </label>
                    <select
                      value={formData.relationship_goals}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          relationship_goals: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background disabled:opacity-60 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="companionship">Companionship</option>
                      <option value="emotional_support">
                        Emotional Support
                      </option>
                      <option value="casual_chat">Casual Chat</option>
                      <option value="deep_connection">Deep Connection</option>
                      <option value="learning_partner">Learning Partner</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
