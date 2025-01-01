import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import CitySearch from './CitySearch';
import { AttractionInput } from './AttractionInput';
import { CreateRouteFormData } from '@/types/route';
import { RoutePreview } from './RoutePreview';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';
import { supabase } from '@/integrations/supabase/client';

export function CreateRouteDialog() {
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('cities').select('*');
        
        if (error) {
          console.error('Error fetching cities:', error);
          toast({
            title: "Errore",
            description: "Impossibile caricare le città. Riprova più tardi.",
            variant: "destructive",
          });
        } else {
          console.log('Cities fetched:', data); // Debug log
          setCities(data || []);
        }
      } catch (err) {
        console.error('Error in fetchCities:', err);
        toast({
          title: "Errore",
          description: "Si è verificato un errore nel caricamento delle città.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchCities();
    }
  }, [open, toast]);

  const form = useForm<CreateRouteFormData>({
    defaultValues: {
      name: '',
      attractionsCount: 1,
      city: null,
      attractions: [{ name: '', address: '', inputType: 'name', visitDuration: 0, price: 0 }]
    }
  });

  const attractionsCount = form.watch('attractionsCount');
  const attractions = form.watch('attractions');

  useEffect(() => {
    const currentAttractions = form.getValues('attractions');
    if (attractionsCount > currentAttractions.length) {
      form.setValue('attractions', [
        ...currentAttractions,
        ...Array(attractionsCount - currentAttractions.length).fill({ 
          name: '', 
          address: '', 
          inputType: 'name',
          visitDuration: 0,
          price: 0
        })
      ]);
    } else if (attractionsCount < currentAttractions.length) {
      form.setValue('attractions', currentAttractions.slice(0, attractionsCount));
    }
  }, [attractionsCount, form]);

  const handleShowPreview = () => {
    if (isFormValid()) {
      setShowSummary(true);
    }
  };

  const handleBackFromPreview = () => {
    setShowPreview(false);
  };

  const handleCreateRoute = () => {
    if (isFormValid()) {
      console.log('Route created:', form.getValues());
      toast({
        title: "Percorso creato con successo!",
        description: `Il percorso "${form.getValues().name}" è stato creato.`,
      });
      setOpen(false);
      form.reset();
    }
  };

  const isFormValid = () => {
    const values = form.getValues();
    return values.city && 
           values.name && 
           values.attractions.every(a => (a.name || a.address) && a.visitDuration > 0);
  };

  const calculateTotalDuration = () => {
    return attractions.reduce((total, attr) => total + (attr.visitDuration || 0), 0);
  };

  const calculateTotalPrice = () => {
    return attractions.reduce((total, attr) => total + (attr.price || 0), 0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crea Nuovo Percorso</DialogTitle>
        </DialogHeader>
        
        {showPreview ? (
          <RoutePreview
            formData={form.getValues()}
            onBack={handleBackFromPreview}
          />
        ) : showSummary ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-2">
                <h3 className="font-semibold text-lg">Riepilogo Percorso</h3>
                <p><strong>Nome:</strong> {form.getValues().name}</p>
                <p><strong>Città:</strong> {form.getValues().city?.name}</p>
                <p><strong>Durata Totale:</strong> {calculateTotalDuration()} minuti</p>
                <p><strong>Costo Totale:</strong> €{calculateTotalPrice().toFixed(2)}</p>
                <div className="mt-4">
                  <h4 className="font-medium">Attrazioni:</h4>
                  <ul className="list-disc pl-5 mt-2">
                    {attractions.map((attr, index) => (
                      <li key={index}>
                        {attr.name || attr.address} - {attr.visitDuration} min, €{attr.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowSummary(false)}
              >
                Modifica
              </Button>
              <Button 
                onClick={() => setShowPreview(true)}
              >
                Visualizza su Mappa
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Città</FormLabel>
                    <FormControl>
                      <CitySearch 
                        cities={cities} 
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
                <AttractionInput
                  key={index}
                  index={index}
                  form={form}
                />
              ))}

              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={handleShowPreview}
                  disabled={!isFormValid()}
                >
                  Continua
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}