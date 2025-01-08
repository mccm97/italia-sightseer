import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogIn, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface HeaderProps {
  user: any | null;
}

export function Header({ user }: HeaderProps) {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      console.log('Fetching user profile...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      console.log('Profile fetched:', data);
      return data;
    },
    enabled: !!user?.id
  });

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">WayWonder</h1>
        {user && (
          <Button 
            onClick={() => navigate('/create-route')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Crea Percorso
          </Button>
        )}
      </div>
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{profile?.username || user.email}</span>
          <Avatar onClick={() => navigate('/profile')} className="cursor-pointer">
            <AvatarImage src={profile?.avatar_url} alt={profile?.username || user.email} />
            <AvatarFallback>{(profile?.username || user.email)?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <Button onClick={() => navigate('/login')} variant="ghost">
          <LogIn className="mr-2 h-4 w-4" />
          Accedi
        </Button>
      )}
    </div>
  );
}