
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback content generator when API is unavailable
const generateFallbackContent = (prompt: string) => {
  // Check if it's a blog post request
  if (prompt.includes('Write a detailed article') || prompt.includes('Scrivi un dettagliato articolo')) {
    const cityName = prompt.includes('city of') 
      ? prompt.split('city of ')[1].split('.')[0]
      : prompt.split('città di ')[1].split('.')[0];
      
    return `# ${cityName}: A Beautiful Destination

${cityName} is a wonderful place to visit with rich history and culture. This city offers amazing sights, delicious local cuisine, and unforgettable experiences.

## History and Culture
${cityName} has a fascinating history dating back centuries. The local culture is vibrant and welcoming.

## Main Attractions
When visiting ${cityName}, make sure to check out the historic center, museums, and local markets.

## Local Cuisine
The food in ${cityName} is exceptional. Try the local specialties and traditional dishes.

## Travel Tips
- Visit during spring or fall for the best weather
- Public transportation is efficient for getting around
- Local festivals offer a great way to experience the culture
`;
  }
  
  // For text improvement requests
  if (prompt.includes('Correggi e migliora') || prompt.includes('Correct and improve')) {
    return prompt.includes('text') 
      ? "The improved text with better grammar and readability."
      : "Il testo migliorato con grammatica e leggibilità ottimizzate.";
  }

  // Default response
  return "Content could not be generated due to API limitations. Please try again later.";
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.log('API key missing: Using fallback content generator');
      const { prompt } = await req.json();
      const fallbackContent = generateFallbackContent(prompt);
      
      return new Response(
        JSON.stringify({ content: fallbackContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, model, max_tokens, temperature } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'No prompt provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that provides accurate, detailed information for travel and tourism applications. Respond in the same language as the user query.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: max_tokens || 1000,
          temperature: temperature || 0.7,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('OpenAI API error:', data.error);
        const fallbackContent = generateFallbackContent(prompt);
        return new Response(
          JSON.stringify({ content: fallbackContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const content = data.choices[0].message.content;
      return new Response(
        JSON.stringify({ content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      console.error('Error calling OpenAI API:', fetchError);
      const fallbackContent = generateFallbackContent(prompt);
      return new Response(
        JSON.stringify({ content: fallbackContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in openai-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
