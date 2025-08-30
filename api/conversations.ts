import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serverSupabase } from '../lib/serverSupabase';
import { Conversation } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { userId, conversationId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const { data: conversations, error } = await serverSupabase
          .from('conversations')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }

        if (!conversations || conversations.length === 0) {
          return res.status(200).json([]);
        }

        // Get message counts and last messages for each conversation
        const conversationsWithDetails = await Promise.all(
          conversations.map(async (conv) => {
            // Get message count
            const { count } = await serverSupabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id);

            // Get last message
            const { data: lastMessage } = await serverSupabase
              .from('messages')
              .select('text')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            return {
              ...conv,
              message_count: count || 0,
              last_message: lastMessage?.text || '',
            };
          })
        );

        return res.status(200).json(conversationsWithDetails);
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'POST':
      const { title } = req.body;
      try {
        const { data, error } = await serverSupabase
          .from('conversations')
          .insert({
            user_id: userId,
            title: title || 'New Chat',
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(201).json(data);
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'PUT':
      if (!conversationId || typeof conversationId !== 'string') {
        return res.status(400).json({ error: 'Conversation ID is required for PUT requests' });
      }
      const { title: newTitle } = req.body;
      if (!newTitle) {
        return res.status(400).json({ error: 'New title is required' });
      }
      try {
        const { error } = await serverSupabase
          .from('conversations')
          .update({ title: newTitle, updated_at: new Date().toISOString() })
          .eq('id', conversationId)
          .eq('user_id', userId); // Ensure user owns the conversation

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Conversation updated successfully' });
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'DELETE':
      if (!conversationId || typeof conversationId !== 'string') {
        return res.status(400).json({ error: 'Conversation ID is required for DELETE requests' });
      }
      try {
        const { error } = await serverSupabase
          .from('conversations')
          .delete()
          .eq('id', conversationId)
          .eq('user_id', userId); // Ensure user owns the conversation

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Conversation deleted successfully' });
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
