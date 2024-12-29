import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';

interface AttractionInputProps {
  index: number;
  form: UseFormReturn<CreateRouteFormData>;
  suggestions: string[];
  showSuggestions: number | null;
  onInputChange: (index: number, value: string) => void;
  setShowSuggestions: (index: number | null) => void;
}

export function AttractionInput({
  index,
  form,
  suggestions,
  showSuggestions,
  onInputChange,
  setShowSuggestions
}: AttractionInputProps) {
  const attraction = form.watch(`attractions.${index}`);

  return (
    <div className="space-y-4 p-4 border rounded-lg relative">
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
                <Input 
                  placeholder={attraction?.inputType === 'name' 
                    ? "Inserisci il nome del monumento"
                    : "Inserisci l'indirizzo esatto"
                  }
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    onInputChange(index, e.target.value);
                  }}
                  onFocus={() => setShowSuggestions(index)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {showSuggestions === index && suggestions.length > 0 && (
          <ScrollArea className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60">
            <div className="p-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
                  onClick={() => {
                    const fieldName = attraction?.inputType === 'name' 
                      ? `attractions.${index}.name` 
                      : `attractions.${index}.address`;
                    form.setValue(fieldName as any, suggestion);
                    setShowSuggestions(null);
                  }}
                  type="button"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}