export interface Attraction {
  name: string;
  position?: [number, number];
  visitDuration: number;
  price?: number;
}

export interface CreateRouteFormData {
  name: string;
  city?: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    country?: string;
  };
  country?: string;
  attractions: Array<{
    name: string;
    address: string;
    inputType: 'name' | 'address';
    visitDuration: number;
    price: number;
    attractionId?: string; // Added this field
  }>;
  attractionsCount: number;
  transportMode: 'walking' | 'public';
  image_url?: string;
  description?: string;
}

export interface DirectionsStep {
  instruction: string;
  distance: number;
  duration: number;
}

export interface Route {
  id: string;
  cityName: string;
  name: string;
  duration: number;
  total_duration: number;
  creator?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  attractions: Attraction[];
  isPublic: boolean;
  directions?: DirectionsStep[];
  image_url?: string;
  description?: string;
  city_id?: string;
}