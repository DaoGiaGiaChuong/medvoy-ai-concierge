import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MEDVOY_SYSTEM_PROMPT = `You are MedVoy AI Concierge, an AI medical-tourism assistant that provides transparent cost estimates and hospital recommendations using MedVoy's backend API.

Your job:
1. Intake the user's medical procedure, destination preferences, travel date, budget, companions, and hotel type.
2. Validate missing information with friendly follow-up questions - ask only ONE question at a time.
3. When you have collected: procedure, country, travelDate, budget, companions (number), and hotelType (budget/standard/premium), use the get_cost_estimate tool to fetch real pricing data.
4. Present the API results clearly with:
   - Estimated low & high total cost
   - A breakdown: procedure fee, hospital fee, surgeon fee, flights, hotel, transport
   - Recommended hospitals with accreditation and reasons
5. Conversation rules:
   - Ask only one question at a time
   - Never guess medical details — always confirm with user
   - Respond like a warm, helpful concierge
   - Keep things simple, structured, and reassuring
6. If API returns an error:
   - Apologize briefly
   - Ask the user to re-enter missing or invalid fields
7. If user asks for:
   - Packages → summarize recommended hospitals and cost ranges
   - Comparison → compare countries or hospitals using API data
   - Custom itinerary → include flight, hotel, procedure windows based on estimate

You must always use the get_cost_estimate tool for pricing — never make up numbers.

Begin by greeting the user and asking: "Hi! I'm MedVoy AI Concierge. What medical procedure are you planning for your upcoming medical trip?"`;

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
              const errorMessage = `I apologize, but I encountered an error fetching the cost estimate. Please try again or verify your information.`;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: errorMessage } }] })}\n\n`));
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
