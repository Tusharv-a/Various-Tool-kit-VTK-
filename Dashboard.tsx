import { MetricCard } from "@/components/MetricCard";
import { Activity, Battery, Cpu, Wifi, Smartphone, HardDrive } from "lucide-react";
import { useAccelerometer, useNetworkStatus } from "@/hooks/use-mobile-sensors";
import { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Dashboard() {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const network = useNetworkStatus();
  const accel = useAccelerometer();

  useEffect(() => {
    // @ts-ignore
    navigator.getBattery?.().then((b: any) => {
      setBatteryLevel(Math.round(b.level * 100));
    });
  }, []);

  // Mock total storage
  const storageUsed = 64; // GB
  const storageTotal = 128; // GB

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground mt-2">Real-time device monitoring dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Battery Level"
          value={batteryLevel}
          unit="%"
          icon={Battery}
          delay={1}
          trend={batteryLevel < 20 ? "Low Power" : "Healthy"}
          trendUp={batteryLevel > 20}
        />
        <MetricCard
          title="Network Speed"
          value={network.downlink}
          unit="Mbps"
          icon={Wifi}
          delay={2}
          trend={network.type}
          trendUp={true}
        />
        <MetricCard
          title="Motion Intensity"
          value={(Math.abs(accel.x) + Math.abs(accel.y) + Math.abs(accel.z)).toFixed(1)}
          unit="m/s²"
          icon={Activity}
          delay={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 tech-card p-6">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            Device Health
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto">
                <CircularProgressbar 
                  value={batteryLevel} 
                  text={`${batteryLevel}%`} 
                  styles={buildStyles({
                    pathColor: `hsl(199, 89%, 48%)`,
                    textColor: '#fff',
                    trailColor: 'rgba(255,255,255,0.1)',
                    textSize: '16px'
                  })}
                />
              </div>
              <p className="text-sm text-muted-foreground">Battery Health</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto">
                <CircularProgressbar 
                  value={42} 
                  text={`42°C`} 
                  styles={buildStyles({
                    pathColor: `hsl(262, 83%, 58%)`,
                    textColor: '#fff',
                    trailColor: 'rgba(255,255,255,0.1)',
                    textSize: '16px'
                  })}
                />
              </div>
              <p className="text-sm text-muted-foreground">CPU Temp (Est)</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto">
                <CircularProgressbar 
                  value={(storageUsed/storageTotal) * 100} 
                  text={`${storageUsed}GB`} 
                  styles={buildStyles({
                    pathColor: `hsl(150, 60%, 50%)`,
                    textColor: '#fff',
                    trailColor: 'rgba(255,255,255,0.1)',
                    textSize: '16px'
                  })}
                />
              </div>
              <p className="text-sm text-muted-foreground">Storage Used</p>
            </div>
          </div>
        </div>

        <div className="tech-card p-6 flex flex-col justify-center gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> CPU Load
              </span>
              <span className="text-xs font-mono text-primary">45%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[45%] rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <HardDrive className="w-4 h-4" /> RAM Usage
              </span>
              <span className="text-xs font-mono text-accent">2.4 / 4 GB</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[60%] rounded-full" />
            </div>
          </div>

          <div className="mt-auto p-4 rounded-xl bg-primary/10 border border-primary/20">
            <h4 className="text-sm font-semibold text-primary mb-1">Status Report</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All sensors operational. Network latency low. Battery discharge rate normal. No thermal throttling detected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
