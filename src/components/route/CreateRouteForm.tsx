import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LocationSection } from './form/LocationSection';
import { RouteBasicInfo } from './form/RouteBasicInfo';
import { AttractionsSection } from './form/AttractionsSection';

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
      attractions: [{ 
        name: '', 
        address: '', 
        inputType: 'name' as const, 
        visitDuration: 0, 
        price: 0 
      }],
      image_url: '',
      description: '',
    }
  });

  const { toast } = useToast();

  const handleSubmit = async (data: CreateRouteFormData) => {
    console.log('Form submission data:', data);
    
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

    try {
      await onSubmit(data);
      console.log('Form submitted successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del percorso",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <LocationSection 
          form={form}
          cities={cities}
          selectedCountry={selectedCountry}
          onCountrySelect={onCountrySelect}
        />
        
        <RouteBasicInfo form={form} />
        
        <AttractionsSection form={form} />

        <div className="flex justify-end">
          <Button type="submit">
            Continua
          </Button>
        </div>
      </form>
    </Form>
  );
}