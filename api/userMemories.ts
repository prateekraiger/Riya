import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serverSupabase } from '../lib/serverSupabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { userId, memoryType } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  switch (req.method) {
    case 'GET':
      if (!memoryType || typeof memoryType !== 'string') {
        return res.status(400).json({ error: 'Memory type is required for GET requests' });
      }
      try {
        const { data, error } = await serverSupabase
          .from('user_memories')
          .select('*')
          .eq('user_id', userId)
          .eq('memory_type', memoryType)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'POST':
      const { user_id, conversation_id, memory_type, memory_key, memory_value, importance_score } = req.body;

      if (!user_id || !conversation_id || !memory_type || !memory_key || !memory_value || importance_score === undefined) {
        return res.status(400).json({ error: 'All memory fields are required' });
      }

      try {
        const { data, error } = await serverSupabase
          .from('user_memories')
          .insert({
            user_id,
            conversation_id,
            memory_type,
            memory_key,
            memory_value,
            importance_score,
          })
          .select();

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(201).json(data);
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
