import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";
import BatteryPage from "@/pages/Battery";
import Sensors from "@/pages/Sensors";
import Hardware from "@/pages/Hardware";
import NetworkPage from "@/pages/Network";
import Diagnostics from "@/pages/Diagnostics";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <div className="scanline" /> {/* Retro CRT effect overlay */}
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen relative z-10">
        <div className="max-w-6xl mx-auto pb-20">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/battery" component={BatteryPage} />
            <Route path="/sensors" component={Sensors} />
            <Route path="/hardware" component={Hardware} />
            <Route path="/network" component={NetworkPage} />
            <Route path="/diagnostics" component={Diagnostics} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
