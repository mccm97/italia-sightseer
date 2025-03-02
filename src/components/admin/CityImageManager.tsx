
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AIAssistantAdmin } from './AIAssistantAdmin';

interface City {
  id: string;
  name: string;
  country?: string;
}

export function CityImageManager() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchCities = async () => {
      const { data: citiesData } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      
      if (citiesData) {
        setCities(citiesData);
        // Fetch existing images for all cities
        citiesData.forEach(city => fetchCityImage(city.id));
      }
    };

    fetchCities();
  }, []);

  const fetchCityImage = async (cityId: string) => {
    const { data } = await supabase
      .from('city_images')
      .select('image_url')
      .eq('city_id', cityId)
      .maybeSingle();
    
    if (data) {
      setImages(prev => ({ ...prev, [cityId]: data.image_url }));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCity) {
      toast({
        title: "Errore",
        description: "Seleziona prima una città",
        variant: "destructive",
      });
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${selectedCity}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('city-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('city-images')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('city_images')
        .upsert({
          city_id: selectedCity,
          image_url: publicUrl
        }, {
          onConflict: 'city_id'
        });

      if (dbError) throw dbError;

      setImages(prev => ({ ...prev, [selectedCity]: publicUrl }));

      toast({
        title: "Successo",
        description: "Immagine caricata con successo",
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento dell'immagine",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCityDataGenerated = async (cityData: any) => {
    try {
      // Check if city already exists
      const { data: existingCity } = await supabase
        .from('cities')
        .select('id')
        .eq('name', cityData.name)
        .maybeSingle();

      if (existingCity) {
        toast({
          title: "Città già esistente",
          description: "Questa città è già presente nel database",
          variant: "destructive",
        });
        return;
      }

      // Add new city
      const { data: newCity, error } = await supabase
        .from('cities')
        .insert({
          name: cityData.name,
          country: cityData.country,
          lat: cityData.lat,
          lng: cityData.lng
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Città aggiunta con successo",
      });

      // Refresh cities list
      const { data: citiesData } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      
      if (citiesData) {
        setCities(citiesData);
      }
    } catch (error) {
      console.error('Error adding city:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta della città",
        variant: "destructive",
      });
    }
  };

  const handleMonumentDataGenerated = async (monumentData: any) => {
    try {
      // First, find the city
      const { data: cityData } = await supabase
        .from('cities')
        .select('id')
        .eq('name', monumentData.city)
        .maybeSingle();

      if (!cityData) {
        toast({
          title: "Città non trovata",
          description: "La città specificata non esiste nel database",
          variant: "destructive",
        });
        return;
      }

      // Check if attraction already exists
      const { data: existingAttraction } = await supabase
        .from('attractions')
        .select('id')
        .eq('name', monumentData.name)
        .eq('city_id', cityData.id)
        .maybeSingle();

      if (existingAttraction) {
        toast({
          title: "Attrazione già esistente",
          description: "Questa attrazione è già presente nel database per questa città",
          variant: "destructive",
        });
        return;
      }

      // Add new attraction
      const { data: newAttraction, error } = await supabase
        .from('attractions')
        .insert({
          name: monumentData.name,
          city_id: cityData.id,
          lat: monumentData.lat,
          lng: monumentData.lng,
          visit_duration: monumentData.visitDuration,
          price: monumentData.price || 0
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Attrazione aggiunta con successo",
      });
    } catch (error) {
      console.error('Error adding attraction:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta dell'attrazione",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestione Immagini Città</CardTitle>
              <CardDescription>
                Carica e gestisci le immagini per ogni città
              </CardDescription>
            </div>
            <AIAssistantAdmin 
              onCityDataGenerated={handleCityDataGenerated}
              onMonumentDataGenerated={handleMonumentDataGenerated}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Seleziona Città
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Seleziona una città...</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} {city.country ? `(${city.country})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Carica Immagine
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading || !selectedCity}
                />
                {uploading && <Loader2 className="animate-spin" />}
              </div>
            </div>
          </div>

          {selectedCity && images[selectedCity] && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Immagine Corrente:</p>
              <img
                src={images[selectedCity]}
                alt="City preview"
                className="w-full max-w-xl rounded-lg shadow-md"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
