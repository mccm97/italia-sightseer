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
  country?: string;
}

export interface CreateRouteFormData {
  name: string;
  attractionsCount: number;
  city: City | null;
  country: string;
  attractions: Attraction[];
  transportMode?: 'walking' | 'public';
}