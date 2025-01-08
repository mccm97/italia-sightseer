import axios from 'axios';

interface DirectionStep {
  instruction: string;
  distance: number;
  duration: number;
}

export async function getDirections(waypoints: [number, number][]): Promise<DirectionStep[]> {
  try {
    console.log('Getting directions for waypoints:', waypoints);
    
    // Format waypoints for Geoapify
    const waypointsString = waypoints
      .map(point => `${point[0]},${point[1]}`)
      .join('|');
    
    console.log('Formatted waypoints string:', waypointsString);

    const response = await axios.get(
      `https://api.geoapify.com/v1/routing`,
      {
        params: {
          waypoints: waypointsString,
          mode: 'walk',
          apiKey: '4e26196999fd47879ca7b7fee264aa4d'
        }
      }
    );

    console.log('Geoapify response:', response.data);

    if (!response.data || !response.data.features || !response.data.features[0]) {
      throw new Error('Invalid response from Geoapify');
    }

    const route = response.data.features[0];
    return route.properties.legs[0].steps.map((step: any) => ({
      instruction: step.instruction,
      distance: Math.round(step.distance),
      duration: Math.round(step.time)
    }));
  } catch (error) {
    console.error('Error fetching directions:', error);
    throw error;
  }
}