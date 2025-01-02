import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';
import CitySelect from '@/components/CitySelect';
import CountrySelect from '@/components/CountrySelect';
import AttractionSelect from '@/components/AttractionSelect';

interface CreateRouteFormData {
  name: string;
  attractionsCount: number;
  city: { id: string; name: string; lat: number; lng: number } | null;
  country: string;
  attractions: Array<{
    name: string;
    address: string;
    inputType: 'name' | 'address';
    visitDuration: number;
    price: number;
  }>;
}

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

      const { data, error } = await supabase
        .from('routes')
        .insert([{
          ...form.getValues(),
          user_id: user.id
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Percorso creato",
        description: "Il tuo percorso è stato creato con successo",
        variant: "success"
      });

      setOpen(false);
      navigate(`/routes/${data[0].id}`);
    } catch (error) {
      console.error('Error creating route:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del percorso",
        variant: "destructive"
      });
    }
  };

  const isFormValid = () => {
    const values = form.getValues();
    return values.name.trim() !== '' && values.city && values.attractions.every(attr => attr.name.trim() !== '' && attr.address.trim() !== '');
  };

  return (
    <>
      <Button onClick={() => handleOpenChange(true)}>
        Crea Percorso
      </Button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Crea Nuovo Percorso</h2>
            <form onSubmit={form.handleSubmit(handleShowPreview)}>
              <FormField name="name">
                <FormItem>
                  <FormLabel>Nome del Percorso</FormLabel>
                  <FormControl>
                    <Input {...form.register('name')} />
                  </FormControl>
                </FormItem>
              </FormField>

              <FormField name="country">
                <FormItem>
                  <FormLabel>Paese</FormLabel>
                  <FormControl>
                    <CountrySelect countries={countries} onCountrySelect={setSelectedCountry} />
                  </FormControl>
                </FormItem>
              </FormField>

              <FormField name="city">
                <FormItem>
                  <FormLabel>Città</FormLabel>
                  <FormControl>
                    <CitySelect country={selectedCountry} cities={cities} onCitySelect={(city) => form.setValue('city', city)} />
                  </FormControl>
                </FormItem>
              </FormField>

              <FormField name="attractionsCount">
                <FormItem>
                  <FormLabel>Numero di Attrazioni</FormLabel>
                  <FormControl>
                    <Input type="number" {...form.register('attractionsCount')} />
                  </FormControl>
                </FormItem>
              </FormField>

              {attractions.map((attraction, index) => (
                <div key={index} className="space-y-2">
                  <FormField name={`attractions.${index}.name`}>
                    <FormItem>
                      <FormLabel>Nome Attrazione</FormLabel>
                      <FormControl>
                        <Input {...form.register(`attractions.${index}.name`)} />
                      </FormControl>
                    </FormItem>
                  </FormField>

                  <FormField name={`attractions.${index}.address`}>
                    <FormItem>
                      <FormLabel>Indirizzo</FormLabel>
                      <FormControl>
                        <Input {...form.register(`attractions.${index}.address`)} />
                      </FormControl>
                    </FormItem>
                  </FormField>

                  <FormField name={`attractions.${index}.visitDuration`}>
                    <FormItem>
                      <FormLabel>Durata Visita (minuti)</FormLabel>
                      <FormControl>
                        <Input type="number" {...form.register(`attractions.${index}.visitDuration`)} />
                      </FormControl>
                    </FormItem>
                  </FormField>

                  <FormField name={`attractions.${index}.price`}>
                    <FormItem>
                      <FormLabel>Prezzo (€)</FormLabel>
                      <FormControl>
                        <Input type="number" {...form.register(`attractions.${index}.price`)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
              ))}

              <div className="flex items-center justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Annulla
                </Button>
                <Button type="submit">
                  Anteprima
                </Button>
              </div>
            </form>

            {showSummary && (
              <RoutePreview
                formData={form.getValues()}
                onBack={handleBackFromPreview}
                onCreateRoute={handleCreateRoute}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
