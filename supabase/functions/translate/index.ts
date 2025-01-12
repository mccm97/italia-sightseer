import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: source,
        target: target,
        format: "text",
        api_key: "" // LibreTranslate allows empty API key for their demo server
      }),
    });

    if (!response.ok) {
      console.error('LibreTranslate API error:', await response.text());
      throw new Error(`LibreTranslate API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('Translation response:', data);

    if (!data.translatedText) {
      throw new Error('No translation returned');
    }

    return new Response(
      JSON.stringify({ translation: data.translatedText }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Translation error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Translation failed',
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});