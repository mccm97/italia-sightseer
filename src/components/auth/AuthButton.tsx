import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from './useAuthState';
import { UserMenu } from './UserMenu';
import { LogIn } from 'lucide-react';

export function AuthButton() {
  const { user, loading } = useAuthState();
  const navigate = useNavigate();

  if (loading) {
    return <Button variant="ghost" disabled>Caricamento...</Button>;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {user ? (
        <UserMenu user={user} />
      ) : (
        <Button onClick={() => navigate('/login')} variant="ghost">
          <LogIn className="mr-2 h-4 w-4" />
          Accedi
        </Button>
      )}
    </div>
  );
}