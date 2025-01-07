import { supabase } from '@/integrations/supabase/client';

export interface MonumentSuggestion {
  name: string;
  distance?: string;
}

export async function getMonumentSuggestions(
  searchQuery: string,
  cityId: string
): Promise<string[]> {
  try {
    console.log('Fetching monument suggestions for city:', cityId, 'query:', searchQuery);
    const { data, error } = await supabase
      .from('attractions')
      .select('name')
      .eq('city_id', cityId)
      .ilike('name', `%${searchQuery}%`);

    if (error) {
      console.error('Error fetching monument suggestions:', error);
      throw error;
    }

    console.log('Found monument suggestions:', data);
    return data?.map(attraction => attraction.name) || [];
  } catch (error) {
    console.error('Error in getMonumentSuggestions:', error);
    throw error;
  }
}