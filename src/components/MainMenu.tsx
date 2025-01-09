import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function MainMenu() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        setIsAdmin(!!adminData);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 mt-8">
          <Link to="/" className="text-lg hover:underline">Home</Link>
          <Link to="/blog" className="text-lg hover:underline">Blog</Link>
          <Link to="/profile" className="text-lg hover:underline">Profilo</Link>
          <Link to="/upgrade" className="text-lg hover:underline">Abbonamenti</Link>
          {isAdmin && (
            <Link to="/admin" className="text-lg hover:underline">Admin</Link>
          )}
        </div>
      </div>
    </nav>
  );
}