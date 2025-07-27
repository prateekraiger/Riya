-- =====================================================
-- RIYA AI CHAT HISTORY DATABASE SETUP
-- =====================================================

DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;

-- =====================================================
-- CREATE CONVERSATIONS TABLE
-- =====================================================
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- TEXT for Stack Auth compatibility
    title TEXT NOT NULL DEFAULT 'New Chat',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CREATE MESSAGES TABLE
-- =====================================================
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- TEXT for Stack Auth compatibility
    sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DISABLE ROW LEVEL SECURITY (Stack Auth handles auth)
-- =====================================================
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.conversations TO authenticated;
GRANT ALL ON public.messages TO authenticated;
GRANT ALL ON public.conversations TO anon;
GRANT ALL ON public.messages TO anon;

-- =====================================================
-- CREATE PERFORMANCE INDEXES
-- =====================================================
CREATE INDEX idx_conversations_user_id_updated_at
ON public.conversations(user_id, updated_at DESC);

CREATE INDEX idx_messages_conversation_id_created_at
ON public.messages(conversation_id, created_at);

CREATE INDEX idx_messages_user_id_created_at
ON public.messages(user_id, created_at);

-- =====================================================
-- CREATE FUNCTION TO UPDATE CONVERSATION TIMESTAMP
-- =====================================================
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations
    SET updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE TRIGGER FOR AUTO-UPDATING TIMESTAMPS
-- =====================================================
DROP TRIGGER IF EXISTS update_conversation_on_message_insert ON public.messages;

CREATE TRIGGER update_conversation_on_message_insert
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- =====================================================
-- CREATE USER PROFILES TABLE
-- =====================================================
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE, -- Stack Auth user ID
    display_name TEXT,
    age TEXT,
    bio TEXT,
    profile_picture_url TEXT,
    interests TEXT[], -- Array of interests
    relationship_goals TEXT DEFAULT 'companionship',
    communication_style TEXT DEFAULT 'casual',
    favorite_topics TEXT[], -- Array of favorite topics
    riya_personality TEXT DEFAULT 'caring',
    voice_preference TEXT DEFAULT 'soft',
    timezone TEXT,
    language_preference TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CREATE USER PREFERENCES TABLE
-- =====================================================
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
    preference_key TEXT NOT NULL,
    preference_value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, preference_key)
);

-- =====================================================
-- CREATE MOOD TRACKING TABLE
-- =====================================================
CREATE TABLE public.mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
    mood_tags TEXT[], -- happy, sad, anxious, excited, etc.
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CREATE MEMORY SYSTEM TABLE
-- =====================================================
CREATE TABLE public.user_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    memory_type TEXT NOT NULL, -- 'personal_info', 'preference', 'important_event', 'emotion'
    memory_key TEXT NOT NULL, -- 'favorite_color', 'birthday', 'job', etc.
    memory_value TEXT NOT NULL,
    importance_score INTEGER DEFAULT 5 CHECK (importance_score >= 1 AND importance_score <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- GRANT PERMISSIONS FOR NEW TABLES
-- =====================================================
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_preferences TO authenticated;
GRANT ALL ON public.mood_entries TO authenticated;
GRANT ALL ON public.user_memories TO authenticated;
GRANT ALL ON public.user_profiles TO anon;
GRANT ALL ON public.user_preferences TO anon;
GRANT ALL ON public.mood_entries TO anon;
GRANT ALL ON public.user_memories TO anon;

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_mood_entries_user_id_created_at ON public.mood_entries(user_id, created_at DESC);
CREATE INDEX idx_user_memories_user_id_type ON public.user_memories(user_id, memory_type);
CREATE INDEX idx_user_memories_conversation_id ON public.user_memories(conversation_id);

-- =====================================================
-- CREATE TRIGGER FOR USER PROFILES UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profile_timestamp_trigger
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profile_timestamp();

CREATE TRIGGER update_user_preferences_timestamp_trigger
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profile_timestamp();

CREATE TRIGGER update_user_memories_timestamp_trigger
    BEFORE UPDATE ON public.user_memories
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profile_timestamp();

-- =====================================================
-- CREATE MESSAGE REACTIONS TABLE
-- =====================================================
CREATE TABLE public.message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'laugh', 'sad', 'angry', 'surprised', 'love')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, reaction_type)
);

-- =====================================================
-- CREATE MESSAGE SEARCH INDEX
-- =====================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_messages_text_search ON public.messages USING gin(text gin_trgm_ops);

-- =====================================================
-- ADD COLUMNS TO MESSAGES TABLE
-- =====================================================
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS emotion_detected TEXT,
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS message_metadata JSONB DEFAULT '{}';

-- =====================================================
-- GRANT PERMISSIONS FOR MESSAGE REACTIONS
-- =====================================================
GRANT ALL ON public.message_reactions TO authenticated;
GRANT ALL ON public.message_reactions TO anon;

-- =====================================================
-- CREATE INDEXES FOR MESSAGE REACTIONS
-- =====================================================
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON public.message_reactions(user_id);

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
