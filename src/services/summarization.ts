import { Attraction } from '@/data/routes';

export async function generateSummary(attractions: Attraction[]): Promise<string> {
  // Simulazione di chiamata ad un'API di NLP gratuita per generare il sommario
  const summary = attractions.map(attr => attr.name).join(', ');
  return `Questo percorso include le seguenti attrazioni: ${summary}.`;
}
