import axios from 'axios';

interface DirectionStep {
  instruction: string;
  distance: number;
  duration: number;
}

export async function getDirections(start: [number, number], end: [number, number]): Promise<DirectionStep[]> {
  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/routing`,
      {
        params: {
          waypoints: `${start[0]},${start[1]}|${end[0]},${end[1]}`,
          mode: 'walk',
          apiKey: '4e26196999fd47879ca7b7fee264aa4d'
        }
      }
    );

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