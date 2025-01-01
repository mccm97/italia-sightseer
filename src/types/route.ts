export interface Attraction {
  name: string;
  address: string;
  inputType: 'name' | 'address';
  visitDuration?: number;
  price?: number;
}

export interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
  created_at?: string; // Made optional since it's not used in the UI
}

export interface CreateRouteFormData {
  name: string;
  attractionsCount: number;
  country: string | null;
  city: City | null;
  attractions: Attraction[];
  transportMode: 'walking' | 'public';
}