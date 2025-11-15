import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Hospital {
  id: string;
  name: string;
  location: string;
  country: string;
  priceRange: "budget" | "mid-range" | "premium";
  rating: number;
  imageUrl: string;
  accreditation: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const FREEPIK_API_KEY = Deno.env.get('FREEPIK_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { procedure = 'all', country = 'all', priceRange = 'all' } = await req.json();

    console.log(`Generating hospital options for: procedure=${procedure}, country=${country}, priceRange=${priceRange}`);

    // Step 1: Use Lovable AI to generate intelligent hospital suggestions
    const aiPrompt = `Generate 6 realistic medical tourism hospitals based on these filters:
- Procedure type: ${procedure}
- Country: ${country}
- Price range: ${priceRange}

For each hospital, provide:
1. Hospital name (realistic, sounds professional)
2. City and country
3. Price range (budget/mid-range/premium)
4. Rating (4.3-4.9)
5. Brief search term for finding a relevant image (e.g., "modern hospital exterior thailand", "medical facility interior")

Return as JSON array with this structure:
[
  {
    "name": "Hospital Name",
    "location": "City, Country",
    "country": "Country",
    "priceRange": "mid-range",
    "rating": 4.7,
    "imageSearchTerm": "modern hospital building"
  }
]`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a medical tourism data expert. Generate realistic hospital data in valid JSON format only. No markdown, no explanations." },
          { role: "user", content: aiPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "[]";
    
    // Parse AI response - handle markdown code blocks if present
    let hospitalsData = [];
    try {
      const cleanedContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      hospitalsData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiContent);
      hospitalsData = [];
    }

    console.log(`AI generated ${hospitalsData.length} hospitals`);

    // Step 2: Fetch images from Freepik for each hospital
    const hospitals: Hospital[] = await Promise.all(
      hospitalsData.map(async (hospital: any, index: number) => {
        let imageUrl = `https://images.unsplash.com/photo-${1519494026892 + index}?w=800`; // Fallback

        if (FREEPIK_API_KEY) {
          try {
            const freepikUrl = new URL('https://api.freepik.com/v1/resources');
            freepikUrl.searchParams.append('term', hospital.imageSearchTerm || 'modern hospital');
            freepikUrl.searchParams.append('limit', '1');

            const freepikResponse = await fetch(freepikUrl.toString(), {
              method: 'GET',
              headers: {
                'x-freepik-api-key': FREEPIK_API_KEY,
                'Content-Type': 'application/json',
              },
            });

            if (freepikResponse.ok) {
              const freepikData = await freepikResponse.json();
              if (freepikData.data && freepikData.data.length > 0) {
                imageUrl = freepikData.data[0].image?.source?.url || imageUrl;
                console.log(`Fetched Freepik image for ${hospital.name}`);
              }
            }
          } catch (freepikError) {
            console.error('Freepik error:', freepikError);
          }
        }

        return {
          id: `hospital-${index + 1}`,
          name: hospital.name,
          location: hospital.location,
          country: hospital.country,
          priceRange: hospital.priceRange,
          rating: hospital.rating,
          imageUrl,
          accreditation: "JCI Accredited",
        };
      })
    );

    console.log(`Successfully generated ${hospitals.length} hospitals with images`);

    return new Response(
      JSON.stringify({
        success: true,
        hospitals,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-hospital-options function:', error);
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
