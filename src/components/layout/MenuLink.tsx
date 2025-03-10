import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface MenuLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export const MenuLink = ({ to, children, className }: MenuLinkProps) => {
  const { t } = useTranslation();
  
  return (
    <Link
      to={to}
      className={cn(
        "text-lg hover:text-primary transition-colors",
        className
      )}
    >
      {children}
    </Link>
  );
};