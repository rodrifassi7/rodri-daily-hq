import { createClient } from '@supabase/supabase-js';

// Clave publicable: es segura en el frontend, los datos están protegidos por RLS (cada usuario ve solo lo suyo)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tiwdyqaifhlwaihvbrqj.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_NlBrkKH406ftnd7IkN2wFA_Iwnfi8ez';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
