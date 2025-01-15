import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { AttractionInput } from '../AttractionInput';
import { CountrySelector } from './CountrySelector';
import { CitySelector } from './CitySelector';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ImageUpload } from '../ImageUpload';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface CreateRouteFormProps {
  onSubmit: (data: CreateRouteFormData) => void;
  cities: any[];
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
  onSuccess?: () => void;
}

export function CreateRouteForm({
  onSubmit,
  cities,
  selectedCountry,
  onCountrySelect,
  onSuccess,
}: CreateRouteFormProps) {
  const form = useForm<CreateRouteFormData>({
    defaultValues: {
      name: '',
      attractionsCount: 1,
      city: null,
      country: '',
      attractions: [{ name: '', address: '', inputType: 'name', visitDuration: 0, price: 0 }],
      image_url: '',
      description: '',
    }
  });

  const { toast } = useToast();

  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      console.log('Fetching countries from Supabase');
      const { data, error } = await supabase
        .from('cities')
        .select('country')
        .not('country', 'is', null)
        .order('country');

      if (error) {
        console.error('Error fetching countries:', error);
        throw error;
      }

      const uniqueCountries = [...new Set(data.map(city => city.country))].filter(Boolean);
      console.log('Fetched countries:', uniqueCountries);
      return uniqueCountries;
    }
  });

  const attractionsCount = form.watch('attractionsCount');

  useEffect(() => {
    const currentAttractions = form.getValues('attractions');
    const updatedAttractions = Array(attractionsCount)
      .fill({ name: '', address: '', inputType: 'name', visitDuration: 0, price: 0 })
      .map((attr, index) => currentAttractions[index] || attr);
    form.setValue('attractions', updatedAttractions);
  }, [attractionsCount, form]);

  const handleImageUploaded = (url: string) => {
    form.setValue('image_url', url);
  };

  const handleSubmit = async (data: CreateRouteFormData) => {
    console.log('Form submission data:', data);
    
    // Validate required fields
    if (!data.city) {
      toast({
        title: "Errore",
        description: "Seleziona una città",
        variant: "destructive"
      });
      return;
    }

    if (!data.name) {
      toast({
        title: "Errore",
        description: "Inserisci un nome per il percorso",
        variant: "destructive"
      });
      return;
    }

    if (!data.attractions.length || !data.attractions[0].name) {
      toast({
        title: "Errore",
        description: "Inserisci almeno un'attrazione",
        variant: "destructive"
      });
      return;
    }

    // If all validations pass, proceed with submission
    await onSubmit(data);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <CountrySelector 
          form={form}
          countries={countries}
          onCountrySelect={onCountrySelect}
        />
        
        <CitySelector 
          form={form}
          cities={cities}
          selectedCountry={selectedCountry}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione del Percorso</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrivi il tuo percorso... Cosa rende speciale questa esperienza? Quali emozioni può suscitare?" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Una buona descrizione può attirare più visitatori! Racconta cosa rende unico questo percorso e perché gli altri dovrebbero provarlo.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immagine del Percorso</FormLabel>
              <FormControl>
                <ImageUpload
                  bucketName="route-images"
                  onImageUploaded={handleImageUploaded}
                  currentImage={field.value}
                />
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
          <Button type="submit">
            Continua
          </Button>
        </div>
      </form>
    </Form>
  );
}