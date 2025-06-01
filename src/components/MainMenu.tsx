
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/useLogout';
import { supabase } from '@/integrations/supabase/client';
import { MenuLink } from './layout/MenuLink';
import { AdminLinks } from './layout/AdminLinks';
import { LanguageToggle } from './layout/LanguageToggle';
import { LogoutButton } from './layout/LogoutButton';
import { PWAInstallItem } from './layout/PWAInstallItem';

export function MainMenu() {
  const { t, i18n } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [language, setLanguage] = useState(i18n.language || 'it');
  const { handleLogout } = useLogout();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setIsAdmin(!!adminUser);
      }
    };

    checkAdminStatus();
  }, []);

  const toggleLanguage = () => {
    console.log('Current language:', language);
    const newLanguage = language === 'it' ? 'en' : 'it';
    i18n.changeLanguage(newLanguage).then(() => {
      setLanguage(newLanguage);
      console.log('Language switched to:', newLanguage);
    });
  };

  const handleLogoutClick = () => {
    const closeButton = document.querySelector('[data-radix-collection-item]');
    if (closeButton instanceof HTMLElement) {
      closeButton.click();
    }

    setTimeout(() => {
      handleLogout();
    }, 100);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="sr-only">Open menu</span>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{t('menu.title', 'Menu')}</SheetTitle>
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
          
          <PWAInstallItem />
          
          {isAdmin && <AdminLinks />}
          
          <LanguageToggle language={language} onToggle={toggleLanguage} />
          <LogoutButton onLogout={handleLogoutClick} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
