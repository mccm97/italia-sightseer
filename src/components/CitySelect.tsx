import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { City } from '@/types/route';

interface CitySelectProps {
  cities: any[];
  country: string;
  onCitySelect: (city: City) => void;
}

const CitySelect = ({ cities, country, onCitySelect }: CitySelectProps) => {
  const filteredCities = cities.filter(city => city.country === country);

  return (
    <Select onValueChange={(value) => {
      const selectedCity = filteredCities.find(city => city.name === value);
      if (selectedCity) {
        onCitySelect(selectedCity);
      }
    }}>
      <SelectTrigger>
        <SelectValue placeholder="Seleziona una città" />
      </SelectTrigger>
      <SelectContent>
        {filteredCities.map((city) => (
          <SelectItem key={city.id} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CitySelect;