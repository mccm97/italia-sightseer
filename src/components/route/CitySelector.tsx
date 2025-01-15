import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import CitySearch from '../CitySearch';

interface CitySelectorProps {
  form: UseFormReturn<CreateRouteFormData>;
  cities: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    country: string;
  }>;
  selectedCountry: string;
}

export function CitySelector({ form, cities, selectedCountry }: CitySelectorProps) {
  const filteredCities = cities.filter(city => city.country === selectedCountry);

  return (
    <FormField
      control={form.control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Città</FormLabel>
          <FormControl>
            <CitySearch 
              onCitySelect={(city) => {
                field.onChange(city);
              }} 
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}