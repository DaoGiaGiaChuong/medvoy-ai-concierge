import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!FIRECRAWL_API_KEY) {
      console.error('FIRECRAWL_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Firecrawl API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { urls, formats = ['markdown'] } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'URLs array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Scraping ${urls.length} URLs with Firecrawl:`, urls);

    // Scrape multiple URLs in parallel
    const scrapePromises = urls.map(async (url: string) => {
      try {
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            formats,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Firecrawl API error for ${url} (${response.status}):`, errorText);
          return {
            url,
            success: false,
            error: errorText,
            status: response.status
          };
        }

        const data = await response.json();
        console.log(`Successfully scraped ${url}`);
        return {
          url,
          success: true,
          data: data.data
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error scraping ${url}:`, errorMessage);
        return {
          url,
          success: false,
          error: errorMessage
        };
      }
    });

    const results = await Promise.all(scrapePromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`Scraping complete: ${successful.length} successful, ${failed.length} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        total: urls.length,
        successful: successful.length,
        failed: failed.length,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in firecrawl-scrape function:', error);
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
