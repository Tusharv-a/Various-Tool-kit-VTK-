import { Cpu, HardDrive, Smartphone, Monitor } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

export default function HardwarePage() {
  const hardware = {
    cores: navigator.hardwareConcurrency || 8,
    // @ts-ignore
    memory: navigator.deviceMemory || 8,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      pixelRatio: window.devicePixelRatio,
      colorDepth: window.screen.colorDepth
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hardware Info</h1>
        <p className="text-muted-foreground mt-2">Device specifications and capabilities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="CPU Cores"
          value={hardware.cores}
          icon={Cpu}
        />
        <MetricCard
          title="RAM (Approx)"
          value={`${hardware.memory}`}
          unit="GB"
          icon={HardDrive}
        />
        <MetricCard
          title="Resolution"
          value={`${hardware.screen.width}x${hardware.screen.height}`}
          icon={Monitor}
        />
        <MetricCard
          title="Pixel Density"
          value={`${hardware.screen.pixelRatio}x`}
          icon={Smartphone}
        />
      </div>

      <div className="tech-card p-6">
        <h3 className="font-semibold mb-6">Deep System Info</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-4">
             <h4 className="text-sm font-medium text-primary uppercase tracking-wider">Software Environment</h4>
             <div className="p-4 bg-secondary/30 rounded-lg font-mono text-xs break-all leading-relaxed">
               {hardware.userAgent}
             </div>
             <div className="flex justify-between p-3 border-b border-border/50">
               <span className="text-muted-foreground">Platform</span>
               <span className="font-mono">{hardware.platform}</span>
             </div>
             <div className="flex justify-between p-3 border-b border-border/50">
               <span className="text-muted-foreground">Language</span>
               <span className="font-mono">{navigator.language}</span>
             </div>
           </div>

           <div className="space-y-4">
             <h4 className="text-sm font-medium text-primary uppercase tracking-wider">Display Specs</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <span className="text-xs text-muted-foreground block">Color Depth</span>
                  <span className="text-xl font-mono">{hardware.screen.colorDepth}-bit</span>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <span className="text-xs text-muted-foreground block">Orientation</span>
                  <span className="text-xl font-mono">{screen.orientation.type.split('-')[0]}</span>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
