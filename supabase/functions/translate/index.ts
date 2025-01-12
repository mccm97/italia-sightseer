import { serve } from 'https://deno.fresh.run/std@v9.6.1/http/server.ts';

const LIBRE_TRANSLATE_API = "https://libretranslate.de/translate";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  text: string;
  source: string;
  target: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, source, target } = await req.json() as TranslationRequest;

    console.log(`Translating from ${source} to ${target}: "${text}"`);

    const response = await fetch(LIBRE_TRANSLATE_API, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: source,
        target: target,
        format: "text"
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Translation response:', data);

    return new Response(
      JSON.stringify({ translation: data.translatedText }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: 'Translation failed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});