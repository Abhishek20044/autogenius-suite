import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GeneratedCode {
  language: string;
  filename: string;
  code: string;
  explanation: string;
  standards: string[];
  warnings: string[];
}

export const useCodeGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const { toast } = useToast();

  const generateCode = async (
    requirements: string,
    language: string,
    componentType: string
  ) => {
    if (!requirements.trim()) {
      toast({
        title: "Requirements needed",
        description: "Please enter your requirements to generate code.",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    setGeneratedCode(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-code", {
        body: { requirements, language, componentType },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedCode(data);
      toast({
        title: "Code generated!",
        description: `Generated ${data.language} code following ${data.standards?.join(", ") || "automotive standards"}.`,
      });

      return data;
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate code",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedCode,
    generateCode,
    clearCode: () => setGeneratedCode(null),
  };
};
