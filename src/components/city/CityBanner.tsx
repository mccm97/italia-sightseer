import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CityBannerProps {
  city: {
    id?: string;
    name: string;
    country?: string;
  };
  onBackClick: () => void;
}

export function CityBanner({ city, onBackClick }: CityBannerProps) {
  const { data: cityImage, isError } = useQuery({
    queryKey: ['cityImage', city.id],
    queryFn: async () => {
      if (!city.id) return null;
      
      console.log('Fetching image for city:', city.id);
      
      try {
        const { data, error } = await supabase
          .from('city_images')
          .select('image_url')
          .eq('city_id', city.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching city image:', error);
          return null;
        }
        
        console.log('City image query result:', data);
        return data?.image_url;
      } catch (error) {
        console.error('Failed to fetch city image:', error);
        return null;
      }
    },
    retry: false // Don't retry on failure
  });

  const fallbackImage = "/lovable-uploads/fe6abce4-c0cb-4aac-bab4-f583bb0cd471.png";
  const imageUrl = cityImage || fallbackImage;

  return (
    <div className="relative w-full h-[300px] rounded-xl overflow-hidden mb-8">
      <img 
        src={imageUrl}
        alt={`${city.name} banner`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40">
        <div className="h-full container mx-auto px-4 flex flex-col justify-between py-6">
          <Button 
            variant="ghost" 
            onClick={onBackClick}
            className="flex items-center gap-2 text-white w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Indietro
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{city.name}</h1>
            {city.country && (
              <p className="text-xl text-white/80">{city.country}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}