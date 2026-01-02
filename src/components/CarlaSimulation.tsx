import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, CheckCircle2, AlertTriangle, Activity, Camera, Radio, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimulationStep {
  id: number;
  name: string;
  status: "pending" | "running" | "passed" | "failed";
  duration: number;
  details: string;
}

interface CarlaSimulationProps {
  code: string;
  language: string;
  componentType: string;
}

const initialSteps: SimulationStep[] = [
  { id: 1, name: "Code Compilation", status: "pending", duration: 1200, details: "Compiling with safety flags" },
  { id: 2, name: "Static Analysis", status: "pending", duration: 1500, details: "MISRA C++ compliance check" },
  { id: 3, name: "Environment Init", status: "pending", duration: 800, details: "Loading Town03 urban map" },
  { id: 4, name: "Sensor Fusion", status: "pending", duration: 2000, details: "8 cameras + LiDAR + Radar" },
  { id: 5, name: "Scenario: Normal", status: "pending", duration: 2500, details: "Highway cruise control" },
  { id: 6, name: "Scenario: Emergency", status: "pending", duration: 2200, details: "Pedestrian crossing test" },
  { id: 7, name: "Scenario: Edge Case", status: "pending", duration: 1800, details: "Adverse weather driving" },
  { id: 8, name: "Safety Validation", status: "pending", duration: 1000, details: "ISO 26262 ASIL-D check" },
];

export const CarlaSimulation = ({ code, language, componentType }: CarlaSimulationProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<SimulationStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [frame, setFrame] = useState(0);
  const [fps, setFps] = useState(60);
  const [vehiclePosition, setVehiclePosition] = useState({ x: 50, y: 50 });

  const resetSimulation = useCallback(() => {
    setSteps(initialSteps);
    setCurrentStep(0);
    setFrame(0);
    setIsRunning(false);
    setVehiclePosition({ x: 50, y: 50 });
  }, []);

  const runSimulation = useCallback(() => {
    if (!code) return;
    resetSimulation();
    setIsRunning(true);
  }, [code, resetSimulation]);

  // Simulation step progression
  useEffect(() => {
    if (!isRunning || currentStep >= steps.length) {
      if (currentStep >= steps.length) setIsRunning(false);
      return;
    }

    // Mark current step as running
    setSteps(prev => prev.map((step, idx) => 
      idx === currentStep ? { ...step, status: "running" } : step
    ));

    const timer = setTimeout(() => {
      // Mark step as passed (95% pass rate for demo)
      const passed = Math.random() > 0.05;
      setSteps(prev => prev.map((step, idx) => 
        idx === currentStep ? { ...step, status: passed ? "passed" : "failed" } : step
      ));
      setCurrentStep(prev => prev + 1);
    }, steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, steps]);

  // Frame counter and vehicle movement
  useEffect(() => {
    if (!isRunning) return;

    const frameInterval = setInterval(() => {
      setFrame(prev => prev + 1);
      setFps(58 + Math.floor(Math.random() * 5));
      
      // Move vehicle in a pattern
      setVehiclePosition(prev => ({
        x: 50 + Math.sin(prev.x * 0.02) * 30,
        y: 50 + Math.cos(prev.y * 0.015) * 20
      }));
    }, 16);

    return () => clearInterval(frameInterval);
  }, [isRunning]);

  const passedSteps = steps.filter(s => s.status === "passed").length;
  const failedSteps = steps.filter(s => s.status === "failed").length;
  const progress = (passedSteps + failedSteps) / steps.length * 100;

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-warning" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">CARLA Simulation Loop</h3>
            <p className="text-xs text-muted-foreground">Real-time validation environment</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetSimulation}
            disabled={isRunning}
            className="gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
          <Button
            variant={isRunning ? "outline" : "default"}
            size="sm"
            onClick={() => isRunning ? setIsRunning(false) : runSimulation()}
            disabled={!code}
            className="gap-1.5"
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Run Simulation
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Simulation Viewport */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-secondary/30">
        {/* Main 3D View */}
        <div className="col-span-2 aspect-video bg-gradient-to-br from-secondary to-background rounded-lg relative overflow-hidden border border-border">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(10)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full h-px bg-primary/30"
                style={{ top: `${i * 10}%` }}
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full w-px bg-primary/30"
                style={{ left: `${i * 10}%` }}
              />
            ))}
          </div>

          {/* Vehicle representation */}
          <div
            className="absolute w-6 h-3 bg-primary rounded transition-all duration-300"
            style={{
              left: `${vehiclePosition.x}%`,
              top: `${vehiclePosition.y}%`,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 20px hsl(var(--primary) / 0.5)"
            }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full animate-pulse" />
          </div>

          {/* Sensor visualization */}
          {isRunning && (
            <>
              <div
                className="absolute border-2 border-primary/30 rounded-full animate-ping"
                style={{
                  left: `${vehiclePosition.x}%`,
                  top: `${vehiclePosition.y}%`,
                  width: "80px",
                  height: "80px",
                  transform: "translate(-50%, -50%)"
                }}
              />
              <div
                className="absolute border border-warning/30"
                style={{
                  left: `${vehiclePosition.x}%`,
                  top: `${vehiclePosition.y}%`,
                  width: "100px",
                  height: "60px",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)"
                }}
              />
            </>
          )}

          {/* HUD overlay */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-background/80 rounded text-xs font-mono text-primary backdrop-blur-sm">
            CARLA 0.9.15
          </div>
          <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 rounded text-xs font-mono text-foreground backdrop-blur-sm">
            Town03 Urban
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-3">
            <span className="px-2 py-1 bg-background/80 rounded text-xs font-mono text-muted-foreground backdrop-blur-sm">
              Frame: {frame.toLocaleString()}
            </span>
            <span className="px-2 py-1 bg-background/80 rounded text-xs font-mono text-accent backdrop-blur-sm">
              {fps} FPS
            </span>
          </div>
        </div>

        {/* Sensor feeds */}
        <div className="space-y-2">
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
            <Camera className="w-4 h-4 text-primary/50" />
            <span className="absolute bottom-1 left-1 text-[10px] text-primary font-mono">CAM-F</span>
            {isRunning && (
              <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            )}
          </div>
          <div className="aspect-video bg-gradient-to-br from-accent/10 to-secondary rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
            <Radio className="w-4 h-4 text-accent/50" />
            <span className="absolute bottom-1 left-1 text-[10px] text-accent font-mono">LiDAR</span>
            {isRunning && (
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-accent rounded-full animate-ping"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="aspect-video bg-gradient-to-br from-warning/10 to-secondary rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
            <Layers className="w-4 h-4 text-warning/50" />
            <span className="absolute bottom-1 left-1 text-[10px] text-warning font-mono">RADAR</span>
            {isRunning && (
              <div 
                className="absolute inset-0 bg-gradient-to-t from-warning/10 to-transparent"
                style={{ animation: "pulse 1s ease-in-out infinite" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 bg-secondary/20">
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Test Steps */}
      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
              step.status === "running"
                ? "border-primary bg-primary/5 shadow-glow"
                : step.status === "passed"
                ? "border-accent/30 bg-accent/5"
                : step.status === "failed"
                ? "border-destructive/30 bg-destructive/5"
                : "border-border bg-secondary/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center">
                {step.status === "running" ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : step.status === "passed" ? (
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                ) : step.status === "failed" ? (
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{step.name}</p>
                <p className="text-xs text-muted-foreground">{step.details}</p>
              </div>
            </div>
            {(step.status === "passed" || step.status === "failed") && (
              <span className="text-xs text-muted-foreground font-mono">
                {(step.duration / 1000).toFixed(1)}s
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs text-muted-foreground">{passedSteps} Passed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">{failedSteps} Failed</span>
          </div>
        </div>
        {passedSteps === steps.length && (
          <span className="text-xs font-medium text-accent flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            All Tests Passed - Ready for Deployment
          </span>
        )}
      </div>
    </div>
  );
};
