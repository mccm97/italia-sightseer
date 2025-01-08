import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AttractionSummaryProps {
  routeId: string;
}

export function AttractionSummary({ routeId }: AttractionSummaryProps) {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        console.log('Fetching attractions for route:', routeId);
        const { data, error } = await supabase
          .from('route_attractions')
          .select(`
            order_index,
            attraction:attractions (
              name,
              visit_duration,
              price
            )
          `)
          .eq('route_id', routeId)
          .order('order_index');

        console.log('Attractions query result:', data);

        if (error) {
          console.error('Error fetching attractions:', error);
          throw error;
        }

        setAttractions(data || []);
      } catch (error) {
        console.error('Error in attractions fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (routeId) {
      fetchAttractions();
    }
  }, [routeId]);

  if (isLoading) {
    return <div>Caricamento attrazioni...</div>;
  }

  if (!attractions.length) {
    return <div>Nessuna attrazione disponibile</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Attrazioni</h3>
      <ul className="space-y-2">
        {attractions.map((ra, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{ra.attraction.name}</span>
            <div className="text-sm text-gray-600">
              <span>{ra.attraction.visit_duration} min</span>
              {ra.attraction.price > 0 && (
                <span className="ml-2">€{ra.attraction.price.toFixed(2)}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}