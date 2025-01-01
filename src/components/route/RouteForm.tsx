import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { AttractionInput } from '../AttractionInput';
import CountrySelect from '../CountrySelect';
import CitySearch from '../CitySearch';

interface RouteFormProps {
  form: UseFormReturn<CreateRouteFormData>;
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;
  onShowSummary: () => void;
}

export function RouteForm({ form, selectedCountry, setSelectedCountry, onShowSummary }: RouteFormProps) {
  const navigate = useNavigate();

  const isFormValid = () => {
    const values = form.getValues();
    return values.city && 
           values.name && 
           values.attractions.every(a => (a.name || a.address) && a.visitDuration > 0);
  };

  const handleCountrySelect = (country: string | null) => {
    setSelectedCountry(country);
    form.setValue('country', country);
    form.setValue('city', null);
    navigate('/route'); // Naviga alla pagina di creazione del percorso
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazione</FormLabel>
              <FormControl>
                <CountrySelect 
                  onCountrySelect={handleCountrySelect} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Città</FormLabel>
              <FormControl>
                <CitySearch 
                  onCitySelect={(city) => field.onChange(city)} 
                  selectedCountry={selectedCountry}
                  disabled={!selectedCountry}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome del Percorso</FormLabel>
              <FormControl>
                <Input placeholder="Inserisci il nome del percorso" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attractionsCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numero di Attrazioni</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  placeholder="Inserisci il numero di attrazioni"
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch('attractions')?.map((_, index) => (
          <AttractionInput
            key={index}
            index={index}
            form={form}
          />
        ))}

        <div className="flex justify-end">
          <Button 
            type="button" 
            onClick={onShowSummary}
            disabled={!isFormValid()}
          >
            Continua
          </Button>
        </div>
      </form>
    </Form>
  );
}
