import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CreateRouteForm } from '@/components/route/CreateRouteForm';
import { RoutePreview } from '@/components/RoutePreview';
import { useRouteCreation } from '@/hooks/useRouteCreation';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { useAuth } from '@/hooks/useAuth';
import { CreateActionsMenu } from './route/CreateActionsMenu';

export function CreateRouteDialog() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isOpen,
    setIsOpen,
    isDialogOpen,
    step,
    setStep,
    handleCreatePost,
    handleCreateRoute,
    handleDialogClose,
    showSuccessToast,
    showErrorToast
  } = useRouteDialog();
  
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
        console.log('Route created successfully');
        showSuccessToast();
        handleDialogClose(false);
        navigate('/profile');
      } else {
        console.error('Failed to create route');
        showErrorToast();
      }
    }
  };

  return (
    <>
      <CreateActionsMenu
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onCreatePost={handleCreatePost}
        onCreateRoute={handleCreateRoute}
      />

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={handleDialogClose}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {step === 'form' ? (
            <CreateRouteForm 
              onSubmit={handleFormSubmission}
              cities={cities}
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
              onSuccess={() => {}}
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