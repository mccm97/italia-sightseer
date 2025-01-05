import { useState } from 'react';

interface DirectionsStep {
  instruction: string;
  distance: number;
  duration: number;
}

const isValidCoordinate = (point: [number, number]): boolean => {
  return point[0] !== 0 && point[1] !== 0 && 
         !isNaN(point[0]) && !isNaN(point[1]) &&
         Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180;
};

export const useDirections = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDirections = async (points: [number, number][]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate all points before making the API call
      const validPoints = points.filter(isValidCoordinate);
      
      if (validPoints.length < 2) {
        console.warn('Not enough valid points for directions');
        return null;
      }

      const coordinates = validPoints.map(point => `${point[1]},${point[0]}`).join(';');
      console.log('Fetching directions with coordinates:', coordinates);
      
      const response = await fetch(
        `http://router.project-osrm.org/route/v1/driving/${coordinates}?steps=true&geometries=geojson`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch directions');
      }

      const data = await response.json();
      const steps = data.routes[0].legs[0].steps;
      steps.forEach(step => {
        console.log(step.maneuver.instruction);
      });

      const directionsSteps: DirectionsStep[] = steps.map((step: any) => ({
        instruction: step.maneuver.instruction,
        distance: Math.round(step.distance),
        duration: Math.round(step.duration)
      }));

      return directionsSteps;
    } catch (err) {
      console.error('Error getting directions:', err);
      setError(err instanceof Error ? err.message : 'Failed to get directions');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { getDirections, isLoading, error };
};