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
    const BOOKING_API_KEY = Deno.env.get('BOOKING_API_KEY');
    
    if (!BOOKING_API_KEY) {
      console.error('BOOKING_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Booking.com API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { 
      destination,
      checkin_date,
      checkout_date,
      adults = 1,
      currency = 'USD',
      locale = 'en-us'
    } = await req.json();

    if (!destination) {
      return new Response(
        JSON.stringify({ error: 'Destination is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching hotels in: "${destination}", checkin: ${checkin_date}, checkout: ${checkout_date}, adults: ${adults}`);

    // Using RapidAPI's Booking.com API endpoint
    // Note: Users should replace this with their actual Booking.com API endpoint if different
    const bookingUrl = new URL('https://booking-com.p.rapidapi.com/v1/hotels/search');
    bookingUrl.searchParams.append('dest_type', 'city');
    bookingUrl.searchParams.append('dest_id', destination);
    bookingUrl.searchParams.append('adults_number', adults.toString());
    bookingUrl.searchParams.append('locale', locale);
    bookingUrl.searchParams.append('currency', currency);
    
    if (checkin_date) {
      bookingUrl.searchParams.append('checkin_date', checkin_date);
    }
    if (checkout_date) {
      bookingUrl.searchParams.append('checkout_date', checkout_date);
    }

    const response = await fetch(bookingUrl.toString(), {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': BOOKING_API_KEY,
        'X-RapidAPI-Host': 'booking-com.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Booking.com API error (${response.status}):`, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch hotels from Booking.com',
          details: errorText,
          status: response.status 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`Successfully retrieved ${data.result?.length || 0} hotels from Booking.com`);

    return new Response(
      JSON.stringify({
        success: true,
        destination,
        checkin_date,
        checkout_date,
        adults,
        currency,
        total: data.total_count || 0,
        hotels: data.result || [],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in booking-search function:', error);
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
