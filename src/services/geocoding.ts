import { supabase } from '@/integrations/supabase/client';

export const geocodeAddress = async (searchTerm: string): Promise<[number, number]> => {
  try {
    console.log('Searching attraction in database:', searchTerm);
    
    // Rimuovi eventuali riferimenti alla città e al paese dalla ricerca
    const cleanSearchTerm = searchTerm.split(',')[0].trim();

    const { data: attraction, error } = await supabase
      .from('attractions')
      .select('lat, lng')
      .ilike('name', `%${cleanSearchTerm}%`)
      .maybeSingle();

    if (error) {
      console.error('Error searching attraction:', error);
      throw new Error('Errore durante la ricerca dell\'attrazione');
    }

    if (!attraction) {
      console.warn('Attraction not found:', searchTerm);
      throw new Error('Attrazione non trovata');
    }

    console.log('Found attraction coordinates:', attraction);
    return [attraction.lat, attraction.lng];
  } catch (error) {
    console.error('Error in geocodeAddress:', error);
    throw new Error('Errore durante la ricerca dell\'indirizzo');
  }
}