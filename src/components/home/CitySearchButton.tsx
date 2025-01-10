import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plane } from 'lucide-react';
import CitySearch from '../CitySearch';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CitySearchButtonProps {
  onCitySelect: (city: any) => void;
}

export function CitySearchButton({ onCitySelect }: CitySearchButtonProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = async () => {
    setIsAnimating(true);
    // Wait for animation to complete before navigating
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/search');
  };

  if (isSearchOpen) {
    return <CitySearch onCitySelect={(city) => {
      onCitySelect(city);
      setIsSearchOpen(false);
    }} />;
  }

  return (
    <div className="relative">
      <Button 
        onClick={handleSearchClick}
        className="w-full max-w-sm flex items-center gap-2 relative"
        variant="outline"
        disabled={isAnimating}
      >
        {!isAnimating ? (
          <>
            <Search className="w-4 h-4" />
            Cerca una città
          </>
        ) : (
          <motion.div
            initial={{ y: 0, scale: 1 }}
            animate={{ 
              y: -100,
              scale: 0,
              rotate: 45,
              transition: { 
                duration: 1,
                ease: "easeOut"
              }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Plane className="w-6 h-6 transform -rotate-45" />
          </motion.div>
        )}
      </Button>
    </div>
  );
}