import { useTranslation } from 'react-i18next';
import { BarChart } from 'lucide-react';
import { MenuLink } from './MenuLink';

export const AdminLinks = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <MenuLink to="/admin">
        {t('menu.administration')}
      </MenuLink>
      <MenuLink to="/statistics">
        <div className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          {t('menu.statistics')}
        </div>
      </MenuLink>
    </>
  );
};