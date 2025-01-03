import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateRouteFormData } from '@/types/route';
import { RoutePreview } from './RoutePreview';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { CreateRouteForm } from './route/CreateRouteForm';
import { RouteCreationSummary } from './route/RouteCreationSummary';
import { useRouteCreation } from '@/hooks/useRouteCreation';

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
  const { 
    formData,
    setFormData,
    handleFormSubmit,
    createRoute,
    calculateTotalDuration,
    calculateTotalPrice
  } = useRouteCreation();

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

  const onFormSubmit = async (data: CreateRouteFormData) => {
    if (!user) return;
    const success = await handleFormSubmit(data, user.id);
    if (success) {
      setShowSummary(true);
    }
  };

  const handleCreateRoute = async () => {
    const success = await createRoute();
    if (success) {
      setFormData(null);
      setOpen(false);
      setShowPreview(false);
      setShowSummary(false);
    }
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
          <RouteCreationSummary
            formData={formData!}
            onBack={() => setShowSummary(false)}
            onPreview={() => setShowPreview(true)}
            calculateTotalDuration={calculateTotalDuration}
            calculateTotalPrice={calculateTotalPrice}
          />
        ) : (
          <CreateRouteForm
            onSubmit={onFormSubmit}
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