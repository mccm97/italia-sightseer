import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://shcbdouqszburohgegcb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY2Jkb3Vxc3pidXJvaGdlZ2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzI4MTYsImV4cCI6MjA1MTIwODgxNn0.6Ch_Y9J-84NI4Eqd3wnw8nNv1EYpeYNX43KLtgBTTR0";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  }
);