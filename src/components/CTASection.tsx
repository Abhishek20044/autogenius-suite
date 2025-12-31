import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
          Ready to Transform Your
          <br />
          <span className="text-gradient">Automotive Development?</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join leading automotive companies using GenAI to accelerate SDV development 
          while maintaining the highest safety and quality standards.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button variant="hero" size="xl" asChild>
            <Link to="/generator">
              Try Generator
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg">
            <Github className="w-5 h-5" />
            View on GitHub
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center">
              <span className="text-accent text-xs">✓</span>
            </div>
            <span>ISO 26262 Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center">
              <span className="text-accent text-xs">✓</span>
            </div>
            <span>AUTOSAR Compatible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center">
              <span className="text-accent text-xs">✓</span>
            </div>
            <span>CARLA Validated</span>
          </div>
        </div>
      </div>
    </section>
  );
};
