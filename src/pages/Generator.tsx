import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CodeOutput } from "@/components/CodeOutput";
import { CarlaSimulation } from "@/components/CarlaSimulation";
import { useCodeGenerator } from "@/hooks/useCodeGenerator";
import { Loader2, Sparkles, Code2, FileCode, Cog } from "lucide-react";

const languages = [
  { value: "cpp", label: "C++", icon: "🔷" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "rust", label: "Rust", icon: "🦀" },
];

const componentTypes = [
  { value: "service", label: "Service Interface", description: "SOME/IP service skeleton" },
  { value: "sensor", label: "Sensor Handler", description: "Sensor data processing" },
  { value: "controller", label: "Vehicle Controller", description: "Control logic component" },
  { value: "communication", label: "Communication", description: "Inter-ECU messaging" },
];

const Generator = () => {
  const [requirements, setRequirements] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [componentType, setComponentType] = useState("service");
  const { isGenerating, generatedCode, generateCode } = useCodeGenerator();

  const handleGenerate = () => {
    generateCode(requirements, language, componentType);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Code Generation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Generate Automotive <span className="text-gradient">SDV Code</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Describe your requirements and get production-ready, standards-compliant code for Software Defined Vehicles.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="space-y-6">
              {/* Language Selection */}
              <div className="glass rounded-xl p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
                  <Code2 className="w-4 h-4 text-primary" />
                  Programming Language
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => setLanguage(lang.value)}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        language === lang.value
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-border hover:border-primary/50 hover:bg-secondary"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{lang.icon}</span>
                      <span className="text-sm font-medium text-foreground">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Component Type */}
              <div className="glass rounded-xl p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
                  <Cog className="w-4 h-4 text-primary" />
                  Component Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {componentTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setComponentType(type.value)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                        componentType === type.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-secondary"
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground block">{type.label}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirements Input */}
              <div className="glass rounded-xl p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
                  <FileCode className="w-4 h-4 text-primary" />
                  Requirements
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe your automotive component requirements...

Example: Create a brake control service that receives wheel speed sensor data from 4 wheels, calculates optimal braking force distribution, and sends commands to brake actuators. Include ABS logic and emergency braking capability."
                  className="w-full h-48 p-4 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Generate Button */}
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating || !requirements.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Code...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Code
                  </>
                )}
              </Button>
            </div>

            {/* Output Panel */}
            <div className="space-y-6">
              {generatedCode ? (
                <>
                  <CodeOutput
                    code={generatedCode.code}
                    language={generatedCode.language}
                    filename={generatedCode.filename}
                    explanation={generatedCode.explanation}
                    standards={generatedCode.standards}
                    warnings={generatedCode.warnings}
                  />
                  <CarlaSimulation
                    code={generatedCode.code}
                    language={generatedCode.language}
                    componentType={componentType}
                  />
                </>
              ) : (
                <div className="glass rounded-xl p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Code2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Enter your requirements and click generate to create production-ready automotive code.
                  </p>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-accent font-medium mb-1">✓ ISO 26262</p>
                      <p className="text-xs text-muted-foreground">Safety compliance</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-accent font-medium mb-1">✓ AUTOSAR</p>
                      <p className="text-xs text-muted-foreground">Adaptive platform</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-accent font-medium mb-1">✓ MISRA C++</p>
                      <p className="text-xs text-muted-foreground">Coding guidelines</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-accent font-medium mb-1">✓ SoA Ready</p>
                      <p className="text-xs text-muted-foreground">Service-oriented</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Generator;
