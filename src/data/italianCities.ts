export interface ItalianCity {
  name: string;
  lat: number;
  lng: number;
}

export const italianCities: ItalianCity[] = [
  { name: "Roma", lat: 41.9028, lng: 12.4964 },
  { name: "Milano", lat: 45.4642, lng: 9.1900 },
  { name: "Napoli", lat: 40.8518, lng: 14.2681 },
  { name: "Torino", lat: 45.0703, lng: 7.6869 },
  { name: "Palermo", lat: 38.1157, lng: 13.3615 },
  { name: "Genova", lat: 44.4056, lng: 8.9463 },
  { name: "Bologna", lat: 44.4949, lng: 11.3426 },
  { name: "Firenze", lat: 43.7696, lng: 11.2558 },
  { name: "Bari", lat: 41.1171, lng: 16.8719 },
  { name: "Venezia", lat: 45.4408, lng: 12.3155 },
  // ... Add more Italian cities as needed
];