import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, Form } from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';
import CitySelect from '@/components/CitySelect';
import CountrySelect from '@/components/CountrySelect';
import { AttractionSelect } from '@/components/AttractionSelect';
import RoutePreview from '@/components/RoutePreview';
import { CreateRouteFormData } from '@/types/route';

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
      attractions: [{ name: '', address: '', inputType: 'name', visitDuration: 0, price: 0 }],
      transportMode: 'walking'
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
      const formData = form.getValues();
      const routeData = {
        name: formData.name,
        city_id: formData.city?.id,
        user_id: user.id,
        country: formData.country,
        transport_mode: formData.transportMode || 'walking',
        total_duration: formData.attractions.reduce((sum, attr) => sum + (attr.visitDuration || 0), 0),
        total_distance: 0, // This will be calculated based on the actual route
        is_public: false
      };

      const { data, error } = await supabase
        .from('routes')
        .insert([routeData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        toast({
          title: "Percorso creato",
          description: "Il tuo percorso è stato creato con successo",
          variant: "default"
        });

        setOpen(false);
        navigate(`/routes/${data.id}`);
      }
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
    return values.name.trim() !== '' && values.city && values.attractions.every(attr => 
      attr.name.trim() !== '' || attr.address.trim() !== ''
    );
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleShowPreview)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome del Percorso</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paese</FormLabel>
                      <FormControl>
                        <CountrySelect 
                          countries={countries} 
                          onCountrySelect={(country) => {
                            field.onChange(country);
                            setSelectedCountry(country);
                          }} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Città</FormLabel>
                      <FormControl>
                        <CitySelect 
                          cities={cities} 
                          country={selectedCountry}
                          onCitySelect={(city) => field.onChange(city)} 
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
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {attractions.map((attraction, index) => (
                  <div key={index} className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`attractions.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Attrazione</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`attractions.${index}.address`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indirizzo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`attractions.${index}.visitDuration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durata Visita (minuti)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`attractions.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prezzo (€)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
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
            </Form>

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