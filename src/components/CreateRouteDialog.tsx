import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import CitySearch from './CitySearch';

interface CreateRouteFormData {
  name: string;
  attractionsCount: number;
}

export function CreateRouteDialog() {
  const form = useForm<CreateRouteFormData>();

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crea Nuovo Percorso</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex justify-end">
              <Button type="submit">Crea Percorso</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}