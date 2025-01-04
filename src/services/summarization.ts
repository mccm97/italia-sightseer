import { Attraction } from '@/types/route';

export async function generateSummary(attractions: Attraction[]): Promise<string> {
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

export async function generateAttractionSummary(attractionName: string): Promise<string> {
  // Simulazione di chiamata ad un'API di NLP gratuita per generare il sommario
  return `Riassunto della storia e delle caratteristiche di ${attractionName}.`;
}
