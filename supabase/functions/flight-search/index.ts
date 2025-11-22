import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destination, departureDate, returnDate, passengers = 1 }: FlightSearchRequest = await req.json();
    
    console.log('Flight search request:', { origin, destination, departureDate, returnDate, passengers });

    // Generate flight options based on route
    const flights = generateFlightOptions(origin, destination, departureDate, returnDate, passengers);

    return new Response(
      JSON.stringify({ flights }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in flight-search:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function generateFlightOptions(origin: string, destination: string, departureDate: string, returnDate: string | undefined, passengers: number) {
  const airlines = [
    { name: 'Emirates', logo: '🛫' },
    { name: 'Qatar Airways', logo: '✈️' },
    { name: 'Singapore Airlines', logo: '🛩️' },
    { name: 'Turkish Airlines', logo: '🛬' },
  ];

  const basePrice = calculateBasePrice(origin, destination);
  
  return airlines.map((airline, index) => {
    const price = basePrice + (index * 150) + (Math.random() * 200);
    const duration = calculateFlightDuration(origin, destination);
    const stops = index === 0 ? 0 : index === 1 ? 1 : Math.floor(Math.random() * 2);
    
    return {
      id: `flight-${index + 1}`,
      airline: airline.name,
      logo: airline.logo,
      origin,
      destination,
      departureDate,
      returnDate,
      price: Math.round(price * passengers),
      currency: 'USD',
      duration: `${duration}h`,
      stops: stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`,
      departureTime: generateDepartureTime(index),
      arrivalTime: generateArrivalTime(index, duration),
      passengers,
      bookingUrl: `https://www.google.com/travel/flights?q=${encodeURIComponent(`${origin} to ${destination}`)}`,
    };
  });
}

function calculateBasePrice(origin: string, destination: string): number {
  // Base prices for different route types
  const shortHaul = 200; // < 3 hours
  const mediumHaul = 500; // 3-7 hours
  const longHaul = 800; // > 7 hours
  
  const duration = calculateFlightDuration(origin, destination);
  
  if (duration < 3) return shortHaul;
  if (duration < 7) return mediumHaul;
  return longHaul;
}

function calculateFlightDuration(origin: string, destination: string): number {
  // Simplified duration calculation based on typical routes
  const destinations = destination.toLowerCase();
  
  if (destinations.includes('thailand') || destinations.includes('bangkok')) return 12;
  if (destinations.includes('turkey') || destinations.includes('istanbul')) return 10;
  if (destinations.includes('india')) return 8;
  if (destinations.includes('singapore')) return 14;
  if (destinations.includes('malaysia')) return 13;
  if (destinations.includes('korea')) return 11;
  
  return 10; // Default
}

function generateDepartureTime(index: number): string {
  const hours = [8, 11, 15, 20];
  const hour = hours[index % hours.length];
  return `${hour.toString().padStart(2, '0')}:${(index * 15) % 60}`;
}

function generateArrivalTime(index: number, duration: number): string {
  const departureHour = [8, 11, 15, 20][index % 4];
  const arrivalHour = (departureHour + Math.floor(duration)) % 24;
  const arrivalMinute = (index * 15 + (duration % 1) * 60) % 60;
  return `${arrivalHour.toString().padStart(2, '0')}:${Math.floor(arrivalMinute).toString().padStart(2, '0')}`;
}
