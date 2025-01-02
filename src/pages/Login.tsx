import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="container max-w-md mx-auto mt-12 p-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Accedi o Registrati</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Accedi',
              loading_button_label: 'Accesso in corso...',
            },
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Registrati',
              loading_button_label: 'Registrazione in corso...',
            },
          },
        }}
      />
    </div>
  );
}