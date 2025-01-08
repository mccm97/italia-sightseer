import { DirectionStep } from '@/types/route';

export async function getDirections(waypoints: [number, number][]): Promise<DirectionStep[]> {
  try {
    console.log('Getting directions for waypoints:', waypoints);
    
    if (waypoints.length < 2) {
      throw new Error('Servono almeno due punti per calcolare le direzioni');
    }

    // Formatta i waypoint per OSRM
    const coordinates = waypoints
      .map(point => `${point[1]},${point[0]}`)
      .join(';');
    
    console.log('Formatted coordinates for OSRM:', coordinates);

    const response = await fetch(
      `https://router.project-osrm.org/route/v1/foot/${coordinates}?steps=true&geometries=geojson`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch directions from OSRM');
    }

    const data = await response.json();
    
    if (!data.routes || !data.routes[0] || !data.routes[0].legs) {
      throw new Error('Invalid response from OSRM');
    }

    const steps = data.routes[0].legs.flatMap((leg: any) => leg.steps);
    
    return steps.map((step: any) => ({
      instruction: step.maneuver.type,
      distance: Math.round(step.distance),
      duration: Math.round(step.duration)
    }));
  } catch (error) {
    console.error('Error fetching directions:', error);
    throw error;
  }
}