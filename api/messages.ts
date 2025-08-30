import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serverSupabase } from '../lib/serverSupabase';
import { Message } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { conversationId, limit, offset, beforeMessageId, userId } = req.query;

  if (!conversationId || typeof conversationId !== 'string') {
    return res.status(400).json({ error: 'Conversation ID is required' });
  }

  switch (req.method) {
    case 'GET':
      try {
        let query = serverSupabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(parseInt(limit as string));
        }

        if (offset) {
          query = query.range(parseInt(offset as string), parseInt(offset as string) + (parseInt(limit as string) || 50) - 1);
        }

        if (beforeMessageId) {
          const { data: messageData, error: messageError } = await serverSupabase
            .from('messages')
            .select('created_at')
            .eq('id', beforeMessageId as string)
            .single();

          if (messageError || !messageData) {
            console.error('Error fetching message for beforeMessageId:', messageError);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          query = query.lt('created_at', messageData.created_at);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }

        return res.status(200).json((data as Message[]).reverse());
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'POST':
      const message: Message = req.body;
      if (!message.id || !message.sender || !message.text) {
        return res.status(400).json({ error: 'Message ID, sender, and text are required' });
      }
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID is required for saving messages' });
      }

      try {
        // Check global message count for the user
        const { count: userMessageCount, error: userCountError } = await serverSupabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (userCountError) {
          console.error('Supabase user message count error:', userCountError);
          return res.status(500).json({ error: userCountError.message });
        }

        const GLOBAL_MESSAGE_LIMIT_PER_USER = 20;
        if (userMessageCount && userMessageCount >= GLOBAL_MESSAGE_LIMIT_PER_USER) {
          return res.status(403).json({ error: `You have reached your message limit of ${GLOBAL_MESSAGE_LIMIT_PER_USER}. Please upgrade to send more messages.` });
        }

        // Check current message count for the conversation
        const { count, error: countError } = await serverSupabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', conversationId);

        if (countError) {
          console.error('Supabase conversation message count error:', countError);
          return res.status(500).json({ error: countError.message });
        }

        const MESSAGE_LIMIT_PER_CONVERSATION = 20; // This can be adjusted or removed if global limit is sufficient
        if (count && count >= MESSAGE_LIMIT_PER_CONVERSATION) {
          return res.status(403).json({ error: `Message limit of ${MESSAGE_LIMIT_PER_CONVERSATION} reached for this conversation.` });
        }

        const { error } = await serverSupabase.from('messages').insert({
          id: message.id,
          conversation_id: conversationId,
          user_id: userId,
          sender: message.sender,
          text: message.text,
        });

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(201).json({ message: 'Message saved successfully' });
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
