import { useState } from 'react';
import { Plus, PenLine, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CreateRouteForm } from '@/components/route/CreateRouteForm';
import { RoutePreview } from '@/components/RoutePreview';
import { useRouteCreation } from '@/hooks/useRouteCreation';
import { useAuth } from '@/hooks/useAuth';

export function CreateRouteDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const {
    formData,
    handleFormSubmit,
    calculateTotalDuration,
    calculateTotalPrice,
    createRoute
  } = useRouteCreation();

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      console.log('Fetching cities from Supabase');
      const { data, error } = await supabase
        .from('cities')
        .select('id, name, lat, lng, country')
        .order('name');

      if (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }

      console.log('Fetched cities:', data);
      return data;
    }
  });

  const handleCreatePost = () => {
    console.log('Navigating to blog page');
    setIsOpen(false);
    navigate('/blog');
  };

  const handleCreateRoute = () => {
    console.log('Opening route creation dialog');
    setIsOpen(false);
    setIsDialogOpen(true);
    // Pre-select Italy and Turin
    setSelectedCountry('Italy');
  };

  const handleCountrySelect = (country: string) => {
    console.log('Selected country:', country);
    setSelectedCountry(country);
  };

  const handleFormSubmission = async (data: any) => {
    console.log('Form submitted with data:', data);
    const success = await handleFormSubmit(data, user?.id);
    if (success) {
      console.log('Moving to preview step');
      setStep('preview');
    }
  };

  const handleBack = () => {
    console.log('Going back to form step');
    setStep('form');
  };

  const handleRouteCreation = async () => {
    console.log('Creating route...');
    if (user?.id) {
      const success = await createRoute(user.id);
      if (success) {
        console.log('Route created successfully, closing dialog and navigating to profile');
        setIsDialogOpen(false);
        setStep('form');
        navigate('/profile');
      }
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 hover:scale-105 transition-transform shadow-lg"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          side="top" 
          className="mb-2"
          sideOffset={16}
        >
          <DropdownMenuItem 
            onClick={handleCreatePost}
            className="cursor-pointer hover:bg-accent focus:bg-accent"
          >
            <PenLine className="mr-2 h-4 w-4" />
            {t('blog.newPost')}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleCreateRoute}
            className="cursor-pointer hover:bg-accent focus:bg-accent"
          >
            <MapPin className="mr-2 h-4 w-4" />
            {t('menu.newRoute')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {step === 'form' ? (
            <CreateRouteForm 
              onSubmit={handleFormSubmission}
              cities={cities}
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
              onSuccess={() => {}}
              initialData={{
                name: "Tour Classico di Torino",
                description: "Un affascinante percorso attraverso il cuore storico e culturale di Torino. Questo itinerario ti porterà alla scoperta dei principali monumenti e musei della prima capitale d'Italia, permettendoti di ammirare l'elegante architettura barocca e assaporare l'atmosfera regale della città sabauda.",
                attractions: [
                  {
                    name: "Palazzo Reale",
                    address: "",
                    inputType: "name",
                    visitDuration: 90,
                    price: 15
                  },
                  {
                    name: "Museo Egizio",
                    address: "",
                    inputType: "name",
                    visitDuration: 120,
                    price: 18
                  },
                  {
                    name: "Mole Antonelliana",
                    address: "",
                    inputType: "name",
                    visitDuration: 60,
                    price: 14
                  },
                  {
                    name: "Piazza San Carlo",
                    address: "",
                    inputType: "name",
                    visitDuration: 30,
                    price: 0
                  }
                ],
                attractionsCount: 4,
                country: "Italy",
                city: cities.find(city => city.name === "Turin")
              }}
            />
          ) : (
            <RoutePreview
              formData={formData}
              onBack={handleBack}
              onContinue={handleRouteCreation}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}