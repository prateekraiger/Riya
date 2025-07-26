-- =====================================================
-- RIYA AI CHAT HISTORY DATABASE SETUP
-- Copy and paste this entire script into Supabase SQL Editor
-- Compatible with Stack Auth
-- =====================================================

-- Drop existing tables if they exist (to start fresh)
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
-- SETUP COMPLETE!
-- =====================================================
