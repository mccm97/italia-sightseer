import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CityMapProps } from './map/types';
import { MapMarker } from './map/MapMarker';
import { WalkingPath } from './map/WalkingPath';
import { isValidCoordinate } from './map/MapUtils';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CityMap: React.FC<CityMapProps> = ({ 
  center, 
  zoom = 13, 
  attractions = [], 
  routes = [], 
  onRouteClick, 
  showWalkingPath = false 
}) => {
  console.log('CityMap rendering with:', {
    center,
    zoom,
    attractionsCount: attractions.length,
    routesCount: routes.length,
    showWalkingPath
  });
  
  const validAttractions = attractions.filter(attr => {
    if (!attr.position) {
      console.warn('Missing position for attraction:', attr.name);
      return false;
    }
    const isValid = isValidCoordinate(attr.position);
    if (!isValid) {
      console.warn('Invalid position for attraction:', attr.name, attr.position);
    }
    return isValid;
  });

  console.log('Valid attractions for map:', validAttractions.map(a => ({
    name: a.name,
    position: a.position
  })));

  return (
    <MapContainer
      key={`map-${center[0]}-${center[1]}`}
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-lg"
      minZoom={2}
      maxZoom={18}
      maxBounds={[[-90, -180], [90, 180]]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        keepBuffer={8}
      />
      
      {validAttractions.map((attraction, index) => (
        <MapMarker
          key={`${attraction.name}-${index}`}
          position={attraction.position!}
          name={attraction.name}
        />
      ))}

      {showWalkingPath && validAttractions.length > 1 && (
        <WalkingPath points={validAttractions.map(a => a.position!)} />
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