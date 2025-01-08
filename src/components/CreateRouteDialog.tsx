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
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
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
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          return;
        }
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        console.log('Fetching cities from Supabase...');
        const { data, error } = await supabase.from('cities').select('*');
        if (error) {
          console.error('Error fetching cities:', error);
          toast({
            title: "Error",
            description: "Failed to load cities. Please try again.",
            variant: "destructive"
          });
          return;
        }
        console.log('Cities fetched successfully:', data);
        setCities(data);
        const uniqueCountries = [...new Set(data.map(city => city.country))];
        setCountries(uniqueCountries);
      } catch (error) {
        console.error('Error in fetchCities:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading cities.",
          variant: "destructive"
        });
      }
    };
    fetchCities();
  }, [toast]);

  const handleOpenChange = async (newOpen: boolean) => {
    try {
      if (newOpen) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          console.log('User not authenticated, redirecting to login');
          toast({
            title: "Accesso richiesto",
            description: "Devi essere autenticato per creare un percorso",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }
      }
      
      if (!newOpen) {
        setShowPreview(false);
        setShowSummary(false);
        setScreenshotUrl(null);
        setFormData(null);
      }
      setOpen(newOpen);
    } catch (error) {
      console.error('Error in handleOpenChange:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const onFormSubmit = async (data: CreateRouteFormData) => {
    if (!user) {
      console.log('No user found, cannot submit form');
      return;
    }
    console.log('Submitting form data:', data);
    const success = await handleFormSubmit(data, user.id);
    if (success) {
      setShowPreview(true);
    }
  };

  const handleCreateRoute = async () => {
    console.log('Creating route...');
    const success = await createRoute();
    if (success) {
      setOpen(false);
      setShowPreview(false);
      setShowSummary(false);
      setScreenshotUrl(null);
      setFormData(null);
    }
  };

  const handleScreenshotUpload = (url: string) => {
    console.log('Screenshot uploaded:', url);
    setScreenshotUrl(url);
  };

  const handleBack = () => {
    if (showSummary) {
      setShowSummary(false);
      setShowPreview(true);
    } else if (showPreview) {
      setShowPreview(false);
    }
  };

  const handleContinueToSummary = () => {
    console.log("Continuing to summary...");
    setShowPreview(false);
    setShowSummary(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crea Nuovo Percorso</DialogTitle>
        </DialogHeader>
        
        {!showPreview && !showSummary ? (
          <CreateRouteForm
            onSubmit={onFormSubmit}
            countries={countries}
            cities={cities}
            selectedCountry={selectedCountry}
            onCountrySelect={setSelectedCountry}
          />
        ) : showPreview ? (
          <RoutePreview
            formData={formData!}
            onBack={handleBack}
            onContinue={handleContinueToSummary}
            screenshotUrl={screenshotUrl}
          />
        ) : (
          <RouteCreationSummary
            formData={formData!}
            onBack={handleBack}
            onCreateRoute={handleCreateRoute}
            calculateTotalDuration={calculateTotalDuration}
            calculateTotalPrice={calculateTotalPrice}
            onScreenshotUpload={handleScreenshotUpload}
            screenshotUrl={screenshotUrl}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}