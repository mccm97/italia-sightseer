import { supabase } from '@/integrations/supabase/client';

export const getMonumentSuggestions = async (query: string, cityId: string) => {
  const { data: attractions, error } = await supabase
    .from('attractions')
    .select('name')
    .eq('city_id', cityId)
    .ilike('name', `%${query}%`);

  if (error) {
    console.error('Error fetching attractions:', error);
    return [];
  }

  return attractions.map(attraction => attraction.name);
};

const indirizziNapoli = [
  "Via Partenope, 80132 Napoli NA",
  "Via Vittorio Emanuele III, 80133 Napoli NA",
  "Via Tito Angelini, 20, 80129 Napoli NA",
  "Via Marina, 80133 Napoli NA",
  "Piazza del Plebiscito, 1, 80132 Napoli NA",
  "Via San Carlo, 98, 80132 Napoli NA",
  "Via San Carlo, 80132 Napoli NA",
  "Via Duomo, 147, 80138 Napoli NA",
  "Via Francesco de Sanctis, 19/21, 80134 Napoli NA",
  "Via Capodimonte, 13, 80136 Napoli NA"
];

export const getAddressSuggestions = (query: string) => {
  const normalizedQuery = query.toLowerCase();
  return indirizziNapoli.filter(indirizzo => 
    indirizzo.toLowerCase().includes(normalizedQuery)
  );
};
