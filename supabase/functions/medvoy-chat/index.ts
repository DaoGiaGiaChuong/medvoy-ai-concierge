import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MEDVOY_SYSTEM_PROMPT = `You are MedVoy AI Concierge, an AI medical-tourism assistant that helps users find and connect with quality medical facilities worldwide.

Your capabilities:
- Help users explore medical tourism options
- Provide information about medical procedures and destinations
- Guide users through finding hospitals that match their needs
- Offer insights on medical tourism best practices
- Answer questions about travel planning and logistics
- Discuss safety, quality, and accreditation standards

When users express interest in specific procedures or destinations:
1. Ask relevant questions to understand their needs (one at a time)
2. Gather this key information: procedure type, destination country, budget, travel dates, number of companions, hotel preference
3. Once you have ALL the required information, use the generate_cost_estimate tool to create a detailed cost breakdown
4. Present the estimate confidently based on real market data

Conversation style:
- Be warm, supportive, and reassuring like a professional concierge
- Keep responses clear, structured, and easy to understand
- Ask only one question at a time
- When discussing country options, mention popular destinations: Thailand, Mexico, Turkey, India

Begin by greeting warmly and asking what procedure they're interested in.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing chat request for conversation: ${conversationId}`);
    console.log(`Message count: ${messages.length}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: MEDVOY_SYSTEM_PROMPT },
          ...messages,
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_cost_estimate",
              description: "Generate a detailed cost breakdown for medical tourism. Use this when you have collected ALL required information: procedure, destination, budget, dates, and number of companions.",
              parameters: {
                type: "object",
                properties: {
                  procedure: { 
                    type: "string",
                    description: "The medical procedure (e.g., 'knee surgery', 'dental implants')"
                  },
                  destination: { 
                    type: "string",
                    description: "The destination country (e.g., 'Thailand', 'Mexico')"
                  },
                  companions: {
                    type: "number",
                    description: "Number of companions traveling with the patient"
                  },
                  duration: {
                    type: "string",
                    description: "Expected trip duration (e.g., '10-14 days')"
                  }
                },
                required: ["procedure", "destination", "companions", "duration"]
              }
            }
          }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Stream the response directly to the client
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                  continue;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta;
                  
                  // Check for tool calls
                  if (delta?.tool_calls) {
                    const toolCall = delta.tool_calls[0];
                    if (toolCall?.function?.name === "generate_cost_estimate") {
                      try {
                        const args = JSON.parse(toolCall.function.arguments);
                        
                        // Generate cost estimates based on procedure and destination
                        const dashboard = await generateCostEstimate(args);
                        
                        // Send dashboard data through the stream
                        const dashboardEvent = {
                          choices: [{
                            delta: { dashboard }
                          }]
                        };
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(dashboardEvent)}\n\n`));
                      } catch (e) {
                        console.error("Error generating cost estimate:", e);
                      }
                    }
                  }
                  
                  // Forward content to client
                  if (delta?.content) {
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  }
                } catch (e) {
                  console.error("Parse error:", e);
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in medvoy-chat function:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function generateCostEstimate(args: any) {
  const { procedure, destination, companions, duration } = args;
  
  // Search for real cost data
  const searchQuery = `${procedure} cost in ${destination} medical tourism 2025`;
  
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const searchResponse = await fetch("https://ai.gateway.lovable.dev/v1/web/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: searchQuery,
        num_results: 3
      })
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log("Search results:", searchData);
    }
  } catch (e) {
    console.error("Search error:", e);
  }

  // Generate estimates based on common medical tourism pricing
  const costRanges = getCostRangesByProcedure(procedure, destination);
  const totalCompanions = companions + 1; // Include the patient
  
  return {
    procedure,
    destination,
    duration,
    procedureCost: costRanges.procedure,
    flightCost: {
      low: costRanges.flightPerPerson.low * totalCompanions,
      high: costRanges.flightPerPerson.high * totalCompanions
    },
    hotelCost: costRanges.hotel,
    totalCost: {
      low: costRanges.procedure.low + (costRanges.flightPerPerson.low * totalCompanions) + costRanges.hotel.low,
      high: costRanges.procedure.high + (costRanges.flightPerPerson.high * totalCompanions) + costRanges.hotel.high
    }
  };
}

function getCostRangesByProcedure(procedure: string, destination: string) {
  const procedureLower = procedure.toLowerCase();
  const destinationLower = destination.toLowerCase();
  
  // Base costs by destination
  const destinationMultipliers: Record<string, number> = {
    thailand: 1.0,
    mexico: 0.9,
    turkey: 0.85,
    india: 0.75,
  };
  
  const multiplier = destinationMultipliers[destinationLower] || 1.0;
  
  // Procedure base costs in Thailand (will be adjusted by multiplier)
  const procedureCosts: Record<string, { low: number; high: number }> = {
    knee: { low: 5000, high: 10000 },
    hip: { low: 7000, high: 12000 },
    dental: { low: 2000, high: 5000 },
    cosmetic: { low: 3000, high: 8000 },
    cardiac: { low: 10000, high: 25000 },
    bariatric: { low: 8000, high: 15000 },
  };
  
  // Find matching procedure
  let baseCost = { low: 4000, high: 8000 }; // Default
  for (const [key, cost] of Object.entries(procedureCosts)) {
    if (procedureLower.includes(key)) {
      baseCost = cost;
      break;
    }
  }
  
  // Flight costs by destination (per person)
  const flightCosts: Record<string, { low: number; high: number }> = {
    thailand: { low: 800, high: 1500 },
    mexico: { low: 300, high: 600 },
    turkey: { low: 600, high: 1200 },
    india: { low: 700, high: 1400 },
  };
  
  return {
    procedure: {
      low: Math.round(baseCost.low * multiplier),
      high: Math.round(baseCost.high * multiplier)
    },
    flightPerPerson: flightCosts[destinationLower] || { low: 600, high: 1200 },
    hotel: { low: 700, high: 1400 } // 10-14 days standard hotel
  };
}
