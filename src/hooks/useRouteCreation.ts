import { useState } from 'react';
import { CreateRouteFormData } from '@/types/route';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export function useRouteCreation() {
  const [formData, setFormData] = useState<CreateRouteFormData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const calculateTotalDuration = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.visitDuration || 0), 0) || 0;
  };

  const calculateTotalPrice = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.price || 0), 0) || 0;
  };

  const handleFormSubmit = async (data: CreateRouteFormData, userId: string) => {
    try {
      console.log('Starting form submission process...', data);
      
      const isDuplicate = await checkDuplicateRouteName(userId, data.name);
      if (isDuplicate) {
        toast({
          title: "Nome percorso duplicato",
          description: "Hai già un percorso con questo nome. Per favore, scegli un nome diverso.",
          variant: "destructive"
        });
        return false;
      }

      const { data: canCreate } = await supabase.rpc('can_create_route', { input_user_id: userId });

      if (!canCreate) {
        // Verifica il livello di sottoscrizione dell'utente
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_level')
          .eq('id', userId)
          .single();

        if (profile?.subscription_level === 'bronze') {
          toast({
            title: "Limite mensile raggiunto",
            description: "Con il piano Bronze puoi creare solo un percorso al mese. Passa a un piano superiore per crearne di più!",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Limite raggiunto",
            description: "Hai raggiunto il limite mensile di percorsi. Passa a un piano superiore per crearne altri.",
            variant: "destructive"
          });
        }
        navigate('/upgrade');
        return false;
      }

      setFormData(data);
      return true;
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    formData,
    setFormData,
    handleFormSubmit,
    calculateTotalDuration,
    calculateTotalPrice
  };
}

// Helper functions
async function checkDuplicateRouteName(userId: string, routeName: string) {
  const { data, error } = await supabase
    .from('routes')
    .select('id')
    .eq('user_id', userId)
    .eq('name', routeName)
    .maybeSingle();

  if (error) {
    console.error('Error checking for duplicate route name:', error);
    return true;
  }

  return !!data;
}