import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Database, Zap, Globe, FileSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      } else {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <Shield className="h-12 w-12 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-threat-info/5" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-2xl backdrop-blur-sm">
                <Shield className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              SecureLogAnalyzer
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Advanced portable log analysis tool for isolated network monitoring and threat detection
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8">
                Sign In
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <span className="px-4 py-2 bg-card border border-border rounded-full flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Offline Capable</span>
              </span>
              <span className="px-4 py-2 bg-card border border-border rounded-full flex items-center gap-2">
                <Lock className="h-4 w-4 text-threat-info" />
                <span>Secure by Design</span>
              </span>
              <span className="px-4 py-2 bg-card border border-border rounded-full flex items-center gap-2">
                <Zap className="h-4 w-4 text-threat-medium" />
                <span>Real-time Detection</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive security monitoring designed for isolated networks and central SOC operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-card border border-border rounded-lg hover:shadow-[var(--shadow-card)] transition-all">
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-source Collection</h3>
            <p className="text-muted-foreground">
              Collect logs from Syslog, FTP, USB, and network devices using standard protocols
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg hover:shadow-[var(--shadow-card)] transition-all">
            <div className="p-3 bg-threat-info/10 rounded-lg w-fit mb-4">
              <FileSearch className="h-6 w-6 text-threat-info" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Advanced Analysis</h3>
            <p className="text-muted-foreground">
              Detect threats using signature, anomaly, heuristic, and behavioral analysis techniques
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg hover:shadow-[var(--shadow-card)] transition-all">
            <div className="p-3 bg-threat-medium/10 rounded-lg w-fit mb-4">
              <Zap className="h-6 w-6 text-threat-medium" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
            <p className="text-muted-foreground">
              Continuous monitoring with near real-time threat detection and alerting
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg hover:shadow-[var(--shadow-card)] transition-all">
            <div className="p-3 bg-threat-low/10 rounded-lg w-fit mb-4">
              <Globe className="h-6 w-6 text-threat-low" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Isolated Network Support</h3>
            <p className="text-muted-foreground">
              Fully functional without internet access, perfect for air-gapped environments
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg hover:shadow-[var(--shadow-card)] transition-all">
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-muted-foreground">
              All data stays within your infrastructure with optional authentication controls
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg hover:shadow-[var(--shadow-card)] transition-all">
            <div className="p-3 bg-threat-info/10 rounded-lg w-fit mb-4">
              <Shield className="h-6 w-6 text-threat-info" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Portable Deployment</h3>
            <p className="text-muted-foreground">
              Easy deployment across Windows, Linux, and Mac with minimal setup required
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center p-12 bg-gradient-to-br from-primary/10 to-threat-info/5 rounded-2xl border border-border">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Secure Your Network?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start monitoring your systems and detecting threats today
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
            Get Started Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">SecureLogAnalyzer</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SecureLogAnalyzer. Advanced Security Monitoring Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
