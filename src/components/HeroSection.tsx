import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/10 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-40" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Automotive AI Platform</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
          GenAI for{" "}
          <span className="text-gradient">
            Software Defined
          </span>
          <br />
          Vehicles
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Automatically generate requirements, system designs, production-ready code, 
          and test cases for automotive SoA applications—fully compliant with industry standards.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button variant="hero" size="xl" asChild>
            <Link to="/generator">
              Start Generating
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="glass" size="xl">
            <Play className="w-5 h-5" />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { value: "10x", label: "Faster Development" },
            { value: "99.2%", label: "Standards Compliance" },
            { value: "500+", label: "Test Scenarios" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
