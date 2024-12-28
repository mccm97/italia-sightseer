import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
}

const CityMap = ({ center, attractions = [] }: CityMapProps) => {
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
      {attractions.map((attraction, index) => (
        <Marker
          key={index}
          position={attraction.position}
          title={attraction.name}
        />
      ))}
      {attractions.length > 1 && (
        <Polyline
          positions={attractions.map(a => a.position)}
          color="blue"
        />
      )}
    </MapContainer>
  );
};

export default CityMap;