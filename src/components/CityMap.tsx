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
    if (!map || points.length < 2) {
      console.log('Not enough points for walking path or map not ready:', points);
      return;
    }

    const layers: L.Polyline[] = [];
    
    const validPoints = points.filter(isValidCoordinate);
    console.log('Valid points for walking path:', validPoints);
    
    if (validPoints.length < 2) {
      console.warn('Not enough valid points for walking path');
      return;
    }

    const fetchWalkingPath = async () => {
      try {
        // Prima creiamo una linea diretta tra i punti per mostrare subito il percorso
        const directPath = L.polyline(validPoints, {
          color: 'purple',
          weight: 2,
          opacity: 0.4,
          dashArray: '5, 10',
        }).addTo(map);
        layers.push(directPath);

        // Costruiamo il percorso completo tra tutte le attrazioni
        for (let i = 0; i < validPoints.length - 1; i++) {
          const start = validPoints[i];
          const end = validPoints[i + 1];
          
          console.log(`Fetching walking path from ${start} to ${end}`);
          
          try {
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
            );
            
            if (!response.ok) {
              throw new Error(`OSRM API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('OSRM response for segment:', data);
            
            if (!data.routes?.[0]?.geometry?.coordinates) {
              throw new Error('No route coordinates found in response');
            }
            
            // Convertiamo le coordinate [lng, lat] in [lat, lng] per Leaflet
            const pathCoords = data.routes[0].geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
            );
            
            const pathLayer = L.polyline(pathCoords, {
              color: 'blue',
              weight: 4,
              opacity: 0.7,
            }).addTo(map);
            
            layers.push(pathLayer);
          } catch (error) {
            console.error('Error fetching path segment:', error);
            // In caso di errore, creiamo una linea diretta tra i punti
            const fallbackLayer = L.polyline([start, end], {
              color: 'red',
              weight: 2,
              opacity: 0.5,
              dashArray: '5, 5',
            }).addTo(map);
            layers.push(fallbackLayer);
          }
        }

        // Rimuoviamo la linea diretta temporanea
        directPath.remove();

        // Fit della mappa per mostrare tutto il percorso
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (error) {
        console.error('Error creating walking path:', error);
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
  console.log('CityMap rendering with attractions:', attractions);
  
  const validAttractions = attractions.filter((attr): attr is { name: string; position: [number, number] } => 
    !!attr.position && isValidCoordinate(attr.position)
  );

  console.log('Valid attractions for map:', validAttractions);

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
      
      {validAttractions.map((attraction, index) => (
        <Marker
          key={`${attraction.name}-${index}`}
          position={attraction.position}
          title={attraction.name}
        />
      ))}

      {showWalkingPath && validAttractions.length > 1 && (
        <WalkingPath points={validAttractions.map(a => a.position)} />
      )}

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
    </MapContainer>
  );
};

export default CityMap;