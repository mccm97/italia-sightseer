import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateRouteFormData } from '@/types/route';
import { RoutePreview } from './RoutePreview';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useDirections } from '@/hooks/useDirections';
import { CreateRouteForm } from './route/CreateRouteForm';

export function CreateRouteDialog() {
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<CreateRouteFormData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getDirections } = useDirections();

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

  const handleFormSubmit = async (data: CreateRouteFormData) => {
    try {
      // Check if user can create route
      const { data: canCreate, error: checkError } = await supabase
        .rpc('can_create_route', { user_id: user.id });

      if (checkError) {
        throw new Error('Failed to check route creation permission');
      }

      if (!canCreate) {
        toast({
          title: "Limite raggiunto",
          description: "Hai raggiunto il limite mensile di percorsi. Passa a un piano superiore per crearne altri.",
          variant: "destructive"
        });
        navigate('/upgrade');
        return;
      }

      setFormData(data);
      setShowSummary(true);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive"
      });
    }
  };

  const handleCreateRoute = async () => {
    if (!formData) return;

    try {
      console.log('Creating route with data:', formData);
      
      // Get directions for the route
      const points = formData.attractions.map(attr => {
        // Here you would need to get the lat/lng for each attraction
        // This is a placeholder - you'll need to implement geocoding
        return [0, 0] as [number, number];
      });
      
      const directions = await getDirections(points);
      
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

      // Create the route with directions
      const { data: route, error: routeError } = await supabase
        .from('routes')
        .insert({
          name: formData.name,
          city_id: formData.city?.id,
          user_id: user.id,
          transport_mode: formData.transportMode || 'walking',
          total_duration: calculateTotalDuration(),
          total_distance: 0,
          country: formData.country,
          is_public: true,
          directions: directions as unknown as Json // Type assertion to match the database schema
        })
        .select()
        .single();

      if (routeError) {
        console.error('Error creating route:', routeError);
        throw new Error('Failed to create route');
      }

      // Create attractions and link them to the route
      const attractionsPromises = formData.attractions.map(async (attr, index) => {
        const { data: attraction, error: attractionError } = await supabase
          .from('attractions')
          .insert({
            name: attr.name || attr.address,
            lat: 0,
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

        const { error: linkError } = await supabase
          .from('route_attractions')
          .insert({
            route_id: route.id,
            attraction_id: attraction.id,
            order_index: index,
            transport_mode: formData.transportMode || 'walking',
            travel_duration: 0,
            travel_distance: 0
          });

        if (linkError) {
          console.error('Error linking attraction to route:', linkError);
          throw new Error('Failed to link attraction to route');
        }
      });

      await Promise.all(attractionsPromises);

      toast({
        title: "Percorso creato con successo!",
        description: `Il percorso "${formData.name}" è stato creato.`,
      });

      // Reset and close
      setFormData(null);
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

  const calculateTotalDuration = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.visitDuration || 0), 0) || 0;
  };

  const calculateTotalPrice = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.price || 0), 0) || 0;
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
            formData={formData!}
            onBack={() => setShowPreview(false)}
            onCreateRoute={handleCreateRoute}
          />
        ) : showSummary ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-2">
                <h3 className="font-semibold text-lg">Riepilogo Percorso</h3>
                <p><strong>Nome:</strong> {formData?.name}</p>
                <p><strong>Città:</strong> {formData?.city?.name}</p>
                <p><strong>Durata Totale:</strong> {calculateTotalDuration()} minuti</p>
                <p><strong>Costo Totale:</strong> €{calculateTotalPrice().toFixed(2)}</p>
                <div className="mt-4">
                  <h4 className="font-medium">Attrazioni:</h4>
                  <ul className="list-disc pl-5 mt-2">
                    {formData?.attractions.map((attr, index) => (
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
          <CreateRouteForm
            onSubmit={handleFormSubmit}
            countries={countries}
            cities={cities}
            selectedCountry={selectedCountry}
            onCountrySelect={setSelectedCountry}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
