export interface Attraction {
  name: string;
  address: string;
  inputType: 'name' | 'address';
  visitDuration?: number;
  price?: number;
}

export interface CreateRouteFormData {
  name: string;
  attractionsCount: number;
  country: string | null;
  city: { 
    id?: string;
    name: string; 
    lat: number; 
    lng: number; 
  } | null;
  attractions: Attraction[];
  transportMode: 'walking' | 'public';
}