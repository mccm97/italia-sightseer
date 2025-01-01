import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';

interface CitySelectorProps {
  form: UseFormReturn<CreateRouteFormData>;
  cities: any[];
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
            <Select
              value={field.value?.name || ''}
              onValueChange={(value) => {
                const selectedCity = filteredCities.find(city => city.name === value);
                field.onChange(selectedCity);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona una città" />
              </SelectTrigger>
              <SelectContent>
                {filteredCities.map((city, index) => (
                  <SelectItem key={index} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}