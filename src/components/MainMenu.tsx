import { Menu, LogOut, Globe, BarChart, Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

export function MainMenu() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [language, setLanguage] = useState<'it' | 'en'>('it');
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setIsAdmin(!!adminUser);
    };

    checkAdminStatus();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('Iniziando il processo di logout...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear React Query cache
      queryClient.clear();

      console.log('Logout completato con successo');
      
      // Show success toast
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo",
      });

      // Close the sheet menu
      const closeButton = document.querySelector('[data-radix-collection-item]');
      if (closeButton instanceof HTMLElement) {
        closeButton.click();
      }

      // Navigate after a short delay to ensure the sheet closes smoothly
      setTimeout(() => {
        navigate('/');
      }, 100);

    } catch (error) {
      console.error('Errore durante il logout:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il logout",
        variant: "destructive",
      });
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'it' ? 'en' : 'it';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <Link to="/" className="text-lg hover:underline">Home</Link>
          <Link to="/search" className="text-lg hover:underline flex items-center gap-2">
            <Search className="h-4 w-4" />
            Cerca città
          </Link>
          <Link to="/blog" className="text-lg hover:underline">Blog</Link>
          <Link to="/profile" className="text-lg hover:underline">Profilo</Link>
          <Link to="/upgrade" className="text-lg hover:underline">Abbonamenti</Link>
          {isAdmin && (
            <>
              <Link to="/admin" className="text-lg hover:underline text-blue-600">
                Amministrazione
              </Link>
              <Link to="/statistics" className="text-lg hover:underline text-blue-600">
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  Statistiche
                </div>
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-2 text-lg px-0"
            onClick={toggleLanguage}
          >
            <Globe className="h-4 w-4" />
            {language === 'it' ? 'English' : 'Italiano'}
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center justify-start gap-2 text-lg text-red-600 hover:text-red-700 px-0"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}