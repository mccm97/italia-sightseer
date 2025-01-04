import { Attraction } from '@/types/route';

export async function generateSummary(attractions: Attraction[]): Promise<string> {
  // For now, we'll create a simple summary by listing the attractions
  const attractionNames = attractions.map(attr => attr.name);
  
  if (attractionNames.length === 0) {
    return "Questo percorso non contiene attrazioni.";
  }

  if (attractionNames.length === 1) {
    return `Questo percorso include la visita di ${attractionNames[0]}.`;
  }

  const lastAttraction = attractionNames.pop();
  return `Questo percorso include la visita di ${attractionNames.join(', ')} e ${lastAttraction}.`;
}