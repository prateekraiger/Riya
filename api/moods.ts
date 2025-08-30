import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serverSupabase } from '../lib/serverSupabase';
import { MoodEntry } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  switch (req.method) {
    case 'GET':
      const { limit } = req.query;
      try {
        const { data, error } = await serverSupabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(parseInt(limit as string) || 30);

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
      const { mood_score, mood_tags, notes } = req.body;
      if (mood_score === undefined || !mood_tags) {
        return res.status(400).json({ error: 'Mood score and tags are required' });
      }
      try {
        const { data, error } = await serverSupabase
          .from('mood_entries')
          .insert({
            user_id: userId,
            mood_score: mood_score,
            mood_tags: mood_tags,
            notes: notes || '',
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

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
