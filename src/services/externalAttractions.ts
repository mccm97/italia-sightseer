import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

interface GeoapifyPlace {
  properties: {
    name: string;
    lat: number;
    lon: number;
    categories: string[];
    formatted: string;
    distance?: number;
    place_id: string;
    city?: string;
    country?: string;
    state?: string;
    postcode?: string;
    street?: string;
    housenumber?: string;
  };
}

interface AmadeusAttraction {
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  rank: number;
}

interface City {
  name: string;
  lat: number;
  lng: number;
}

export const searchGeoapifyPlaces = async (city: string, category: string) => {
  try {
    console.log('Fetching Geoapify places for city:', city, 'category:', category);
    
    const { data: { key }, error } = await supabase
      .functions.invoke('get-geoapify-key', {
        body: { type: 'places' }
      });
      
    if (error) {
      console.error('Error fetching Geoapify API key:', error);
      return [];
    }

    // First get city coordinates
    const cityResponse = await axios.get(
      `https://api.geoapify.com/v1/geocode/search`,
      {
        params: {
          text: city,
          type: 'city',
          format: 'json',
          apiKey: key
        }
      }
    );

    if (!cityResponse.data.results?.length) {
      console.error('City not found:', city);
      return [];
    }

    const cityCoords = {
      lat: cityResponse.data.results[0].lat,
      lon: cityResponse.data.results[0].lon
    };

    // Then search for places around the city
    const response = await axios.get(
      `https://api.geoapify.com/v2/places`,
      {
        params: {
          categories: category,
          filter: `circle:${cityCoords.lon},${cityCoords.lat},5000`,
          bias: `proximity:${cityCoords.lon},${cityCoords.lat}`,
          limit: 20,
          apiKey: key,
          format: 'json'
        }
      }
    );

    console.log('Geoapify response:', response.data);

    return response.data.features.map((place: GeoapifyPlace) => ({
      name: place.properties.name,
      position: [place.properties.lat, place.properties.lon] as [number, number],
      address: place.properties.formatted,
      category: place.properties.categories[0],
      distance: place.properties.distance,
      placeId: place.properties.place_id,
      details: {
        city: place.properties.city,
        country: place.properties.country,
        state: place.properties.state,
        postcode: place.properties.postcode,
        street: place.properties.street,
        housenumber: place.properties.housenumber
      }
    }));
  } catch (error) {
    console.error('Error fetching places from Geoapify:', error);
    return [];
  }
};

export const searchAmadeusAttractions = async (city: City) => {
  try {
    const response = await axios.get(
      `https://api.amadeus.com/v1/reference-data/locations/pois`,
      {
        params: {
          latitude: city.lat,
          longitude: city.lng,
          radius: 20,
          category: 'SIGHTS'
        },
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    return response.data.data.map((attraction: AmadeusAttraction) => ({
      name: attraction.name,
      position: [attraction.latitude, attraction.longitude] as [number, number],
      category: attraction.category,
      rank: attraction.rank
    }));
  } catch (error) {
    console.error('Error fetching attractions from Amadeus:', error);
    return [];
  }
};