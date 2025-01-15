import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';

interface CountrySelectorProps {
  form: UseFormReturn<CreateRouteFormData>;
  countries: string[];
  onCountrySelect: (country: string) => void;
}

export function CountrySelector({ form, countries, onCountrySelect }: CountrySelectorProps) {
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
                field.onChange(value);
                onCountrySelect(value);
              }}
            >
              <SelectTrigger>
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
          </FormControl>
        </FormItem>
      )}
    />
  );
}