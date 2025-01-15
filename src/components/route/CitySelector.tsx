import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

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
            <Select
              disabled={!selectedCountry}
              value={field.value?.id || ''}
              onValueChange={(value) => {
                const selectedCity = filteredCities.find(city => city.id === value);
                if (selectedCity) {
                  field.onChange(selectedCity);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona una città" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {filteredCities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}