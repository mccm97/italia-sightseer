export type DbRoute = {
  id: string;
  name: string;
  total_duration: number;
  image_url?: string;
  description?: string;
  city_id: string;
  route_likes: { count: number; }[];
  route_ratings: { rating: number; }[];
  route_attractions: {
    attraction: {
      name: string;
      visit_duration: number;
      price: number;
      lat: number;
      lng: number;
    };
  }[];
  creator: {
    id: string;
    username: string;
    avatar_url?: string;
  };
};