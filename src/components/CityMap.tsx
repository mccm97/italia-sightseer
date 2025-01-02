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
    position: [number, number];
  }>;
  routes?: Route[];
  onRouteClick?: (route: Route) => void;
  showWalkingPath?: boolean;
}

// Component per aggiornare il percorso a piedi
const WalkingPath = ({ points }: { points: [number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length < 2) return;

    const fetchWalkingPath = async () => {
      try {
        const paths = await Promise.all(
          points.slice(0, -1).map(async (start, i) => {
            const end = points[i + 1];
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
            );
            const data = await response.json();
            return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
          })
        );

        // Rimuovi i vecchi layer se presenti
        map.eachLayer((layer) => {
          if (layer instanceof L.Polyline && layer.options.className === 'walking-path') {
            map.removeLayer(layer);
          }
        });

        // Aggiungi i nuovi percorsi
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
      
      {/* Mostra i percorsi esistenti */}
      {routes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.attractions.map(a => a.position)}
          color="purple"
          weight={3}
          opacity={0.6}
          eventHandlers={{
            click: () => onRouteClick?.(route)
          }}
        />
      ))}

      {/* Mostra i marker delle attrazioni */}
      {attractions.map((attraction, index) => (
        <Marker
          key={index}
          position={attraction.position}
          title={attraction.name}
        />
      ))}

      {/* Mostra il percorso a piedi se richiesto */}
      {showWalkingPath && attractions.length > 1 && (
        <WalkingPath points={attractions.map(a => a.position)} />
      )}
    </MapContainer>
  );
};

export default CityMap;
