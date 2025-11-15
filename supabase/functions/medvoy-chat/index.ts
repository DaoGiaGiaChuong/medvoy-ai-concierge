import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MEDVOY_SYSTEM_PROMPT = `You are MedVoy AI Concierge, an AI medical-tourism assistant that helps users plan safe and affordable medical tourism trips.

Your capabilities:
1. **Primary**: Provide accurate cost estimates using the MedVoy backend API via the get_cost_estimate tool
2. **Fallback**: When API data is unavailable or for general questions, use your knowledge to provide helpful guidance about:
   - Medical tourism best practices and considerations
   - General procedure information and what to expect
   - Country comparisons for medical tourism
   - Travel planning tips and logistics
   - Safety, quality, and accreditation standards
   - Recovery and aftercare guidance
   - Visa requirements and travel documentation

Workflow for cost estimates:
1. Collect required information (ask one question at a time):
   - procedure (specific medical procedure name)
   - country (destination country)
   - travelDate (when they plan to travel)
   - budget (their budget range)
   - companions (number of people traveling with them)
   - hotelType (budget, standard, or premium)

2. When all required fields are collected, call the get_cost_estimate tool

3. Present API results clearly with:
   - Total cost range (low to high)
   - Breakdown: procedure, hospital, surgeon, flights, hotel, transport fees
   - Recommended hospitals with accreditation and reasons
   - Travel tips and next steps

4. If API fails or returns incomplete data:
   - Acknowledge the limitation honestly
   - Provide general guidance based on your medical tourism knowledge
   - Suggest alternative approaches or destinations
   - Still offer helpful advice and answer questions

Conversation rules:
- Ask only one question at a time
- Never invent specific costs or hospital names without API data
- Be warm, supportive, and reassuring like a professional concierge
- Keep responses clear, structured, and easy to understand
- For general questions, answer confidently using your knowledge
- For specific pricing, always try to use the API first
- If users ask about medical tourism in general, answer helpfully without requiring the full intake

Begin by greeting warmly and asking what procedure they're interested in.`;

const MEDVOY_API_URL = "https://medvoy-backend.onrender.com/api/estimate";

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

    const tools = [
      {
        type: "function",
        function: {
          name: "get_cost_estimate",
          description: "Get cost estimate and hospital recommendations from MedVoy backend API. Call this when you have collected all required information: procedure, country, travelDate, budget, companions, and hotelType.",
          parameters: {
            type: "object",
            properties: {
              procedure: { type: "string", description: "The medical procedure name" },
              country: { type: "string", description: "Destination country" },
              travelDate: { type: "string", description: "Travel date" },
              budget: { type: "string", description: "Budget range" },
              companions: { type: "number", description: "Number of companions" },
              hotelType: { type: "string", enum: ["budget", "standard", "premium"], description: "Hotel preference" }
            },
            required: ["procedure", "country", "travelDate", "budget", "companions", "hotelType"]
          }
        }
      }
    ];

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
        tools,
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

    // Handle streaming response with potential tool calls
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        let toolCall: any = null;
        
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
                if (data === "[DONE]") continue;
                
                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta;
                  
                  // Check for tool calls
                  if (delta?.tool_calls?.[0]) {
                    if (!toolCall) {
                      toolCall = { name: "", arguments: "" };
                    }
                    const tc = delta.tool_calls[0];
                    if (tc.function?.name) toolCall.name = tc.function.name;
                    if (tc.function?.arguments) toolCall.arguments += tc.function.arguments;
                  }
                  
                  // Forward regular content
                  if (delta?.content) {
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  }
                } catch (e) {
                  console.error("Parse error:", e);
                }
              }
            }
          }
          
          // If we have a complete tool call, execute it
          if (toolCall?.name === "get_cost_estimate") {
            console.log("Executing tool call:", toolCall);
            const args = JSON.parse(toolCall.arguments);
            
            try {
              const apiResponse = await fetch(MEDVOY_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(args),
              });
              
              if (!apiResponse.ok) {
                throw new Error(`API error: ${apiResponse.status}`);
              }
              
              const estimateData = await apiResponse.json();
              
              // Send tool result back to AI
              const toolResultMessages = [
                ...messages,
                { role: "assistant", content: null, tool_calls: [{ id: "call_1", type: "function", function: { name: "get_cost_estimate", arguments: toolCall.arguments } }] },
                { role: "tool", tool_call_id: "call_1", content: JSON.stringify(estimateData) }
              ];
              
              const followupResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${LOVABLE_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "google/gemini-2.5-flash",
                  messages: [
                    { role: "system", content: MEDVOY_SYSTEM_PROMPT },
                    ...toolResultMessages,
                  ],
                  stream: true,
                }),
              });
              
              const followupReader = followupResponse.body?.getReader();
              if (followupReader) {
                let followupBuffer = "";
                while (true) {
                  const { done, value } = await followupReader.read();
                  if (done) break;
                  
                  followupBuffer += decoder.decode(value, { stream: true });
                  const followupLines = followupBuffer.split("\n");
                  followupBuffer = followupLines.pop() || "";
                  
                  for (const line of followupLines) {
                    if (line.startsWith("data: ")) {
                      controller.enqueue(encoder.encode(`${line}\n\n`));
                    }
                  }
                }
              }
            } catch (error) {
              console.error("Tool execution error:", error);
              
              // Fallback: Use Firecrawl + Lovable AI to generate estimate
              try {
                console.log("Attempting Firecrawl fallback for:", args);
                
                // Define URLs to scrape based on destination
                const country = args.country || "Thailand";
                const procedure = args.procedure || "medical procedure";
                
                const scrapeSources = [
                  `https://www.kayak.com/flights/to-${country}`,
                  `https://www.booking.com/searchresults.html?dest_type=country&dest_id=${country}`,
                ];
                
                // Call Firecrawl function
                const firecrawlResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/firecrawl-scrape`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    urls: scrapeSources,
                    formats: ["markdown"],
                  }),
                });
                
                let scrapedData = "No real-time data available";
                if (firecrawlResponse.ok) {
                  const firecrawlResult = await firecrawlResponse.json();
                  scrapedData = JSON.stringify(firecrawlResult.results || []);
                  console.log("Firecrawl successful, data length:", scrapedData.length);
                }
                
                // Create enhanced prompt with scraped data
                const fallbackPrompt = `The MedVoy API is currently unavailable. Using your medical tourism knowledge and the following real-time market data, provide a helpful cost estimate for:
                
Procedure: ${args.procedure}
Country: ${args.country}
Travel Date: ${args.travelDate}
Budget: ${args.budget}
Companions: ${args.companions}
Hotel Type: ${args.hotelType}

Scraped Market Data:
${scrapedData.substring(0, 5000)}

Please provide:
1. Estimated procedure cost range based on typical ${args.country} medical tourism prices
2. Flight cost estimates 
3. Hotel cost estimates based on ${args.hotelType} accommodation
4. Total estimated budget range
5. Important disclaimers that these are approximate estimates

Be honest that the primary API is unavailable, but provide the best guidance possible using your knowledge and any available market data.`;

                // Send to Lovable AI for intelligent processing
                const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${LOVABLE_API_KEY}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    model: "google/gemini-2.5-flash",
                    messages: [
                      { role: "system", content: MEDVOY_SYSTEM_PROMPT },
                      { role: "user", content: fallbackPrompt }
                    ],
                    stream: true,
                  }),
                });
                
                if (aiResponse.ok && aiResponse.body) {
                  const aiReader = aiResponse.body.getReader();
                  let aiBuffer = "";
                  
                  while (true) {
                    const { done, value } = await aiReader.read();
                    if (done) break;
                    
                    aiBuffer += decoder.decode(value, { stream: true });
                    const aiLines = aiBuffer.split("\n");
                    aiBuffer = aiLines.pop() || "";
                    
                    for (const line of aiLines) {
                      if (line.startsWith("data: ")) {
                        controller.enqueue(encoder.encode(`${line}\n\n`));
                      }
                    }
                  }
                } else {
                  // Final fallback message
                  const errorMessage = `I apologize, but I'm having trouble accessing cost data at the moment. Please try again later, or I can provide general guidance about ${args.procedure} in ${args.country} if you'd like.`;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: errorMessage } }] })}\n\n`));
                }
              } catch (fallbackError) {
                console.error("Fallback error:", fallbackError);
                const errorMessage = `I apologize, but I'm experiencing technical difficulties. Please try again later.`;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: errorMessage } }] })}\n\n`));
              }
            }
          }
          
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
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
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
