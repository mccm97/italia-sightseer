import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { CountrySelector } from '../CountrySelector';
import { CitySelector } from '../CitySelector';

interface LocationSectionProps {
  form: UseFormReturn<CreateRouteFormData>;
  cities: any[];
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
}

export function LocationSection({ 
  form, 
  cities, 
  selectedCountry, 
  onCountrySelect 
}: LocationSectionProps) {
  return (
    <div className="space-y-4">
      <CountrySelector 
        form={form}
        countries={cities.map(city => city.country).filter(Boolean)}
        onCountrySelect={onCountrySelect}
      />
      
      <CitySelector 
        form={form}
        cities={cities}
        selectedCountry={selectedCountry}
      />
    </div>
  );
}