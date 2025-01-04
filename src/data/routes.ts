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
    username: string;
  };
  attractions: Array<{
    name: string;
    position?: [number, number];
    visitDuration: number;
    price?: number;
  }>;
  isPublic: boolean;
  directions?: DirectionsStep[];
}

export const sampleRoutes: Route[] = [
  {
    id: '1',
    cityName: 'Roma',
    name: 'Tour Classico di Roma',
    duration: 240,
    total_duration: 240,
    attractions: [
      {
        name: 'Colosseo',
        position: [41.8902, 12.4922],
        visitDuration: 90,
        price: 16
      },
      {
        name: 'Fontana di Trevi',
        position: [41.9009, 12.4833],
        visitDuration: 30,
        price: 0
      },
      {
        name: 'Pantheon',
        position: [41.8986, 12.4769],
        visitDuration: 60,
        price: 0
      }
    ],
    isPublic: true
  },
  {
    id: '2',
    cityName: 'Firenze',
    name: 'Firenze Rinascimentale',
    duration: 180,
    total_duration: 180,
    attractions: [
      {
        name: 'Duomo',
        position: [43.7731, 11.2566],
        visitDuration: 60,
        price: 18
      },
      {
        name: 'Galleria degli Uffizi',
        position: [43.7677, 11.2556],
        visitDuration: 90,
        price: 20
      }
    ],
    isPublic: true
  }
];