import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shcbdouqszburohgegcb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY2Jkb3Vxc3pidXJvaGdlZ2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5MjIxNDUsImV4cCI6MjAxODQ5ODE0NX0.xpLqPHk-gV4VrMt0hgjbhNOUmHVLFGE4ENPBGUXOyXY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add error logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'User authenticated' : 'No session');
  
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.id);
  } else if (event === 'USER_DELETED') {
    console.log('User account deleted');
  } else if (event === 'USER_UPDATED') {
    console.log('User account updated');
  }
});

export default supabase;