import axios from 'axios';

interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
}

export const geocodeAddress = async (address: string): Promise<[number, number]> => {
  try {
    console.log('Geocoding address:', address);
    const response = await axios.get<GeocodingResult[]>(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: address,
          format: 'json',
          limit: 1,
          countrycodes: 'it'
        },
        headers: {
          'User-Agent': 'TourPlanner/1.0'
        }
      }
    );

    if (response.data.length === 0) {
      throw new Error('Indirizzo non trovato');
    }

    const result = response.data[0];
    console.log('Geocoding result:', result);
    return [result.lat, result.lon].map(Number) as [number, number];
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Errore durante la ricerca dell\'indirizzo');
  }
}