import { Button } from '@/components/ui/button';
import { PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export function CreatePostButton() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();
  }, []);

  if (!isAuthenticated) return null;

  return (
    <Button onClick={() => navigate('/blog/new')} className="gap-2">
      <PenLine className="h-4 w-4" />
      Nuovo Post
    </Button>
  );
}