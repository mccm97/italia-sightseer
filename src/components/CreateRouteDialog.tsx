import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { AttractionInput } from './AttractionInput';
import { CreateRouteFormData } from '@/types/route';
import { RoutePreview } from './RoutePreview';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CountrySelector } from './route/CountrySelector';
import { CitySelector } from './route/CitySelector';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export function CreateRouteDialog() {
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase.from('cities').select('*');
      if (error) {
        console.error('Error fetching cities:', error);
        toast({
          title: "Error",
          description: "Failed to load cities. Please try again.",
          variant: "destructive"
        });
      } else {
        setCities(data);
        const uniqueCountries = [...new Set(data.map(city => city.country))];
        setCountries(uniqueCountries);
      }
    };
    fetchCities();
  }, [toast]);

  const form = useForm<CreateRouteFormData>({
    defaultValues: {
      name: '',
      attractionsCount: 1,
      city: null,
      country: '',
      attractions: [{ name: '', address: '', inputType: 'name', visitDuration: 0, price: 0 }]
    }
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !user) {
      toast({
        title: "Accesso richiesto",
        description: "Devi essere autenticato per creare un percorso",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setOpen(newOpen);
  };

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

  const handleCreateRoute = async () => {
    if (!isFormValid()) return;

    try {
      console.log('Creating route with data:', form.getValues());
      
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per creare un percorso.",
          variant: "destructive"
        });
        return;
      }

      // First, create the route
      const { data: route, error: routeError } = await supabase
        .from('routes')
        .insert({
          name: form.getValues().name,
          city_id: form.getValues().city?.id,
          user_id: user.id,
          transport_mode: form.getValues().transportMode || 'walking',
          total_duration: calculateTotalDuration(),
          total_distance: 0, // This would need to be calculated based on the actual route
          country: form.getValues().country,
          is_public: true
        })
        .select()
        .single();

      if (routeError) {
        console.error('Error creating route:', routeError);
        throw new Error('Failed to create route');
      }

      // Then, create attractions and link them to the route
      const attractionsPromises = form.getValues().attractions.map(async (attr, index) => {
        // First create the attraction
        const { data: attraction, error: attractionError } = await supabase
          .from('attractions')
          .insert({
            name: attr.name || attr.address,
            lat: 0, // These would need to be set based on geocoding
            lng: 0,
            visit_duration: attr.visitDuration,
            price: attr.price
          })
          .select()
          .single();

        if (attractionError) {
          console.error('Error creating attraction:', attractionError);
          throw new Error('Failed to create attraction');
        }

        // Then create the route_attraction link
        const { error: linkError } = await supabase
          .from('route_attractions')
          .insert({
            route_id: route.id,
            attraction_id: attraction.id,
            order_index: index,
            transport_mode: form.getValues().transportMode || 'walking',
            travel_duration: 0, // This would need to be calculated
            travel_distance: 0 // This would need to be calculated
          });

        if (linkError) {
          console.error('Error linking attraction to route:', linkError);
          throw new Error('Failed to link attraction to route');
        }
      });

      await Promise.all(attractionsPromises);

      toast({
        title: "Percorso creato con successo!",
        description: `Il percorso "${form.getValues().name}" è stato creato.`,
      });

      // Reset form and close dialog
      form.reset();
      setOpen(false);
      setShowPreview(false);
      setShowSummary(false);
      
    } catch (error) {
      console.error('Error in route creation:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del percorso.",
        variant: "destructive"
      });
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            onCreateRoute={handleCreateRoute}
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
              <CountrySelector 
                form={form}
                countries={countries}
                onCountrySelect={setSelectedCountry}
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
