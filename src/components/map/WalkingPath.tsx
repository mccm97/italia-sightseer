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

    const createFallbackPath = (start: [number, number], end: [number, number]) => {
      console.log('Creating fallback direct path between:', { start, end });
      return L.polyline([start, end], {
        color: 'red',
        weight: 2,
        opacity: 0.5,
        dashArray: '5, 5',
      });
    };

    const fetchWithRetry = async (url: string, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return await response.json();
        } catch (error) {
          console.error(`Attempt ${i + 1} failed:`, error);
          if (i === retries - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        }
      }
    };

    const fetchWalkingPath = async () => {
      try {
        // Create initial bounds
        const bounds = L.latLngBounds(points);
        
        for (let i = 0; i < points.length - 1; i++) {
          const start = points[i];
          const end = points[i + 1];
          
          console.log(`Processing path segment ${i + 1}/${points.length - 1}:`, {
            start,
            end
          });
          
          try {
            const url = `https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
            console.log('Fetching route from URL:', url);
            
            const data = await fetchWithRetry(url);
            
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
            
            // Extend bounds with the new path
            pathCoords.forEach(coord => bounds.extend(coord));
          } catch (error) {
            console.warn(`Failed to fetch walking path for segment ${i + 1}:`, error);
            console.log('Creating fallback direct path...');
            
            const fallbackLayer = createFallbackPath(start, end).addTo(map);
            layers.push(fallbackLayer);
            
            // Extend bounds with the fallback path
            bounds.extend(start).extend(end);
          }
        }

        // Fit bounds with padding after all segments are processed
        map.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 15
        });
      } catch (error) {
        console.error('Error creating complete walking path:', error);
        
        // Create complete fallback path if everything fails
        const fallbackLayer = L.polyline(points, {
          color: 'red',
          weight: 2,
          opacity: 0.5,
          dashArray: '5, 5',
        }).addTo(map);
        
        layers.push(fallbackLayer);
        
        // Fit bounds to the fallback path
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 15
        });
      }
    };

    fetchWalkingPath();

    return () => {
      layers.forEach(layer => layer.remove());
    };
  }, [points, map]);

  return null;
};