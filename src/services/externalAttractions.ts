import axios from 'axios';

interface GeoapifyPlace {
  properties: {
    name: string;
    lat: number;
    lon: number;
    categories: string[];
    formatted: string;
  };
}

interface AmadeusAttraction {
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  rank: number;
}

export const searchGeoapifyPlaces = async (city: string, category: string) => {
  try {
    const response = await axios.get(
      `https://api.geoapify.com/v2/places`,
      {
        params: {
          categories: category,
          filter: `place:${city}`,
          limit: 20,
          format: 'json'
        },
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    return response.data.features.map((place: GeoapifyPlace) => ({
      name: place.properties.name,
      position: [place.properties.lat, place.properties.lon] as [number, number],
      address: place.properties.formatted,
      category: place.properties.categories[0]
    }));
  } catch (error) {
    console.error('Error fetching places from Geoapify:', error);
    return [];
  }
};

export const searchAmadeusAttractions = async (city: string) => {
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