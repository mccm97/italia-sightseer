import React from 'react';
import { Marker } from 'react-leaflet';
import { AttractionMarkerProps } from './types';

export const MapMarker: React.FC<AttractionMarkerProps> = ({ position, name }) => {
  console.log(`Rendering marker for ${name} at position:`, position);
  return <Marker position={position} title={name} />;
};