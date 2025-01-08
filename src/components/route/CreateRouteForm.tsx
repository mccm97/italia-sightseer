import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { AttractionInput } from '../AttractionInput';
import { CountrySelector } from './CountrySelector';
import { CitySelector } from './CitySelector';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { ImageUpload } from '../ImageUpload';
import { Textarea } from '@/components/ui/textarea';

interface CreateRouteFormProps {
  onSubmit: (data: CreateRouteFormData) => void;
  countries: string[];
  cities: any[];
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
}

export function CreateRouteForm({
  onSubmit,
  countries,
  cities,
  selectedCountry,
  onCountrySelect,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  placeholder="Descrivi il tuo percorso... Cosa lo rende speciale? Quali esperienze offre?"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
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