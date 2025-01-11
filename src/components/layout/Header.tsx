import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  user: any | null;
}

export function Header({ user }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <div className="w-[100px]" /> {/* Spacer for centering */}
      <Link to="/" className="text-2xl font-bold hover:text-primary transition-colors">
        WayWonder
      </Link>
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{user.username}</span>
          <Avatar onClick={() => navigate('/profile')} className="cursor-pointer">
            <AvatarImage src={user.avatar_url} alt={user.username || user.email} />
            <AvatarFallback>{(user.username || user.email)?.[0]?.toUpperCase()}</AvatarFallback>
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