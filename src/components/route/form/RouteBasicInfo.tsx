import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { ImageUpload } from '@/components/ImageUpload';

interface RouteBasicInfoProps {
  form: UseFormReturn<CreateRouteFormData>;
}

export function RouteBasicInfo({ form }: RouteBasicInfoProps) {
  const handleImageUploaded = (url: string) => {
    form.setValue('image_url', url);
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
}