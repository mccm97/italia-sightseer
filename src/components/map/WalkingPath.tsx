import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { WalkingPathProps } from './types';
import { validatePoints } from './MapUtils';

export const WalkingPath: React.FC<WalkingPathProps> = ({ points }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !validatePoints(points)) {
      console.log('Invalid points or map not ready:', { points, mapReady: !!map });
      return;
    }

    console.log('Creating walking path with points:', points);
    const layers: L.Polyline[] = [];

    const fetchWalkingPath = async () => {
      try {
        const directPath = L.polyline(points, {
          color: 'purple',
          weight: 2,
          opacity: 0.4,
          dashArray: '5, 10',
        }).addTo(map);
        layers.push(directPath);

        for (let i = 0; i < points.length - 1; i++) {
          const start = points[i];
          const end = points[i + 1];
          
          console.log(`Fetching walking path segment ${i + 1}/${points.length - 1}`);
          
          try {
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
            );
            
            if (!response.ok) {
              throw new Error(`OSRM API error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`Received path data for segment ${i + 1}:`, data);
            
            if (!data.routes?.[0]?.geometry?.coordinates) {
              throw new Error('No route coordinates in response');
            }
            
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
            console.error(`Error fetching path segment ${i + 1}:`, error);
            const fallbackLayer = L.polyline([start, end], {
              color: 'red',
              weight: 2,
              opacity: 0.5,
              dashArray: '5, 5',
            }).addTo(map);
            layers.push(fallbackLayer);
          }
        }

        directPath.remove();
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (error) {
        console.error('Error creating walking path:', error);
      }
    };

    fetchWalkingPath();

    return () => {
      layers.forEach(layer => layer.remove());
    };
  }, [points, map]);

  return null;
};