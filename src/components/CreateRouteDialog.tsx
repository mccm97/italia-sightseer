import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { CreateRouteFormData } from '@/types/route';
import { RoutePreview } from './RoutePreview';
import { RouteForm } from './route/RouteForm';
import { RouteFormSummary } from './route/RouteFormSummary';

export function CreateRouteDialog() {
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  
  const form = useForm<CreateRouteFormData>({
    defaultValues: {
      name: '',
      attractionsCount: 1,
      country: null,
      city: null,
      attractions: [{ name: '', address: '', inputType: 'name', visitDuration: 0, price: 0 }],
      transportMode: 'walking'
    }
  });

  const handleClose = () => {
    setOpen(false);
    setShowPreview(false);
    setShowSummary(false);
    setSelectedCountry(null);
    form.reset();
  };

  const attractionsCount = form.watch('attractionsCount');

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
            onBack={() => setShowPreview(false)}
            onClose={handleClose}
          />
        ) : showSummary ? (
          <RouteFormSummary
            formData={form.getValues()}
            onBack={() => setShowSummary(false)}
            onShowPreview={() => setShowPreview(true)}
          />
        ) : (
          <RouteForm
            form={form}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            onShowSummary={() => setShowSummary(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}