import { Button } from '@/components/ui/button';
import { PenLine, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function CreatePostButton() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();
  }, []);

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('blog.back')}
      </Button>
      {isAuthenticated && (
        <Button onClick={() => navigate('/blog/new')} className="gap-2">
          <PenLine className="h-4 w-4" />
          {t('blog.newPost')}
        </Button>
      )}
    </div>
  );
}