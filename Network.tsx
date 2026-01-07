import { useNetworkStatus } from "@/hooks/use-mobile-sensors";
import { Wifi, Globe, Server, Activity } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { useState, useEffect } from "react";

export default function NetworkPage() {
  const network = useNetworkStatus();
  const [ipData, setIpData] = useState<any>({ ip: 'Loading...', city: '-', org: '-' });

  useEffect(() => {
    // Fetch public IP using a free API
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => setIpData(data))
      .catch(() => setIpData({ ip: 'Unavailable', city: 'Unknown', org: 'Unknown' }));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Network Analysis</h1>
        <p className="text-muted-foreground mt-2">Connectivity status and speed metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Connection Type"
          value={network.type.toUpperCase()}
          icon={Wifi}
          trend={network.online ? "Online" : "Offline"}
          trendUp={network.online}
        />
        <MetricCard
          title="Downlink Speed"
          value={network.downlink}
          unit="Mbps"
          icon={Activity}
        />
        <MetricCard
          title="Latency (RTT)"
          value={network.rtt}
          unit="ms"
          icon={Server}
        />
        <MetricCard
          title="Public IP"
          value={ipData.ip}
          unit=""
          icon={Globe}
          className="md:col-span-2 lg:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="tech-card p-6">
          <h3 className="font-semibold mb-6">ISP Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between p-4 bg-secondary/30 rounded-lg">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-mono">{ipData.org}</span>
            </div>
            <div className="flex justify-between p-4 bg-secondary/30 rounded-lg">
              <span className="text-muted-foreground">Location</span>
              <span className="font-mono">{ipData.city}, {ipData.country_name}</span>
            </div>
            <div className="flex justify-between p-4 bg-secondary/30 rounded-lg">
              <span className="text-muted-foreground">Timezone</span>
              <span className="font-mono">{ipData.timezone}</span>
            </div>
          </div>
        </div>

        <div className="tech-card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center relative mb-4">
             <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-20" />
             <div className="text-3xl font-bold font-mono">{network.downlink}</div>
             <div className="absolute bottom-6 text-xs text-muted-foreground">Mbps</div>
          </div>
          <h3 className="font-semibold text-lg">Bandwidth Estimate</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Based on effective connection type API. Actual speedtest requires heavy data transfer.
          </p>
        </div>
      </div>
    </div>
  );
}
