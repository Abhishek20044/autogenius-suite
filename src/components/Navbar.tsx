import { Car, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const isHomePage = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto glass-strong rounded-2xl px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">AutoGenAI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <>
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#workflow" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Workflow
                </a>
                <a href="#simulation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Simulation
                </a>
              </>
            ) : (
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
            )}
            <Link 
              to="/generator" 
              className={`text-sm transition-colors ${
                location.pathname === "/generator" 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Generator
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">{user.email?.split("@")[0]}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to="/generator">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-border mt-4">
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/generator" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Generator
              </Link>
              <div className="flex gap-3 pt-3">
                {user ? (
                  <Button variant="ghost" size="sm" className="flex-1" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                      <Link to="/auth">Sign In</Link>
                    </Button>
                    <Button variant="default" size="sm" className="flex-1" asChild>
                      <Link to="/generator">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
