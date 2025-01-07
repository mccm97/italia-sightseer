import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://shcbdouqszburohgegcb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY2Jkb3Vxc3pidXJvaGdlZ2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5MjIxNDUsImV4cCI6MjAxODQ5ODE0NX0.xpLqPHk-gV4VrMt0hgjbhNOUmHVLFGE4ENPBGUXOyXY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'waywonder-auth'
  }
});

// Test the connection and log any issues
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error.message);
  } else {
    console.log('Supabase connection successful:', data.session ? 'Active session' : 'No active session');
  }
});

// Enhanced error logging for authentication issues
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'User authenticated' : 'No session');
  
  if (event === 'SIGNED_IN') {
    console.log('User signed in successfully:', session?.user?.id);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'USER_UPDATED') {
    console.log('User updated:', session?.user?.id);
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
});

export default supabase;