
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
      : prompt.includes('città di')
        ? prompt.split('città di ')[1].split('.')[0] 
        : 'this destination';
      
    return {
      content: `# Exploring ${cityName}

This is a preview of AI-generated content. To generate a complete article about ${cityName}, you'll need to set up an OpenAI API key.

## What You'll See With an API Key
With a valid OpenAI API key, you would receive a complete article covering:
- The rich history and cultural background of ${cityName}
- Top attractions and must-visit sites
- Local cuisine and dining recommendations
- Practical travel tips and best times to visit
- Insider recommendations for an authentic experience

## Setting Up Your API Key
To enable full AI article generation:
1. Sign up for an OpenAI API key at openai.com
2. Add the key to your Supabase project settings
3. Enjoy comprehensive, detailed travel content`,
      isDemo: true
    };
  }
  
  // For text improvement requests
  if (prompt.includes('Correggi e migliora') || prompt.includes('Correct and improve')) {
    const originalText = prompt.includes('text')
      ? prompt.split('text: "')[1].split('"')[0]
      : prompt.split('testo: "')[1].split('"')[0];
    
    return {
      content: originalText + "\n\n[This is a preview. Connect an OpenAI API key to access the full text improvement feature.]",
      isDemo: true
    };
  }

  // For route generation
  if (prompt.includes('tourist route') || prompt.includes('percorso turistico')) {
    const cityName = prompt.includes('city of') 
      ? prompt.split('city of ')[1].split(' with')[0]
      : prompt.includes('città di')
        ? prompt.split('città di ')[1].split(' con')[0] 
        : 'the selected city';
    
    return {
      content: JSON.stringify({
        routeName: `${cityName} Highlights Tour (Preview)`,
        attractions: [
          { name: "Main Attraction (Preview)", visitDuration: A60, price: 15 },
          { name: "Historical Site (Preview)", visitDuration: 45, price: 10 },
          { name: "Local Market (Preview)", visitDuration: 90, price: 0 }
        ],
        isDemo: true
      }),
      isDemo: true
    };
  }

  // Default response
  return {
    content: "This is a preview. Connect an OpenAI API key to generate complete content.",
    isDemo: true
  };
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
      const fallbackResponse = generateFallbackContent(prompt);
      
      return new Response(
        JSON.stringify(fallbackResponse),
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
        const fallbackResponse = generateFallbackContent(prompt);
        return new Response(
          JSON.stringify(fallbackResponse),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const content = data.choices[0].message.content;
      return new Response(
        JSON.stringify({ content, isDemo: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      console.error('Error calling OpenAI API:', fetchError);
      const fallbackResponse = generateFallbackContent(prompt);
      return new Response(
        JSON.stringify(fallbackResponse),
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
