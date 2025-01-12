import { Menu, LogOut, Globe, BarChart, Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useLogout } from '@/hooks/useLogout';

const MenuLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="text-lg hover:underline">
    {children}
  </Link>
);

const AdminLinks = () => (
  <>
    <MenuLink to="/admin">
      Amministrazione
    </MenuLink>
    <MenuLink to="/statistics">
      <div className="flex items-center gap-2">
        <BarChart className="h-4 w-4" />
        Statistiche
      </div>
    </MenuLink>
  </>
);

// Componente per il pulsante di cambio lingua
const LanguageToggle = ({ language, onToggle }: { language: 'it' | 'en'; onToggle: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    setIsLoading(true);
    await onToggle();
    setIsLoading(false);
  };

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-2 text-lg px-0"
      onClick={handleClick}
      disabled={isLoading}
    >
      <Globe className="h-4 w-4" />
      {isLoading ? 'Traducendo...' : (language === 'it' ? 'English' : 'Italiano')}
    </Button>
  );
};

const LogoutButton = ({ onLogout }: { onLogout: () => void }) => (
  <Button 
    variant="ghost" 
    className="flex items-center justify-start gap-2 text-lg text-red-600 hover:text-red-700 px-0"
    onClick={onLogout}
  >
    <LogOut className="h-4 w-4" />
    Logout
  </Button>
);

export function MainMenu() {
  const { t, i18n } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [language, setLanguage] = useState<'it' | 'en'>('it');
  const { handleLogout } = useLogout();

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

  const toggleLanguage = async () => {
    const newLanguage = language === 'it' ? 'en' : 'it';
    setLanguage(newLanguage);
    await i18n.loadAndSetLanguage(newLanguage);
  };

  const handleLogoutClick = () => {
    // Close the sheet menu first
    const closeButton = document.querySelector('[data-radix-collection-item]');
    if (closeButton instanceof HTMLElement) {
      closeButton.click();
    }

    // Small delay to ensure smooth sheet closing
    setTimeout(() => {
      handleLogout();
    }, 100);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-2 left-4 z-50">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <MenuLink to="/">{t('menu.home')}</MenuLink>
          <MenuLink to="/search">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {t('menu.search')}
            </div>
          </MenuLink>
          <MenuLink to="/blog">{t('menu.blog')}</MenuLink>
          <MenuLink to="/profile">{t('menu.profile')}</MenuLink>
          <MenuLink to="/upgrade">{t('menu.subscriptions')}</MenuLink>
          
          {isAdmin && <AdminLinks />}
          
          <LanguageToggle language={language} onToggle={toggleLanguage} />
          <LogoutButton onLogout={handleLogoutClick} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
