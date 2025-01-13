import { useState } from 'react';
import { useSession } from './useSession';
import { useAuthStateChange } from './useAuthStateChange';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const { loading } = useSession();
  
  useAuthStateChange(setUser);

  return { user, loading };
}