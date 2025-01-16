import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { RouteList } from './RouteList';
import { useRouteData } from './hooks/useRouteData';

interface UserRoutesProps {
  userId?: string;
}

export function UserRoutes({ userId }: UserRoutesProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { t } = useTranslation();
  const { data: routes, isLoading, refetch } = useRouteData(userId);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  if (isLoading) return <div>{t('common.loading')}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">{t('profile.routes')}</h2>
      <RouteList 
        routes={routes || []} 
        currentUserId={currentUserId} 
        onRouteDelete={() => refetch()} 
      />
    </div>
  );
}