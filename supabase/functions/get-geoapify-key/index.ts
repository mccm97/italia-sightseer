import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type } = await req.json();
    console.log('Retrieving Geoapify key for type:', type);

    // Get the appropriate key based on the type
    const key = type === 'places' 
      ? Deno.env.get('GEOAPIFY_PLACES_KEY')
      : Deno.env.get('GEOAPIFY_ROUTING_KEY');

    if (!key) {
      console.error(`No Geoapify ${type} key found in environment`);
      return new Response(
        JSON.stringify({ error: `Geoapify ${type} key not configured` }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ key }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in get-geoapify-key function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});