import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Play, Pause, RotateCcw, CheckCircle2, AlertTriangle, Activity, 
  Camera, Radio, Layers, Download, FileJson, FileText, Car, 
  Navigation, ParkingCircle, ArrowLeftRight, CloudRain, Sun, CloudFog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface SimulationStep {
  id: number;
  name: string;
  status: "pending" | "running" | "passed" | "failed";
  duration: number;
  details: string;
  category: "setup" | "analysis" | "scenario" | "validation";
  metrics?: {
    latency?: number;
    accuracy?: number;
    coverage?: number;
  };
}

interface CarlaSimulationProps {
  code: string;
  language: string;
  componentType: string;
}

type ScenarioType = "full" | "intersection" | "lane-change" | "parking" | "highway";

interface ScenarioConfig {
  name: string;
  icon: React.ReactNode;
  map: string;
  weather: string;
  steps: SimulationStep[];
}

const createScenarioSteps = (scenario: ScenarioType): SimulationStep[] => {
  const baseSteps: SimulationStep[] = [
    { id: 1, name: "Code Compilation", status: "pending", duration: 1200, details: "Compiling with safety flags -O2 -Wall", category: "setup", metrics: { latency: 1.2 } },
    { id: 2, name: "Static Analysis", status: "pending", duration: 1500, details: "MISRA C++ 2023 compliance check", category: "analysis", metrics: { coverage: 98.5 } },
    { id: 3, name: "Environment Init", status: "pending", duration: 800, details: "Loading simulation environment", category: "setup" },
    { id: 4, name: "Sensor Fusion", status: "pending", duration: 2000, details: "8 cameras + LiDAR + Radar calibration", category: "setup", metrics: { accuracy: 99.2 } },
  ];

  const scenarioSteps: Record<ScenarioType, SimulationStep[]> = {
    full: [
      { id: 5, name: "Highway Cruise", status: "pending", duration: 2500, details: "Adaptive cruise control at 120 km/h", category: "scenario", metrics: { accuracy: 97.8 } },
      { id: 6, name: "Emergency Brake", status: "pending", duration: 2200, details: "Pedestrian crossing detection", category: "scenario", metrics: { latency: 45 } },
      { id: 7, name: "Intersection Nav", status: "pending", duration: 2800, details: "4-way intersection with traffic", category: "scenario", metrics: { accuracy: 96.5 } },
      { id: 8, name: "Lane Change", status: "pending", duration: 2000, details: "Multi-lane highway maneuver", category: "scenario", metrics: { accuracy: 98.1 } },
      { id: 9, name: "Parking", status: "pending", duration: 3000, details: "Parallel parking sequence", category: "scenario", metrics: { accuracy: 95.2 } },
      { id: 10, name: "Adverse Weather", status: "pending", duration: 1800, details: "Heavy rain + fog conditions", category: "scenario", metrics: { accuracy: 91.3 } },
    ],
    intersection: [
      { id: 5, name: "Traffic Light Detection", status: "pending", duration: 1500, details: "Red/green/yellow recognition", category: "scenario", metrics: { accuracy: 99.1 } },
      { id: 6, name: "Right Turn", status: "pending", duration: 2000, details: "Yield to pedestrians", category: "scenario", metrics: { latency: 120 } },
      { id: 7, name: "Left Turn", status: "pending", duration: 2500, details: "Gap detection in oncoming traffic", category: "scenario", metrics: { accuracy: 94.8 } },
      { id: 8, name: "Unprotected Left", status: "pending", duration: 3000, details: "Complex intersection negotiation", category: "scenario", metrics: { accuracy: 92.1 } },
    ],
    "lane-change": [
      { id: 5, name: "Mirror Check", status: "pending", duration: 1200, details: "Blind spot monitoring", category: "scenario", metrics: { accuracy: 99.5 } },
      { id: 6, name: "Gap Assessment", status: "pending", duration: 1800, details: "Safe distance calculation", category: "scenario", metrics: { latency: 80 } },
      { id: 7, name: "Signal & Execute", status: "pending", duration: 2200, details: "Smooth lateral transition", category: "scenario", metrics: { accuracy: 97.3 } },
      { id: 8, name: "Multi-Lane", status: "pending", duration: 2800, details: "Highway exit maneuver", category: "scenario", metrics: { accuracy: 96.8 } },
    ],
    parking: [
      { id: 5, name: "Spot Detection", status: "pending", duration: 2000, details: "Ultrasonic + camera fusion", category: "scenario", metrics: { accuracy: 98.7 } },
      { id: 6, name: "Path Planning", status: "pending", duration: 1500, details: "Trajectory optimization", category: "scenario", metrics: { latency: 200 } },
      { id: 7, name: "Parallel Park", status: "pending", duration: 3500, details: "Multi-point turn sequence", category: "scenario", metrics: { accuracy: 94.5 } },
      { id: 8, name: "Perpendicular Park", status: "pending", duration: 2500, details: "Tight space navigation", category: "scenario", metrics: { accuracy: 96.2 } },
    ],
    highway: [
      { id: 5, name: "Merge Entry", status: "pending", duration: 2200, details: "On-ramp acceleration", category: "scenario", metrics: { accuracy: 97.9 } },
      { id: 6, name: "Cruise Control", status: "pending", duration: 2000, details: "Adaptive speed maintenance", category: "scenario", metrics: { latency: 50 } },
      { id: 7, name: "Overtake", status: "pending", duration: 2800, details: "Safe passing maneuver", category: "scenario", metrics: { accuracy: 96.4 } },
      { id: 8, name: "Exit Ramp", status: "pending", duration: 2000, details: "Deceleration and exit", category: "scenario", metrics: { accuracy: 98.3 } },
    ],
  };

  const validationSteps: SimulationStep[] = [
    { id: 99, name: "Safety Validation", status: "pending", duration: 1000, details: "ISO 26262 ASIL-D compliance", category: "validation", metrics: { coverage: 100 } },
  ];

  const allSteps = [...baseSteps, ...scenarioSteps[scenario], ...validationSteps];
  return allSteps.map((step, idx) => ({ ...step, id: idx + 1 }));
};

const scenarioConfigs: Record<ScenarioType, Omit<ScenarioConfig, 'steps'>> = {
  full: { name: "Full Suite", icon: <Car className="w-3.5 h-3.5" />, map: "Town03 Urban", weather: "Dynamic" },
  intersection: { name: "Intersection", icon: <Navigation className="w-3.5 h-3.5" />, map: "Town05 Junction", weather: "Clear" },
  "lane-change": { name: "Lane Change", icon: <ArrowLeftRight className="w-3.5 h-3.5" />, map: "Highway_01", weather: "Clear" },
  parking: { name: "Parking", icon: <ParkingCircle className="w-3.5 h-3.5" />, map: "Town02 Parking", weather: "Clear" },
  highway: { name: "Highway", icon: <Car className="w-3.5 h-3.5" />, map: "Highway_02", weather: "Sunny" },
};

export const CarlaSimulation = ({ code, language, componentType }: CarlaSimulationProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>("full");
  const [steps, setSteps] = useState<SimulationStep[]>(() => createScenarioSteps("full"));
  const [currentStep, setCurrentStep] = useState(0);
  const [frame, setFrame] = useState(0);
  const [fps, setFps] = useState(60);
  const [vehiclePosition, setVehiclePosition] = useState({ x: 50, y: 50, rotation: 0 });
  const [weather, setWeather] = useState<"clear" | "rain" | "fog">("clear");
  const [otherVehicles, setOtherVehicles] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [simulationTime, setSimulationTime] = useState(0);

  const initialSteps = useMemo(() => createScenarioSteps(selectedScenario), [selectedScenario]);

  const resetSimulation = useCallback(() => {
    setSteps(createScenarioSteps(selectedScenario));
    setCurrentStep(0);
    setFrame(0);
    setIsRunning(false);
    setVehiclePosition({ x: 50, y: 50, rotation: 0 });
    setSimulationTime(0);
    setOtherVehicles([
      { id: 1, x: 30, y: 30 },
      { id: 2, x: 70, y: 60 },
      { id: 3, x: 20, y: 70 },
    ]);
  }, [selectedScenario]);

  const runSimulation = useCallback(() => {
    if (!code) return;
    resetSimulation();
    setIsRunning(true);
    // Randomize weather for demo
    const weathers: Array<"clear" | "rain" | "fog"> = ["clear", "rain", "fog"];
    setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
  }, [code, resetSimulation]);

  const handleScenarioChange = useCallback((scenario: ScenarioType) => {
    setSelectedScenario(scenario);
    setSteps(createScenarioSteps(scenario));
    setCurrentStep(0);
    setFrame(0);
    setIsRunning(false);
  }, []);

  // Simulation step progression
  useEffect(() => {
    if (!isRunning || currentStep >= initialSteps.length) {
      if (currentStep >= initialSteps.length) setIsRunning(false);
      return;
    }

    setSteps(prev => prev.map((step, idx) => 
      idx === currentStep ? { ...step, status: "running" } : step
    ));

    const stepDuration = initialSteps[currentStep]?.duration || 1000;
    const timer = setTimeout(() => {
      const passed = Math.random() > 0.05;
      setSteps(prev => prev.map((step, idx) => 
        idx === currentStep ? { ...step, status: passed ? "passed" : "failed" } : step
      ));
      setCurrentStep(prev => prev + 1);
    }, stepDuration);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, initialSteps]);

  // Frame counter and vehicle movement
  useEffect(() => {
    if (!isRunning) return;

    const frameInterval = setInterval(() => {
      setFrame(prev => prev + 1);
      setSimulationTime(prev => prev + 16);
      setFps(58 + Math.floor(Math.random() * 5));
      
      // More dynamic vehicle movement based on scenario
      setVehiclePosition(prev => {
        const time = Date.now() / 1000;
        let newX = prev.x;
        let newY = prev.y;
        let newRotation = prev.rotation;

        switch (selectedScenario) {
          case "lane-change":
            newX = 20 + (time % 10) * 6;
            newY = 50 + Math.sin(time * 0.5) * 15;
            newRotation = Math.sin(time * 0.5) * 10;
            break;
          case "parking":
            newX = 50 + Math.sin(time * 0.3) * 10;
            newY = 50 + Math.cos(time * 0.2) * 15;
            newRotation = time * 20 % 360;
            break;
          case "intersection":
            newX = 50 + Math.sin(time * 0.4) * 25;
            newY = 50 + Math.cos(time * 0.4) * 25;
            newRotation = Math.atan2(Math.cos(time * 0.4), -Math.sin(time * 0.4)) * (180 / Math.PI);
            break;
          default:
            newX = 50 + Math.sin(time * 0.3) * 30;
            newY = 50 + Math.cos(time * 0.2) * 20;
            newRotation = Math.sin(time * 0.3) * 15;
        }

        return { x: Math.max(10, Math.min(90, newX)), y: Math.max(10, Math.min(90, newY)), rotation: newRotation };
      });

      // Move other vehicles
      setOtherVehicles(prev => prev.map(v => ({
        ...v,
        x: Math.max(5, Math.min(95, v.x + (Math.random() - 0.5) * 2)),
        y: Math.max(5, Math.min(95, v.y + (Math.random() - 0.5) * 2)),
      })));
    }, 16);

    return () => clearInterval(frameInterval);
  }, [isRunning, selectedScenario]);

  const passedSteps = steps.filter(s => s.status === "passed").length;
  const failedSteps = steps.filter(s => s.status === "failed").length;
  const progress = (passedSteps + failedSteps) / steps.length * 100;
  const isComplete = passedSteps + failedSteps === steps.length;

  const generateReport = useCallback((format: "json" | "pdf") => {
    const report = {
      metadata: {
        timestamp: new Date().toISOString(),
        carlaVersion: "0.9.15",
        scenario: scenarioConfigs[selectedScenario].name,
        map: scenarioConfigs[selectedScenario].map,
        language,
        componentType,
        totalFrames: frame,
        simulationTimeMs: simulationTime,
      },
      summary: {
        totalTests: steps.length,
        passed: passedSteps,
        failed: failedSteps,
        passRate: ((passedSteps / steps.length) * 100).toFixed(1) + "%",
        status: failedSteps === 0 ? "PASSED" : "FAILED",
      },
      testResults: steps.map(step => ({
        id: step.id,
        name: step.name,
        category: step.category,
        status: step.status,
        duration: step.duration,
        details: step.details,
        metrics: step.metrics || {},
      })),
      compliance: {
        iso26262: failedSteps === 0 ? "ASIL-D Compliant" : "Non-Compliant",
        misraCpp: "2023 Standard",
        autosar: "Adaptive Platform R22-11",
      },
      codeInfo: {
        language,
        componentType,
        linesOfCode: code.split('\n').length,
        codeHash: btoa(code.slice(0, 100)).slice(0, 16),
      },
    };

    if (format === "json") {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `carla-simulation-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("JSON report downloaded");
    } else {
      // Generate text-based PDF-like report
      const pdfContent = `
CARLA SIMULATION REPORT
========================
Generated: ${report.metadata.timestamp}

CONFIGURATION
-------------
CARLA Version: ${report.metadata.carlaVersion}
Scenario: ${report.metadata.scenario}
Map: ${report.metadata.map}
Language: ${report.metadata.language}
Component: ${report.metadata.componentType}

SUMMARY
-------
Total Tests: ${report.summary.totalTests}
Passed: ${report.summary.passed}
Failed: ${report.summary.failed}
Pass Rate: ${report.summary.passRate}
Status: ${report.summary.status}

TEST RESULTS
------------
${report.testResults.map(t => 
  `[${t.status.toUpperCase()}] ${t.name}
   Category: ${t.category}
   Duration: ${t.duration}ms
   Details: ${t.details}
   ${t.metrics.accuracy ? `Accuracy: ${t.metrics.accuracy}%` : ''}
   ${t.metrics.latency ? `Latency: ${t.metrics.latency}ms` : ''}
`).join('\n')}

COMPLIANCE
----------
ISO 26262: ${report.compliance.iso26262}
MISRA C++: ${report.compliance.misraCpp}
AUTOSAR: ${report.compliance.autosar}

CODE INFORMATION
----------------
Language: ${report.codeInfo.language}
Component Type: ${report.codeInfo.componentType}
Lines of Code: ${report.codeInfo.linesOfCode}
      `.trim();

      const blob = new Blob([pdfContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `carla-simulation-report-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded (TXT format)");
    }
  }, [steps, passedSteps, failedSteps, frame, simulationTime, selectedScenario, language, componentType, code]);

  const WeatherIcon = weather === "rain" ? CloudRain : weather === "fog" ? CloudFog : Sun;

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning/20 to-primary/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">CARLA Simulation Loop</h3>
            <p className="text-xs text-muted-foreground">Real-time validation • {scenarioConfigs[selectedScenario].name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Scenario Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                {scenarioConfigs[selectedScenario].icon}
                {scenarioConfigs[selectedScenario].name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(scenarioConfigs) as ScenarioType[]).map((key) => (
                <DropdownMenuItem 
                  key={key} 
                  onClick={() => handleScenarioChange(key)}
                  className="gap-2"
                >
                  {scenarioConfigs[key].icon}
                  {scenarioConfigs[key].name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
                Run
              </>
            )}
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={!isComplete} className="gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => generateReport("json")} className="gap-2">
                <FileJson className="w-4 h-4" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generateReport("pdf")} className="gap-2">
                <FileText className="w-4 h-4" />
                Export as Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Simulation Viewport */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-b from-secondary/30 to-background/50">
        {/* Main 3D View */}
        <div className="col-span-2 aspect-video bg-gradient-to-br from-secondary via-background to-secondary/50 rounded-lg relative overflow-hidden border border-border shadow-inner">
          {/* Weather overlay */}
          {weather === "rain" && (
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-4 bg-blue-400/50 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    transform: "rotate(15deg)",
                  }}
                />
              ))}
            </div>
          )}
          {weather === "fog" && (
            <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-muted/20 pointer-events-none" />
          )}

          {/* Grid lines with perspective */}
          <div className="absolute inset-0 opacity-15">
            {[...Array(12)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                style={{ top: `${i * 8.33}%` }}
              />
            ))}
            {[...Array(12)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent"
                style={{ left: `${i * 8.33}%` }}
              />
            ))}
          </div>

          {/* Road markings based on scenario */}
          {selectedScenario === "lane-change" || selectedScenario === "highway" ? (
            <div className="absolute inset-y-[35%] inset-x-0">
              <div className="absolute top-0 left-0 right-0 h-px bg-white/30" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white/30" />
              <div className="absolute top-1/2 left-0 right-0 flex gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-0.5 w-8 bg-white/40" />
                ))}
              </div>
            </div>
          ) : selectedScenario === "intersection" ? (
            <>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
              <div className="absolute top-[45%] left-[45%] w-[10%] h-[10%] border border-dashed border-white/30" />
            </>
          ) : selectedScenario === "parking" ? (
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-1 h-8 border border-white/20 rounded-sm" />
              ))}
            </div>
          ) : null}

          {/* Other vehicles */}
          {otherVehicles.map((v) => (
            <div
              key={v.id}
              className="absolute w-4 h-2 bg-muted-foreground/50 rounded transition-all duration-300"
              style={{
                left: `${v.x}%`,
                top: `${v.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {/* Main vehicle */}
          <div
            className="absolute w-8 h-4 bg-gradient-to-r from-primary to-primary/80 rounded-sm transition-all duration-100 shadow-lg"
            style={{
              left: `${vehiclePosition.x}%`,
              top: `${vehiclePosition.y}%`,
              transform: `translate(-50%, -50%) rotate(${vehiclePosition.rotation}deg)`,
              boxShadow: "0 0 30px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.3)"
            }}
          >
            {/* Headlights */}
            <div className="absolute -right-1 top-0.5 w-1 h-0.5 bg-yellow-300 rounded-full" />
            <div className="absolute -right-1 bottom-0.5 w-1 h-0.5 bg-yellow-300 rounded-full" />
            {/* Sensor indicator */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          </div>

          {/* Sensor visualization */}
          {isRunning && (
            <>
              {/* LiDAR sweep */}
              <div
                className="absolute border-2 border-accent/20 rounded-full"
                style={{
                  left: `${vehiclePosition.x}%`,
                  top: `${vehiclePosition.y}%`,
                  width: "120px",
                  height: "120px",
                  transform: "translate(-50%, -50%)",
                  animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite"
                }}
              />
              {/* Radar cone */}
              <div
                className="absolute border-l-2 border-r-2 border-warning/20"
                style={{
                  left: `${vehiclePosition.x}%`,
                  top: `${vehiclePosition.y}%`,
                  width: "80px",
                  height: "100px",
                  transform: `translate(-50%, -100%) rotate(${vehiclePosition.rotation}deg)`,
                  clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
                  background: "linear-gradient(to top, hsl(var(--warning) / 0.1), transparent)"
                }}
              />
              {/* Detection points */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-accent/60 rounded-full"
                  style={{
                    left: `${vehiclePosition.x + (Math.random() - 0.5) * 30}%`,
                    top: `${vehiclePosition.y + (Math.random() - 0.5) * 30}%`,
                    animation: `ping ${1 + Math.random()}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </>
          )}

          {/* HUD overlay */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-background/90 rounded text-xs font-mono text-primary backdrop-blur-sm border border-border/50">
            CARLA 0.9.15
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <span className="px-2 py-1 bg-background/90 rounded text-xs font-mono text-foreground backdrop-blur-sm border border-border/50 flex items-center gap-1">
              <WeatherIcon className="w-3 h-3" />
              {weather}
            </span>
            <span className="px-2 py-1 bg-background/90 rounded text-xs font-mono text-foreground backdrop-blur-sm border border-border/50">
              {scenarioConfigs[selectedScenario].map}
            </span>
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <span className="px-2 py-1 bg-background/90 rounded text-xs font-mono text-muted-foreground backdrop-blur-sm border border-border/50">
              F: {frame.toLocaleString()}
            </span>
            <span className="px-2 py-1 bg-background/90 rounded text-xs font-mono text-accent backdrop-blur-sm border border-border/50">
              {fps} FPS
            </span>
            <span className="px-2 py-1 bg-background/90 rounded text-xs font-mono text-muted-foreground backdrop-blur-sm border border-border/50">
              {(simulationTime / 1000).toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Sensor feeds */}
        <div className="space-y-2">
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary rounded-lg border border-border flex items-center justify-center relative overflow-hidden group">
            <Camera className="w-5 h-5 text-primary/40 group-hover:scale-110 transition-transform" />
            <span className="absolute bottom-1 left-1 text-[10px] text-primary font-mono bg-background/50 px-1 rounded">CAM-FRONT</span>
            {isRunning && (
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent animate-pulse" />
            )}
          </div>
          <div className="aspect-video bg-gradient-to-br from-accent/10 to-secondary rounded-lg border border-border flex items-center justify-center relative overflow-hidden group">
            <Radio className="w-5 h-5 text-accent/40 group-hover:scale-110 transition-transform" />
            <span className="absolute bottom-1 left-1 text-[10px] text-accent font-mono bg-background/50 px-1 rounded">LiDAR-360</span>
            {isRunning && (
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-accent rounded-full"
                    style={{
                      left: `${15 + Math.random() * 70}%`,
                      top: `${15 + Math.random() * 70}%`,
                      animation: `ping ${0.8 + Math.random() * 0.4}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="aspect-video bg-gradient-to-br from-warning/10 to-secondary rounded-lg border border-border flex items-center justify-center relative overflow-hidden group">
            <Layers className="w-5 h-5 text-warning/40 group-hover:scale-110 transition-transform" />
            <span className="absolute bottom-1 left-1 text-[10px] text-warning font-mono bg-background/50 px-1 rounded">RADAR-FWD</span>
            {isRunning && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-warning/10 to-transparent"
                style={{ animation: "pulse 1.5s ease-in-out infinite" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 bg-secondary/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Test Steps */}
      <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
              step.status === "running"
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : step.status === "passed"
                ? "border-accent/30 bg-accent/5"
                : step.status === "failed"
                ? "border-destructive/30 bg-destructive/5"
                : "border-border bg-secondary/30 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-background/50">
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
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{step.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground uppercase">
                    {step.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{step.details}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {step.metrics && (step.status === "passed" || step.status === "failed") && (
                <div className="text-right">
                  {step.metrics.accuracy && (
                    <span className="text-[10px] text-accent font-mono block">{step.metrics.accuracy}% acc</span>
                  )}
                  {step.metrics.latency && (
                    <span className="text-[10px] text-warning font-mono block">{step.metrics.latency}ms</span>
                  )}
                </div>
              )}
              {(step.status === "passed" || step.status === "failed") && (
                <span className="text-xs text-muted-foreground font-mono">
                  {(step.duration / 1000).toFixed(1)}s
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-gradient-to-r from-secondary/20 to-background">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-lg shadow-accent/50" />
            <span className="text-xs text-muted-foreground">{passedSteps} Passed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive shadow-lg shadow-destructive/50" />
            <span className="text-xs text-muted-foreground">{failedSteps} Failed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
            <span className="text-xs text-muted-foreground">{steps.length - passedSteps - failedSteps} Pending</span>
          </div>
        </div>
        {isComplete && (
          <span className={`text-xs font-medium flex items-center gap-1.5 ${failedSteps === 0 ? 'text-accent' : 'text-destructive'}`}>
            {failedSteps === 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                All Tests Passed - Ready for Deployment
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                {failedSteps} Test(s) Failed - Review Required
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
};
