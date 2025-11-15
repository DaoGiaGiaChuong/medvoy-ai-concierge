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
    const FREEPIK_API_KEY = Deno.env.get('FREEPIK_API_KEY');
    
    if (!FREEPIK_API_KEY) {
      console.error('FREEPIK_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Freepik API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { query, limit = 10, page = 1 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching Freepik for: "${query}", limit: ${limit}, page: ${page}`);

    const freepikUrl = new URL('https://api.freepik.com/v1/resources');
    freepikUrl.searchParams.append('term', query);
    freepikUrl.searchParams.append('limit', limit.toString());
    freepikUrl.searchParams.append('page', page.toString());

    const response = await fetch(freepikUrl.toString(), {
      method: 'GET',
      headers: {
        'x-freepik-api-key': FREEPIK_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Freepik API error (${response.status}):`, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch images from Freepik',
          details: errorText,
          status: response.status 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`Successfully retrieved ${data.data?.length || 0} images from Freepik`);

    return new Response(
      JSON.stringify({
        success: true,
        query,
        page,
        limit,
        total: data.meta?.total || 0,
        images: data.data || [],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in freepik-search function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        details: errorMessage 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
