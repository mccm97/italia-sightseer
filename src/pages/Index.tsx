import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import CitySearch from '@/components/CitySearch';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/auth/AuthButton';
import CityMap from '@/components/CityMap';

export default function Index() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [showRoutePreview, setShowRoutePreview] = useState(false);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedCity) return;

    const fetchCityRoutes = async () => {
      setIsLoadingRoutes(true);
      try {
        const { data: routes, error } = await supabase
          .from('routes')
          .select('*')
          .eq('city_id', selectedCity.id);

        if (error) throw error;

        setSelectedRoutes(routes);
      } catch (error) {
        console.error('Error fetching city routes:', error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento dei percorsi",
          variant: "destructive"
        });
      } finally {
        setIsLoadingRoutes(false);
      }
    };

    fetchCityRoutes();
  }, [selectedCity, toast]);

  const handleBackClick = () => {
    setSelectedCity(null);
    setSelectedRoutes([]);
  };

  const handleRouteClick = (route) => {
    setSelectedRoutes(route);
    setShowRoutePreview(true);
  };

  const handleCreateRouteClick = () => {
    // Logic to handle route creation
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <AuthButton />
      {!selectedCity ? (
        <div className="max-w-4xl mx-auto space-y-8 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Italia Sightseer</h1>
            <p className="text-xl text-muted-foreground">
              Pianifica i tuoi itinerari culturali in Italia con facilità
            </p>
          </div>
          
          <div className="aspect-video relative rounded-xl overflow-hidden shadow-xl">
            <img 
              src="/lovable-uploads/172840ab-5378-44c5-941a-9be547232b05.png" 
              alt="Vista panoramica di Barcellona" 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Esplora le Città Italiane</h2>
              <p className="text-lg">Crea percorsi personalizzati e scopri i monumenti più belli</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 space-y-2">
              <h3 className="font-semibold text-lg">Pianifica Percorsi</h3>
              <p className="text-muted-foreground">Crea itinerari personalizzati per le tue visite culturali</p>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-semibold text-lg">Calcola Tempi e Costi</h3>
              <p className="text-muted-foreground">Gestisci durata e budget del tuo itinerario</p>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-semibold text-lg">Esplora le Città</h3>
              <p className="text-muted-foreground">Scopri i migliori percorsi nelle città italiane</p>
            </div>
          </div>

          <div className="max-w-xl mx-auto">
            <CitySearch onCitySelect={setSelectedCity} />
          </div>
        </div>
      ) : (
        <>
          <div className="w-full flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={handleBackClick}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Indietro
            </Button>
            <h1 className="text-3xl font-bold">{selectedCity.name}</h1>
            <div className="w-[100px]" />
          </div>
          <CityMap center={selectedCity.center} attractions={selectedCity.attractions} />
          <div className="mt-4">
            {isLoadingRoutes ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                {selectedRoutes.length > 0 ? (
                  <div className="space-y-4">
                    {selectedRoutes.map((route) => (
                      <div key={route.id} className="p-4 border rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">{route.name}</h2>
                        <p>{route.description}</p>
                        <Button variant="link" onClick={() => handleRouteClick(route)}>
                          Visualizza dettagli
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nessun percorso trovato per questa città.</p>
                )}
                <Button variant="primary" onClick={handleCreateRouteClick}>
                  Crea un nuovo percorso
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
