import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MainMenu } from '@/components/MainMenu';
import { Header } from '@/components/layout/Header';
import { useNavigate } from 'react-router-dom';

interface SearchHeaderProps {
  user: any;
}

export function SearchHeader({ user }: SearchHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <MainMenu />
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Indietro
        </Button>
      </div>
      <Header user={user} />
    </>
  );
}