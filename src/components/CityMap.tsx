import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Route } from '@/data/routes';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CityMapProps {
  center: [number, number];
  attractions?: Array<{
    name: string;
    position?: [number, number];
  }>;
  routes?: Route[];
  onRouteClick?: (route: Route) => void;
  showWalkingPath?: boolean;
}

// Helper function to validate coordinates
const isValidCoordinate = (coord: [number, number]): boolean => {
  return coord[0] !== 0 && coord[1] !== 0 && 
         !isNaN(coord[0]) && !isNaN(coord[1]) &&
         Math.abs(coord[0]) <= 90 && Math.abs(coord[1]) <= 180;
};

// Component to update walking path
const WalkingPath = ({ points }: { points: [number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length < 2) return;

    // Validate all points before making the API call
    const validPoints = points.filter(isValidCoordinate);
    if (validPoints.length < 2) {
      console.warn('Not enough valid points for walking path');
      return;
    }

    const fetchWalkingPath = async () => {
      try {
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

        // Remove old layers if present
        map.eachLayer((layer) => {
          if (layer instanceof L.Polyline && layer.options.className === 'walking-path') {
            map.removeLayer(layer);
          }
        });

        // Add new paths
        paths.forEach(path => {
          L.polyline(path, {
            color: 'blue',
            weight: 4,
            opacity: 0.7,
            className: 'walking-path'
          }).addTo(map);
        });
      } catch (error) {
        console.error('Error fetching walking path:', error);
      }
    };

    fetchWalkingPath();
  }, [points, map]);

  return null;
};

const CityMap = ({ center, attractions = [], routes = [], onRouteClick, showWalkingPath = false }: CityMapProps) => {
  // Filter out attractions without positions and with invalid coordinates
  const validAttractions = attractions.filter((attr): attr is { name: string; position: [number, number] } => 
    !!attr.position && isValidCoordinate(attr.position)
  );

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="w-full h-[500px] rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Show existing routes */}
      {routes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.attractions
            .filter(a => a.position && isValidCoordinate(a.position))
            .map(a => a.position as [number, number])}
          color="purple"
          weight={3}
          opacity={0.6}
          eventHandlers={{
            click: () => onRouteClick?.(route)
          }}
        />
      ))}

      {/* Show attraction markers */}
      {validAttractions.map((attraction, index) => (
        <Marker
          key={index}
          position={attraction.position}
          title={attraction.name}
        />
      ))}

      {/* Show walking path if requested */}
      {showWalkingPath && validAttractions.length > 1 && (
        <WalkingPath points={validAttractions.map(a => a.position)} />
      )}
    </MapContainer>
  );
};

export default CityMap;