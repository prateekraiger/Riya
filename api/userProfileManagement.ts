import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serverSupabase } from '../lib/serverSupabase';
import { UserProfile } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { userId } = req.query;

  switch (req.method) {
    case 'POST': // Create User Profile
      const profile: Partial<UserProfile> = req.body;
      if (!profile.user_id) {
        return res.status(400).json({ error: 'User ID is required for creating a profile' });
      }
      try {
        const { data, error } = await serverSupabase
          .from('user_profiles')
          .insert({
            user_id: profile.user_id,
            display_name: profile.display_name || '',
            age: profile.age || '',
            bio: profile.bio || '',
            interests: profile.interests || [],
            relationship_goals: profile.relationship_goals || 'companionship',
            communication_style: profile.communication_style || 'casual',
            favorite_topics: profile.favorite_topics || [],
            riya_personality: profile.riya_personality || 'caring',
            voice_preference: profile.voice_preference || 'soft',
            timezone: profile.timezone || '',
            language_preference: profile.language_preference || 'en',
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

    case 'PUT': // Update User Profile
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID is required for updating a profile' });
      }
      const updates: Partial<UserProfile> = req.body;
      try {
        const { data, error } = await serverSupabase
          .from('user_profiles')
          .update(updates)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
      } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
