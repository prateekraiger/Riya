import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serverSupabase } from '../lib/serverSupabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { messageId, userId, reactionType } = req.query;

  switch (req.method) {
    case 'GET':
      if (!messageId || typeof messageId !== 'string') {
        return res.status(400).json({ error: 'Message ID is required' });
      }
      try {
        const { data, error } = await serverSupabase
          .from('message_reactions')
          .select('*')
          .eq('message_id', messageId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data || []);
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'POST':
      if (!messageId || typeof messageId !== 'string' || !userId || typeof userId !== 'string' || !reactionType || typeof reactionType !== 'string') {
        return res.status(400).json({ error: 'Message ID, User ID, and Reaction Type are required' });
      }
      try {
        const { error } = await serverSupabase.from('message_reactions').insert({
          message_id: messageId,
          user_id: userId,
          reaction_type: reactionType,
        });

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(201).json({ message: 'Reaction added successfully' });
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'DELETE':
      if (!messageId || typeof messageId !== 'string' || !userId || typeof userId !== 'string' || !reactionType || typeof reactionType !== 'string') {
        return res.status(400).json({ error: 'Message ID, User ID, and Reaction Type are required' });
      }
      try {
        const { error } = await serverSupabase
          .from('message_reactions')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', userId)
          .eq('reaction_type', reactionType);

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Reaction removed successfully' });
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
