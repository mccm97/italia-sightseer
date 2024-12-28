import React, { useState } from 'react';
import CitySearch from '@/components/CitySearch';
import CityMap from '@/components/CityMap';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold">Tour Planner Italia</h1>
        <CitySearch onCitySelect={setSelectedCity} />
      </div>

      {selectedCity && (
        <div className="rounded-lg overflow-hidden shadow-lg">
          <CityMap center={[selectedCity.lat, selectedCity.lng]} />
        </div>
      )}

      <Button
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0"
        onClick={() => {
          console.log('Create new route');
          // TODO: Implement route creation
        }}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Index;