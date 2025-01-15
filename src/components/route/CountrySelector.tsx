import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { useEffect } from 'react';

interface CountrySelectorProps {
  form: UseFormReturn<CreateRouteFormData>;
  countries: string[];
  onCountrySelect: (country: string) => void;
}

export function CountrySelector({ form, countries, onCountrySelect }: CountrySelectorProps) {
  useEffect(() => {
    console.log('Countries available:', countries); // Debug log
  }, [countries]);

  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Paese</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                console.log('Country selected:', value); // Debug log
                field.onChange(value);
                onCountrySelect(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un paese" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(countries) && countries.length > 0 ? (
                  countries.map((country, index) => (
                    <SelectItem key={index} value={country}>
                      {country}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Nessun paese disponibile
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}