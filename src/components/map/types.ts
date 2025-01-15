import { Route } from '@/types/route';

export interface AttractionMarkerProps {
  position: [number, number];
  name: string;
}

export interface WalkingPathProps {
  points: [number, number][];
}

export interface CityMapProps {
  center: [number, number];
  zoom?: number;
  attractions?: Array<{
    name: string;
    position?: [number, number];
    visitDuration?: number;
    price?: number;
  }>;
  routes?: Route[];
  onRouteClick?: (route: Route) => void;
  showWalkingPath?: boolean;
}

export interface MapUtilsResponse {
  isValid: boolean;
  error?: string;
}