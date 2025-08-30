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
