import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { AttractionSelect } from './AttractionSelect';

interface AttractionInputProps {
  index: number;
  form: UseFormReturn<CreateRouteFormData>;
}

export function AttractionInput({
  index,
  form,
}: AttractionInputProps) {
  const attraction = form.watch(`attractions.${index}`);

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

      <div className="relative">
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
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}