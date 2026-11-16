import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

// Fallback dummy credentials to prevent crashes if not set
const dummyUrl = 'https://placeholder.supabase.co';
const dummyAnonKey = 'placeholder-key';

export const supabase = createClient(
  isSupabaseConfigured && supabaseUrl ? supabaseUrl : dummyUrl,
  isSupabaseConfigured && supabaseAnonKey ? supabaseAnonKey : dummyAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
