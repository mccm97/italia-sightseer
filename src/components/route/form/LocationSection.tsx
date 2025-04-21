
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CountrySelector } from '../CountrySelector';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  // Get all unique countries
  const countries = Array.from(new Set(cities.map(city => city.country).filter(Boolean)));
  
  // Filter cities by selected country
  const filteredCities = selectedCountry 
    ? cities.filter(city => city.country === selectedCountry)
    : [];
  
  console.log('LocationSection - filtered cities:', filteredCities);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('routes.location.title')}</h3>
      
      <CountrySelector 
        form={form}
        countries={countries}
        onCountrySelect={onCountrySelect}
      />
      
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('routes.location.city')}</FormLabel>
            <FormControl>
              <Select
                value={field.value ? JSON.stringify(field.value) : ''}
                onValueChange={(value) => {
                  if (value) {
                    const city = JSON.parse(value);
                    form.setValue('city', city);
                  } else {
                    form.setValue('city', null);
                  }
                }}
                disabled={!selectedCountry}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    selectedCountry 
                      ? t('routes.location.selectCity') 
                      : t('routes.location.selectCountryFirst')
                  } />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {filteredCities.map(city => (
                      <SelectItem 
                        key={city.id} 
                        value={JSON.stringify({
                          id: city.id,
                          name: city.name,
                          lat: city.lat,
                          lng: city.lng,
                          country: city.country
                        })}
                      >
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
    </div>
  );
}
