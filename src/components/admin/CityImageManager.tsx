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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestione Immagini Città</CardTitle>
          <CardDescription>
            Carica e gestisci le immagini per ogni città
          </CardDescription>
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