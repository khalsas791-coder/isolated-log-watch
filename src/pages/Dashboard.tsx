import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, FileText, Activity, Upload, LogOut, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalLogs: number;
  activeThreats: number;
  criticalAlerts: number;
  systemsMonitored: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalLogs: 0,
    activeThreats: 0,
    criticalAlerts: 0,
    systemsMonitored: 0,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const [logsResult, threatsResult, alertsResult] = await Promise.all([
        supabase.from("logs").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("threats").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "open"),
        supabase.from("alerts").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("severity", "critical").eq("is_read", false),
      ]);

      setStats({
        totalLogs: logsResult.count ?? 0,
        activeThreats: threatsResult.count ?? 0,
        criticalAlerts: alertsResult.count ?? 0,
        systemsMonitored: 3,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SecureLogAnalyzer</h1>
              <p className="text-sm text-muted-foreground">Security Operations Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Security Analyst</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border hover:shadow-[var(--shadow-card)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Logs</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalLogs.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Collected and analyzed</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-[var(--shadow-card)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-threat-high" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-threat-high">{stats.activeThreats}</div>
              <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-[var(--shadow-card)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-threat-critical" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-threat-critical">{stats.criticalAlerts}</div>
              <p className="text-xs text-muted-foreground mt-1">Unread critical</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-[var(--shadow-card)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Systems</CardTitle>
              <Activity className="h-4 w-4 text-threat-info" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.systemsMonitored}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently monitored</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with log analysis</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Logs
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              View All Logs
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Active Threats
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Welcome Message */}
        <Card className="border-border mt-6 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Welcome to SecureLogAnalyzer</h3>
                <p className="text-muted-foreground mb-4">
                  Your portable, self-contained log analysis tool for cyber security monitoring. 
                  Upload logs from various sources (Syslog, FTP, USB) and detect threats using 
                  advanced analysis techniques including signature, anomaly, and behavioral detection.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    Offline Capable
                  </span>
                  <span className="px-3 py-1 bg-threat-info/10 text-threat-info text-sm rounded-full">
                    Multi-source Collection
                  </span>
                  <span className="px-3 py-1 bg-threat-low/10 text-threat-low text-sm rounded-full">
                    Real-time Analysis
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
