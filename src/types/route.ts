export interface Attraction {
  name: string;
  address: string;
  inputType: 'name' | 'address';
}

export interface CreateRouteFormData {
  name: string;
  attractionsCount: number;
  city: { name: string; lat: number; lng: number } | null;
  attractions: Attraction[];
}