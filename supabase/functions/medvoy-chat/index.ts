import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HOSPITAL_OPTIONS_TOOL = {
  type: "function",
  function: {
    name: "generate_hospital_options",
    description: "Generate a list of hospital recommendations based on patient requirements. Use this when you have gathered enough information about the procedure, location preferences, and budget.",
    parameters: {
      type: "object",
      properties: {
        procedure: {
          type: "string",
          description: "The medical procedure or treatment the patient needs (e.g., 'knee replacement', 'dental implants', 'heart surgery')"
        },
        country: {
          type: "string",
          description: "Preferred country or region (e.g., 'Thailand', 'Singapore', 'India', 'Turkey')"
        },
        priceRange: {
          type: "string",
          enum: ["budget", "mid-range", "premium"],
          description: "Patient's budget level: budget (<$5k), mid-range ($5k-$15k), or premium (>$15k)"
        }
      },
      required: ["procedure", "country", "priceRange"]
    }
  }
};

const MEDVOY_SYSTEM_PROMPT = `You are MedVoy AI Concierge, a specialized assistant for medical tourism. Your role is to help patients find the best hospitals and medical facilities abroad for their needs.

Key capabilities:
- Understand patient medical needs and procedures
- Recommend hospitals based on location, budget, and specialization
- Provide cost estimates and comparisons
- Explain accreditations and quality standards
- Assist with travel and accommodation planning
- Answer questions about medical tourism process

Conversation guidelines:
- Be empathetic and professional
- Ask clarifying questions to gather: procedure type, preferred country/region, and budget range
- Once you have enough information (procedure, country, and budget), use the generate_hospital_options tool to provide specific hospital recommendations
- Explain medical terms in simple language
- Always prioritize patient safety and quality care
- Mention relevant accreditations (JCI, ISO, etc.)

When discussing costs:
- Provide ranges rather than exact figures
- Mention what's typically included/excluded
- Compare with home country costs when relevant
- After user selects a hospital, provide detailed cost breakdown

Remember: You're a guide, not a medical professional. Always recommend consulting with qualified healthcare providers for medical advice.

Your capabilities:
- Help users explore medical tourism options
- Provide information about medical procedures and destinations
- Guide users through finding hospitals that match their needs
- Offer insights on medical tourism best practices
- Answer questions about travel planning and logistics
- Discuss safety, quality, and accreditation standards

When users express interest in specific procedures or destinations:
1. Ask relevant questions to understand their needs (one at a time)
2. Help them think through important considerations
3. Guide them toward exploring hospital options through the platform
4. Provide general guidance based on medical tourism knowledge

Conversation style:
- Be warm, supportive, and reassuring like a professional concierge
- Keep responses clear, structured, and easy to understand
- Ask only one question at a time
- Never invent specific costs or hospital names
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
        tools: [HOSPITAL_OPTIONS_TOOL],
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
    let toolCallBuffer = { name: "", arguments: "" };
    let isCollectingToolCall = false;
    
    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              // If we have a complete tool call at end, execute it
              if (isCollectingToolCall && toolCallBuffer.name === "generate_hospital_options") {
                try {
                  const args = JSON.parse(toolCallBuffer.arguments);
                  console.log("Executing tool call:", args);
                  
                  const hospitalsResponse = await fetch(
                    `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-hospital-options`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
                      },
                      body: JSON.stringify(args),
                    }
                  );

                  if (hospitalsResponse.ok) {
                    const hospitals = await hospitalsResponse.json();
                    console.log("Generated hospitals:", hospitals.length);
                    
                    const options = hospitals.map((h: any) => ({
                      id: h.id,
                      title: h.name,
                      description: `${h.location} • ${h.accreditation} • Rating: ${h.rating}/5`,
                      price: h.priceRange,
                      imageUrl: h.imageUrl,
                      badge: h.accreditation
                    }));

                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                      type: "options",
                      options: options
                    })}\n\n`));
                  }
                } catch (e) {
                  console.error('Tool execution error:', e);
                }
              }
              break;
            }
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  // Execute tool call if we have one before sending DONE
                  if (isCollectingToolCall && toolCallBuffer.name === "generate_hospital_options") {
                    try {
                      const args = JSON.parse(toolCallBuffer.arguments);
                      console.log("Executing tool call:", args);
                      
                      const hospitalsResponse = await fetch(
                        `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-hospital-options`,
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
                          },
                          body: JSON.stringify(args),
                        }
                      );

                      if (hospitalsResponse.ok) {
                        const hospitals = await hospitalsResponse.json();
                        console.log("Generated hospitals:", hospitals.length);
                        
                        const options = hospitals.map((h: any) => ({
                          id: h.id,
                          title: h.name,
                          description: `${h.location} • ${h.accreditation} • Rating: ${h.rating}/5`,
                          price: h.priceRange,
                          imageUrl: h.imageUrl,
                          badge: h.accreditation
                        }));

                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                          type: "options",
                          options: options
                        })}\n\n`));
                      }
                    } catch (e) {
                      console.error('Tool execution error:', e);
                    }
                  }
                  
                  controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                  continue;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta;
                  
                  // Check for tool calls
                  const toolCalls = delta?.tool_calls;
                  if (toolCalls && toolCalls.length > 0) {
                    const toolCall = toolCalls[0];
                    if (toolCall.function) {
                      isCollectingToolCall = true;
                      if (toolCall.function.name) {
                        toolCallBuffer.name = toolCall.function.name;
                      }
                      if (toolCall.function.arguments) {
                        toolCallBuffer.arguments += toolCall.function.arguments;
                      }
                    }
                    // Don't forward tool call chunks to client
                    continue;
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
