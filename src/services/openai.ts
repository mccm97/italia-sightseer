
import { supabase } from '@/integrations/supabase/client';

export interface OpenAIRequest {
  prompt: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface OpenAIResponse {
  content: string;
  isDemo?: boolean;
  error?: string;
}

export enum AIPromptType {
  BLOG_POST = 'blog_post',
  ROUTE_CREATION = 'route_creation',
  CITY_INFO = 'city_info',
  MONUMENT_INFO = 'monument_info',
}

export const generateAIContent = async (
  requestData: OpenAIRequest
): Promise<OpenAIResponse> => {
  try {
    console.log('Generating AI content with prompt:', requestData.prompt);
    
    const { data, error } = await supabase.functions.invoke('openai-assistant', {
      body: {
        prompt: requestData.prompt,
        model: requestData.model || 'gpt-4o-mini',
        max_tokens: requestData.max_tokens || 1000,
        temperature: requestData.temperature || 0.7,
      },
    });

    if (error) {
      console.error('Error calling OpenAI API:', error);
      return { content: '', error: error.message };
    }

    console.log('AI content generated successfully');
    return { 
      content: data.content,
      isDemo: data.isDemo || false
    };
  } catch (error: any) {
    console.error('Error in generateAIContent:', error);
    return { content: '', error: error.message };
  }
};

export const generateBlogPostContent = async (cityName: string, language: string = 'it') => {
  const prompt = language === 'it' 
    ? `Scrivi un dettagliato articolo sulla città di ${cityName}. Includi informazioni sulla storia, cultura, attrazioni principali, cucina locale e consigli di viaggio. L'articolo deve essere in italiano, informativo e coinvolgente per i lettori interessati a visitare ${cityName}.`
    : `Write a detailed article about the city of ${cityName}. Include information about its history, culture, main attractions, local cuisine, and travel tips. The article should be informative and engaging for readers interested in visiting ${cityName}.`;
  
  return generateAIContent({ prompt, max_tokens: 1500 });
};

export const generateRouteContent = async (
  cityName: string,
  attractionsCount: number = 5,
  language: string = 'it'
) => {
  const prompt = language === 'it'
    ? `Crea un percorso turistico ottimale per la città di ${cityName} con ${attractionsCount} attrazioni principali. Per ogni attrazione, fornisci il nome, una breve descrizione, il tempo di visita consigliato in minuti e il prezzo stimato in euro. Restituisci i dati in formato JSON con la seguente struttura: { "routeName": "Nome del percorso", "attractions": [{ "name": "Nome attrazione", "visitDuration": 60, "price": 10 }] }`
    : `Create an optimal tourist route for the city of ${cityName} with ${attractionsCount} main attractions. For each attraction, provide the name, a brief description, the recommended visit time in minutes, and the estimated price in euros. Return the data in JSON format with the following structure: { "routeName": "Route name", "attractions": [{ "name": "Attraction name", "visitDuration": 60, "price": 10 }] }`;
  
  return generateAIContent({ prompt, max_tokens: 1000 });
};

export const generateCityInfo = async (cityName: string, country: string, language: string = 'it') => {
  const prompt = language === 'it'
    ? `Fornisci informazioni dettagliate sulla città di ${cityName} in ${country}, comprese le coordinate geografiche (latitudine e longitudine), i monumenti principali e altre informazioni rilevanti. Restituisci i dati in formato JSON con la seguente struttura: { "name": "${cityName}", "country": "${country}", "lat": latitude, "lng": longitude }`
    : `Provide detailed information about the city of ${cityName} in ${country}, including geographic coordinates (latitude and longitude), major monuments, and other relevant information. Return the data in JSON format with the following structure: { "name": "${cityName}", "country": "${country}", "lat": latitude, "lng": longitude }`;
  
  return generateAIContent({ prompt, max_tokens: 800 });
};

export const generateMonumentInfo = async (monumentName: string, cityName: string, language: string = 'it') => {
  const prompt = language === 'it'
    ? `Fornisci informazioni dettagliate sul monumento/attrazione "${monumentName}" nella città di ${cityName}, comprese le coordinate geografiche (latitudine e longitudine), il tempo di visita consigliato in minuti e il prezzo stimato in euro. Restituisci i dati in formato JSON con la seguente struttura: { "name": "${monumentName}", "city": "${cityName}", "lat": latitude, "lng": longitude, "visitDuration": minutes, "price": euros }`
    : `Provide detailed information about the monument/attraction "${monumentName}" in the city of ${cityName}, including geographic coordinates (latitude and longitude), recommended visit time in minutes, and estimated price in euros. Return the data in JSON format with the following structure: { "name": "${monumentName}", "city": "${cityName}", "lat": latitude, "lng": longitude, "visitDuration": minutes, "price": euros }`;
  
  return generateAIContent({ prompt, max_tokens: 800 });
};

export const improveText = async (text: string, language: string = 'it') => {
  const prompt = language === 'it'
    ? `Correggi e migliora il seguente testo, mantenendo il significato originale ma migliorando la grammatica, la sintassi e la leggibilità: "${text}"`
    : `Correct and improve the following text, maintaining the original meaning but improving grammar, syntax, and readability: "${text}"`;
  
  return generateAIContent({ prompt, max_tokens: text.length * 1.5 });
};
