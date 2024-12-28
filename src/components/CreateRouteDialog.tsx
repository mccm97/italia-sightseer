import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import CitySearch from './CitySearch';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMonumentSuggestions, getAddressSuggestions } from '../services/attractions';

interface Attraction {
  name: string;
  address: string;
  inputType: 'name' | 'address';
}

interface CreateRouteFormData {
  name: string;
  attractionsCount: number;
  city: { name: string; lat: number; lng: number } | null;
  attractions: Attraction[];
}

export function CreateRouteDialog() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<number | null>(null);

  const form = useForm<CreateRouteFormData>({
    defaultValues: {
      name: '',
      attractionsCount: 1,
      city: null,
      attractions: [{ name: '', address: '', inputType: 'name' }]
    }
  });

  const attractionsCount = form.watch('attractionsCount');

  useEffect(() => {
    const currentAttractions = form.getValues('attractions');
    if (attractionsCount > currentAttractions.length) {
      form.setValue('attractions', [
        ...currentAttractions,
        ...Array(attractionsCount - currentAttractions.length).fill({ name: '', address: '', inputType: 'name' })
      ]);
    } else if (attractionsCount < currentAttractions.length) {
      form.setValue('attractions', currentAttractions.slice(0, attractionsCount));
    }
  }, [attractionsCount, form]);

  const handleInputChange = (index: number, value: string) => {
    const attraction = form.getValues(`attractions.${index}`);
    const newSuggestions = attraction.inputType === 'name' 
      ? getMonumentSuggestions(value)
      : getAddressSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(index);
  };

  const onSubmit = (data: CreateRouteFormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crea Nuovo Percorso</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Città</FormLabel>
                  <FormControl>
                    <CitySearch onCitySelect={(city) => field.onChange(city)} />
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

            {form.watch('attractions')?.map((attraction, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg relative">
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
                    name={attraction.inputType === 'name' ? `attractions.${index}.name` : `attractions.${index}.address`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {attraction.inputType === 'name' ? 'Nome Monumento' : 'Indirizzo'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={attraction.inputType === 'name' 
                              ? "Inserisci il nome del monumento"
                              : "Inserisci l'indirizzo esatto"
                            }
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleInputChange(index, e.target.value);
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
                              const fieldName = attraction.inputType === 'name' 
                                ? `attractions.${index}.name` 
                                : `attractions.${index}.address`;
                              form.setValue(fieldName, suggestion);
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
            ))}

            <div className="flex justify-end">
              <Button type="submit">Crea Percorso</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}