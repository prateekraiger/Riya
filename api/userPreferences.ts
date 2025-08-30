import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serverSupabase } from '../lib/serverSupabase';
import { UserPreference } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { userId, key } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  switch (req.method) {
    case 'GET':
      if (!key || typeof key !== 'string') {
        return res.status(400).json({ error: 'Preference key is required for GET requests' });
      }
      try {
        const { data, error } = await serverSupabase
          .from('user_preferences')
          .select('preference_value')
          .eq('user_id', userId)
          .eq('preference_key', key)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return res.status(404).json({ error: 'Preference not found' });
          }
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data.preference_value);
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'POST': // Using POST for upserting preferences
      const { preference_key, preference_value } = req.body;
      if (!preference_key || preference_value === undefined) {
        return res.status(400).json({ error: 'Preference key and value are required' });
      }
      try {
        const { error } = await serverSupabase.from('user_preferences').upsert({
          user_id: userId,
          preference_key: preference_key,
          preference_value: preference_value,
        });

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Preference set successfully' });
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
