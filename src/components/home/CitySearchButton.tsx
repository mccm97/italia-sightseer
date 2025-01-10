import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import CitySearch from '../CitySearch';

interface CitySearchButtonProps {
  onCitySelect: (city: any) => void;
}

export function CitySearchButton({ onCitySelect }: CitySearchButtonProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (isSearchOpen) {
    return <CitySearch onCitySelect={(city) => {
      onCitySelect(city);
      setIsSearchOpen(false);
    }} />;
  }

  return (
    <Button 
      onClick={() => setIsSearchOpen(true)}
      className="w-full max-w-sm flex items-center gap-2"
      variant="outline"
    >
      <Search className="w-4 h-4" />
      Cerca una città
    </Button>
  );
}