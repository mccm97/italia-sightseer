import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import zxcvbn from 'zxcvbn';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    // Add password strength indicator
    const style = document.createElement('style');
    style.textContent = `
      .supabase-auth-ui_ui-password-input + div {
        height: 4px;
        margin-top: 4px;
        border-radius: 2px;
        transition: all 0.2s;
      }
      .strength-0 { background-color: #ef4444; width: 20%; }
      .strength-1 { background-color: #f97316; width: 40%; }
      .strength-2 { background-color: #eab308; width: 60%; }
      .strength-3 { background-color: #84cc16; width: 80%; }
      .strength-4 { background-color: #22c55e; width: 100%; }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const passwordInput = document.querySelector('input[type="password"]');
          if (passwordInput && !passwordInput.nextElementSibling?.classList.contains('strength-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'strength-indicator';
            passwordInput.parentNode?.insertBefore(indicator, passwordInput.nextElementSibling);

            passwordInput.addEventListener('input', (e) => {
              const target = e.target as HTMLInputElement;
              const result = zxcvbn(target.value);
              indicator.className = `strength-indicator strength-${result.score}`;
            });
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      subscription.unsubscribe();
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, [navigate]);

  return (
    <div className="container max-w-md mx-auto mt-12 p-4">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Indietro
        </Button>
        <h1 className="text-2xl font-bold text-center">Accedi o Registrati</h1>
      </div>
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