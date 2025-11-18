import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Chybí Supabase credentials v .env souboru!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'studypro', // Používáme studypro schéma místo public
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper funkce pro práci s daty
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  return {
    success: false,
    error: error.message || 'Něco se pokazilo',
  };
};

export const handleSupabaseSuccess = (data) => {
  return {
    success: true,
    data,
  };
};
