import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { AttractionSelect } from './AttractionSelect';
import { Input } from '@/components/ui/input';

interface AttractionInputProps {
  index: number;
  form: UseFormReturn<CreateRouteFormData>;
}

export function AttractionInput({
  index,
  form,
}: AttractionInputProps) {
  const attraction = form.watch(`attractions.${index}`);
  const selectedCity = form.watch('city');

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <FormField
        control={form.control}
        name={`attractions.${index}.inputType`}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Tipo di Input per Attrazione {index + 1}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="name" id={`name-${index}`} />
                  <FormLabel htmlFor={`name-${index}`}>Nome Monumento</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="address" id={`address-${index}`} />
                  <FormLabel htmlFor={`address-${index}`}>Indirizzo Esatto</FormLabel>
                </div>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`attractions.${index}.${attraction?.inputType === 'name' ? 'name' : 'address'}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {attraction?.inputType === 'name' ? 'Nome Monumento' : 'Indirizzo'}
              </FormLabel>
              <FormControl>
                <AttractionSelect
                  value={field.value}
                  onChange={field.onChange}
                  inputType={attraction?.inputType || 'name'}
                  cityId={selectedCity?.id}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`attractions.${index}.visitDuration`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durata Visita (minuti)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="Inserisci la durata della visita"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`attractions.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prezzo Ingresso (€)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Inserisci il prezzo del biglietto"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}