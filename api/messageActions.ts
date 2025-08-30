import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serverSupabase } from '../lib/serverSupabase';
import { Message } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { userId, messageId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  switch (req.method) {
    case 'GET': // Search Messages
      const { query, limit } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
      }
      try {
        const { data, error } = await serverSupabase
          .from('messages')
          .select(
            `
            *,
            conversations!inner(user_id)
          `
          )
          .eq('conversations.user_id', userId)
          .textSearch('text', query)
          .order('created_at', { ascending: false })
          .limit(parseInt(limit as string) || 50);

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data as Message[]);
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'PUT': // Toggle Message Favorite
      if (!messageId || typeof messageId !== 'string') {
        return res.status(400).json({ error: 'Message ID is required' });
      }
      const { isFavorite } = req.body;
      if (typeof isFavorite !== 'boolean') {
        return res.status(400).json({ error: 'isFavorite (boolean) is required' });
      }
      try {
        const { error } = await serverSupabase
          .from('messages')
          .update({ is_favorite: isFavorite })
          .eq('id', messageId);

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Message favorite status updated' });
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
