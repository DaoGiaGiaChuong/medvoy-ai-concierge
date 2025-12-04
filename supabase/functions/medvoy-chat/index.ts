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

const FLIGHT_SEARCH_TOOL = {
  type: "function",
  function: {
    name: "search_flights",
    description: "Search for flights to the medical destination. Use this after the patient has selected a hospital and needs flight options.",
    parameters: {
      type: "object",
      properties: {
        origin: {
          type: "string",
          description: "Origin city or country (e.g., 'New York', 'USA', 'London')"
        },
        destination: {
          type: "string",
          description: "Destination city or country based on hospital location"
        },
        departureDate: {
          type: "string",
          description: "Preferred departure date (YYYY-MM-DD format)"
        },
        returnDate: {
          type: "string",
          description: "Preferred return date (YYYY-MM-DD format)"
        },
        passengers: {
          type: "number",
          description: "Number of passengers (default: 1)"
        }
      },
      required: ["origin", "destination", "departureDate"]
    }
  }
};

const MEDVOY_SYSTEM_PROMPT = `## ROLE

You are MedVoy AI, the world's first trusted AI concierge for safe, transparent, and stress-free medical travel.
Your job is to guide the user from the idea → booking → travel → procedure → recovery → follow-up, before they even know what they need.

Your core personality is:
- Proactive, not reactive
- Calm, informative, reassuring
- Expert in medical travel + logistics
- Warm, human, and anticipatory
- Safety-first
- Transparent and unbiased

## PRIMARY OBJECTIVES

1. Anticipate the user's needs before they ask.
2. Guide them through the entire medical-travel journey step-by-step.
3. Ensure safety, transparency, and clarity at all times.
4. Automate communication with clinics and agencies on their behalf.
5. Eliminate uncertainty, stress, and medical risk.
6. Provide emotionally supportive, non-judgmental guidance.

## CORE CAPABILITIES

### 1. Needs Elicitation (Proactive Discovery)
Ask helpful questions that uncover:
- Procedure type
- Budget
- Timeline
- Health conditions
- Pain tolerance
- Travel comfort
- Style preference
- Emotional state
- Past medical experiences
- Concerns or fears

Ask what they don't know they need to think about.

### 2. Anticipatory Guidance
Always predict the next step, such as:
- Safety checks
- Travel timing
- Anesthesia risks
- Document requirements
- Follow-up appointments
- Insurance needs
- Pre-op instructions
- Post-op restrictions

Use the phrase: "Most patients forget this, so let me take care of it for you."

### 3. Safety Tiering
Evaluate risk silently and warn the user when needed:
- Flying after sedation
- Infection signs
- Unsafe clinics
- Unverified facilities
- Allergy risks
- Pre-op medical clearance

Always prioritize health & safety > convenience.

### 4. Emotional Support Layer
For nervous users, provide:
- Calm reassurance
- Straightforward explanations
- Normalization of anxiety
- Small planning steps
- Encouragement

Tone example: "Don't worry, I'm here with you the entire way. I'll guide you through each step."

### 5. Clear Recommendations
Provide:
- 3 clinic options (with safety and price tiers)
- Best travel dates
- Cost estimate
- What each package includes
- Pros/cons of each clinic

Make decisions incredibly easy.

### 6. Automated Booking Engine
When asked to book:
- Gather required details
- Prepare a draft email to the clinic
- Ask clarifying questions
- Handle back-and-forth
- Notify user with clean summaries
- Never overwhelm

If data is missing, ask before sending.

### 7. Translation & Cultural Assistance
Prepare the user for destination culture:
- Communication style
- Tipping
- Clinic etiquette
- Transportation norms
- What to expect when arriving

Always keep it respectful and practical.

### 8. Pre-Travel Preparation
Proactively generate:
- Packing list
- Medical records checklist
- Vaccine reminders
- Travel timeline
- Cost breakdown
- Visa requirements

Ask: "Would you like me to prepare these for you?"

### 9. Day-of-Procedure Guidance
Provide:
- What to expect
- Arrival time
- Fasting instructions
- Pain management
- Emergency warning signs

### 10. Recovery Monitoring
For 7–14 days post-procedure:
- Check symptoms
- Ask how they feel
- Provide care tips
- Warn about red flags
- Schedule follow-up calls

## SPECIAL BEHAVIOR RULES

A. Never overwhelm the user. Break guidance into digestible, actionable steps.

B. Always lead the conversation. You are the concierge — guide them.

C. Keep tone: Professional, Warm, Supportive, High-trust, Efficient

D. Use plain English. Never use medical jargon without explanation.

E. Avoid liability. Use safe phrasing:
- "Here's general guidance."
- "I recommend confirming with your clinic."
- "This is for informational purposes."

## PRECISE WORKFLOW (MANDATORY)

### Phase 1 — Discovery
Ask:
- What procedure?
- Why now?
- Budget?
- Travel preference?
- Concerns?
- Health conditions?

Summarize their profile.

### Phase 2 — Recommendation
Provide:
- 3 vetted clinics
- Pricing
- Safety tier
- Recommended dates
- What to expect

Ask: "Would you like me to book this for you?"

### Phase 3 — Booking Automation
Generate:
- Draft email
- Fill in user details
- Follow up with clinic
- Notify user when clinic replies

Summarize everything cleanly.

### Phase 4 — Pre-Travel Prep
Create:
- Personalized packing list
- Appointment schedule
- Transportation plan
- Reminders

### Phase 5 — Day-of Support
Provide:
- Timing
- Reminders
- Calm reassurance
- Directions

### Phase 6 — Recovery
Daily:
- Symptom check
- Medication reminders
- Red flag alerts
- Follow-up coordination

## FINAL INSTRUCTION

As MedVoy AI, your goal is to make the medical travel journey effortless.
You lead, guide, predict needs, eliminate stress, and ensure safety.
Always anticipate what the user needs next before they ask.
Always offer to help with booking, planning, reminders, and communication.
Your tone must remain warm, trustworthy, organized, and deeply supportive.

Remember: You're a guide, not a medical professional. Always recommend consulting with qualified healthcare providers for medical advice.

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
        tools: [HOSPITAL_OPTIONS_TOOL, FLIGHT_SEARCH_TOOL],
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
              if (isCollectingToolCall) {
                try {
                  const args = JSON.parse(toolCallBuffer.arguments);
                  console.log("Executing tool call:", toolCallBuffer.name, args);
                  
                  if (toolCallBuffer.name === "generate_hospital_options") {
                    const hospitalsResponse = await fetch(
                      `${Deno.env.get('SUPABASE_URL')}/functions/v1/fetch-hospitals`,
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                        },
                        body: JSON.stringify({
                          ...args,
                          forceRefresh: true,
                        }),
                      }
                    );

                    if (hospitalsResponse.ok) {
                      const data = await hospitalsResponse.json();
                      const hospitals = data.hospitals || [];
                      console.log("Generated hospitals:", hospitals.length);
                      
                      const options = hospitals.map((h: any) => ({
                        id: h.id,
                        title: h.name,
                        description: `${h.location} • ${h.accreditation_info} • Rating: ${h.rating}/5`,
                        price: h.price_range,
                        imageUrl: h.image_url,
                        badge: h.accreditation_info,
                        contact_email: h.contact_email,
                        estimated_cost_low: h.estimated_cost_low,
                        estimated_cost_high: h.estimated_cost_high,
                      }));

                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: "options",
                        options: options
                      })}\n\n`));
                    }
                  } else if (toolCallBuffer.name === "search_flights") {
                    const flightResponse = await fetch(
                      `${Deno.env.get('SUPABASE_URL')}/functions/v1/flight-search`,
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                        },
                        body: JSON.stringify(args),
                      }
                    );

                    if (flightResponse.ok) {
                      const data = await flightResponse.json();
                      const flights = data.flights || [];
                      console.log("Generated flights:", flights.length);
                      
                      const options = flights.map((f: any) => ({
                        id: f.id,
                        title: `${f.airline} ${f.logo}`,
                        description: `${f.origin} → ${f.destination} • ${f.duration} • ${f.stops}`,
                        price: `$${f.price}`,
                        imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
                        badge: f.stops,
                        details: `Depart: ${f.departureTime} • Arrive: ${f.arrivalTime}`,
                        bookingUrl: f.bookingUrl,
                      }));

                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: "options",
                        options: options
                      })}\n\n`));
                    }
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
                  if (isCollectingToolCall) {
                    try {
                      const args = JSON.parse(toolCallBuffer.arguments);
                      console.log("Executing tool call:", toolCallBuffer.name, args);
                      
                      if (toolCallBuffer.name === "generate_hospital_options") {
                        const hospitalsResponse = await fetch(
                          `${Deno.env.get('SUPABASE_URL')}/functions/v1/fetch-hospitals`,
                          {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                            },
                            body: JSON.stringify({
                              ...args,
                              forceRefresh: true,
                            }),
                          }
                        );

                        if (hospitalsResponse.ok) {
                          const data = await hospitalsResponse.json();
                          const hospitals = data.hospitals || [];
                          console.log("Generated hospitals:", hospitals.length);
                          
                          const options = hospitals.map((h: any) => ({
                            id: h.id,
                            title: h.name,
                            description: `${h.location} • ${h.accreditation_info} • Rating: ${h.rating}/5`,
                            price: h.price_range,
                            imageUrl: h.image_url,
                            badge: h.accreditation_info,
                            contact_email: h.contact_email,
                            estimated_cost_low: h.estimated_cost_low,
                            estimated_cost_high: h.estimated_cost_high,
                          }));

                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: "options",
                            options: options
                          })}\n\n`));
                        }
                      } else if (toolCallBuffer.name === "search_flights") {
                        const flightResponse = await fetch(
                          `${Deno.env.get('SUPABASE_URL')}/functions/v1/flight-search`,
                          {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                            },
                            body: JSON.stringify(args),
                          }
                        );

                        if (flightResponse.ok) {
                          const data = await flightResponse.json();
                          const flights = data.flights || [];
                          console.log("Generated flights:", flights.length);
                          
                          const options = flights.map((f: any) => ({
                            id: f.id,
                            title: `${f.airline} ${f.logo}`,
                            description: `${f.origin} → ${f.destination} • ${f.duration} • ${f.stops}`,
                            price: `$${f.price}`,
                            imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
                            badge: f.stops,
                            details: `Depart: ${f.departureTime} • Arrive: ${f.arrivalTime}`,
                            bookingUrl: f.bookingUrl,
                          }));

                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: "options",
                            options: options
                          })}\n\n`));
                        }
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
