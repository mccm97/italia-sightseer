import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import CitySearch from './CitySearch';

interface Attraction {
  name: string;
  address: string;
}

interface CreateRouteFormData {
  name: string;
  attractionsCount: number;
  city: { name: string; lat: number; lng: number } | null;
  attractions: Attraction[];
}

export function CreateRouteDialog() {
  const form = useForm<CreateRouteFormData>({
    defaultValues: {
      name: '',
      attractionsCount: 1,
      city: null,
      attractions: [{ name: '', address: '' }]
    }
  });

  const attractionsCount = form.watch('attractionsCount');

  useEffect(() => {
    const currentAttractions = form.getValues('attractions');
    if (attractionsCount > currentAttractions.length) {
      // Aggiungi nuovi campi
      form.setValue('attractions', [
        ...currentAttractions,
        ...Array(attractionsCount - currentAttractions.length).fill({ name: '', address: '' })
      ]);
    } else if (attractionsCount < currentAttractions.length) {
      // Rimuovi campi in eccesso
      form.setValue('attractions', currentAttractions.slice(0, attractionsCount));
    }
  }, [attractionsCount, form]);

  const onSubmit = (data: CreateRouteFormData) => {
    console.log('Form submitted:', data);
    // TODO: Implementare la creazione effettiva del percorso
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0"
        >
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
                    <CitySearch 
                      onCitySelect={(city) => field.onChange(city)} 
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
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <FormField
                  control={form.control}
                  name={`attractions.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Attrazione {index + 1}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Inserisci il nome dell'attrazione"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`attractions.${index}.address`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indirizzo Attrazione {index + 1}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Inserisci l'indirizzo dell'attrazione"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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