import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Battery as BatteryIcon, Zap, Clock, AlertTriangle } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { useBatteryLogs, useCreateBatteryLog } from "@/hooks/use-battery-logs";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function BatteryPage() {
  const [battery, setBattery] = useState<any>(null);
  const { data: logs } = useBatteryLogs();
  const { mutate: logBattery } = useCreateBatteryLog();

  useEffect(() => {
    // @ts-ignore
    navigator.getBattery?.().then((b: any) => {
      setBattery(b);
      
      const updateBattery = () => {
        setBattery({...b});
        logBattery({
          level: (b.level * 100).toString(),
          isCharging: b.charging
        });
      };

      b.addEventListener('levelchange', updateBattery);
      b.addEventListener('chargingchange', updateBattery);
      
      // Initial log
      logBattery({
        level: (b.level * 100).toString(),
        isCharging: b.charging
      });

      return () => {
        b.removeEventListener('levelchange', updateBattery);
        b.removeEventListener('chargingchange', updateBattery);
      };
    });
  }, []);

  // Format logs for chart
  const chartData = logs?.map(log => ({
    time: format(new Date(log.timestamp!), 'HH:mm'),
    level: parseInt(log.level)
  })).slice(-20) || []; // Last 20 readings

  const level = battery ? Math.round(battery.level * 100) : 0;
  const isCharging = battery?.charging;
  const chargingTime = battery?.chargingTime;
  const dischargingTime = battery?.dischargingTime;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Battery Manager</h1>
          <p className="text-muted-foreground mt-2">Advanced power analysis and history</p>
        </div>
        
        {isCharging && (
          <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 flex items-center gap-2 animate-pulse">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold">Charging Active</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Current Level"
          value={level}
          unit="%"
          icon={BatteryIcon}
          trend={isCharging ? "Charging" : "Discharging"}
          trendUp={isCharging}
        />
        <MetricCard
          title="Voltage (Est)"
          value="4.2"
          unit="V"
          icon={Zap}
        />
        <MetricCard
          title="Time Remaining"
          value={dischargingTime === Infinity ? "Calculating..." : Math.round(dischargingTime/60)}
          unit={dischargingTime === Infinity ? "" : "min"}
          icon={Clock}
        />
        <MetricCard
          title="Health Status"
          value="Good"
          unit=""
          icon={AlertTriangle}
          trend="Li-Ion"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 tech-card p-6 h-[400px]">
          <h3 className="font-semibold mb-6">Discharge History</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="level" 
                stroke="hsl(199, 89%, 48%)" 
                fillOpacity={1} 
                fill="url(#colorLevel)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="tech-card p-6">
          <h3 className="font-semibold mb-4">Battery Optimization</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Battery Alarm</span>
                <Button variant="outline" size="sm" className="h-7 text-xs">Configure</Button>
              </div>
              <p className="text-xs text-muted-foreground">Alert when charge reaches 100% or drops below 15%</p>
            </div>

            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Screen Time</span>
                <span className="text-primary font-mono text-sm">4h 12m</span>
              </div>
              <div className="w-full h-1 bg-background rounded-full overflow-hidden mt-2">
                <div className="w-[60%] h-full bg-accent rounded-full" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <h4 className="font-medium mb-3">Power Consumers</h4>
              <ul className="space-y-2">
                {['Display', 'WiFi Radio', 'CPU'].map((item, i) => (
                  <li key={item} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item}</span>
                    <span className="font-mono text-foreground">{40 - (i*10)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
