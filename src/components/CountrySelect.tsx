import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountrySelectProps {
  countries: string[];
  onCountrySelect: (country: string) => void;
}

const CountrySelect = ({ countries, onCountrySelect }: CountrySelectProps) => {
  return (
    <Select onValueChange={onCountrySelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleziona un paese" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country, index) => (
          <SelectItem key={index} value={country}>
            {country}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;