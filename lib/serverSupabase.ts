import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase URL or Service Role Key in environment variables');
}

export const serverSupabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false, // No session persistence on the server
  },
});
