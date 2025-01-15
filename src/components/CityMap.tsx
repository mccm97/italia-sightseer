import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Route } from '@/types/route';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CityMapProps {
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

const isValidCoordinate = (coord: [number, number]): boolean => {
  return coord[0] !== 0 && coord[1] !== 0 && 
         !isNaN(coord[0]) && !isNaN(coord[1]) &&
         Math.abs(coord[0]) <= 90 && Math.abs(coord[1]) <= 180;
};

const WalkingPath = ({ points }: { points: [number, number][] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map || points.length < 2) return;

    const layers: L.Polyline[] = [];

    const validPoints = points.filter(isValidCoordinate);
    if (validPoints.length < 2) {
      console.warn('Not enough valid points for walking path');
      return;
    }

    const fetchWalkingPath = async () => {
      try {
        console.log('Fetching walking paths for points:', validPoints);
        const paths = await Promise.all(
          validPoints.slice(0, -1).map(async (start, i) => {
            const end = validPoints[i + 1];
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
            );
            
            if (!response.ok) {
              throw new Error(`OSRM API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
          })
        );

        console.log('Received walking paths:', paths);

        paths.forEach(path => {
          const layer = L.polyline(path, {
            color: 'blue',
            weight: 4,
            opacity: 0.7,
            className: 'walking-path'
          }).addTo(map);
          layers.push(layer);
        });
      } catch (error) {
        console.error('Error fetching walking path:', error);
      }
    };

    fetchWalkingPath();

    return () => {
      layers.forEach(layer => {
        if (layer && map) {
          map.removeLayer(layer);
        }
      });
    };
  }, [points, map]);

  return null;
};

const CityMap = ({ 
  center, 
  zoom = 13, 
  attractions = [], 
  routes = [], 
  onRouteClick, 
  showWalkingPath = false 
}: CityMapProps) => {
  const validAttractions = attractions.filter((attr): attr is { name: string; position: [number, number] } => 
    !!attr.position && isValidCoordinate(attr.position)
  );

  console.log('CityMap rendering with attractions:', validAttractions);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-[500px] rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {routes.map((route) => {
        const routePositions = route.attractions
          .filter(a => a.position && isValidCoordinate(a.position))
          .map(a => a.position as [number, number]);

        return routePositions.length > 1 && (
          <Polyline
            key={route.id}
            positions={routePositions}
            color="purple"
            weight={3}
            opacity={0.6}
            eventHandlers={{
              click: () => onRouteClick?.(route)
            }}
          />
        );
      })}

      {validAttractions.map((attraction, index) => (
        <Marker
          key={index}
          position={attraction.position}
          title={attraction.name}
        />
      ))}

      {showWalkingPath && validAttractions.length > 1 && (
        <WalkingPath points={validAttractions.map(a => a.position)} />
      )}
    </MapContainer>
  );
};

export default CityMap;