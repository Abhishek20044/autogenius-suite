import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert automotive software engineer specializing in Software Defined Vehicles (SDVs) and Service-Oriented Architecture (SoA). You generate production-ready code that complies with automotive industry standards.

CAPABILITIES:
- Generate C++, Java, or Rust code for automotive applications
- Follow AUTOSAR Adaptive Platform guidelines
- Implement ISO 26262 functional safety patterns
- Create SOME/IP and DDS communication patterns
- Generate service interfaces and skeleton implementations

STANDARDS COMPLIANCE:
- MISRA C++ coding guidelines
- AUTOSAR Adaptive Platform specifications
- ISO 26262 safety requirements
- ASIL classification patterns

OUTPUT FORMAT:
Always structure your response as valid JSON with the following fields:
{
  "language": "cpp" | "java" | "rust",
  "filename": "suggested filename",
  "code": "the generated code",
  "explanation": "brief explanation of the implementation",
  "standards": ["list of standards this code follows"],
  "warnings": ["any important notes or warnings"]
}

Generate clean, well-documented, production-ready code. Include appropriate includes/imports, error handling, and comments explaining safety-critical sections.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requirements, language, componentType } = await req.json();
    
    if (!requirements) {
      throw new Error("Requirements are required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = `Generate ${language || 'C++'} code for the following automotive component:

Component Type: ${componentType || 'Service'}
Requirements:
${requirements}

Ensure the code:
1. Follows AUTOSAR Adaptive Platform patterns
2. Includes proper error handling
3. Has safety-critical sections marked
4. Includes MISRA-compliant comments
5. Uses appropriate middleware communication patterns`;

    console.log("Generating code for:", { language, componentType, requirements: requirements.substring(0, 100) });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    console.log("Code generated successfully");

    // Try to parse as JSON, fallback to raw code
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonContent = jsonMatch ? jsonMatch[1].trim() : content;
      result = JSON.parse(jsonContent);
    } catch {
      // If not valid JSON, wrap the code
      result = {
        language: language || "cpp",
        filename: `generated_service.${language === "java" ? "java" : language === "rust" ? "rs" : "cpp"}`,
        code: content,
        explanation: "Generated automotive service code",
        standards: ["AUTOSAR Adaptive", "ISO 26262"],
        warnings: [],
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-code function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
