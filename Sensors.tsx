import { useAccelerometer, useGyroscope } from "@/hooks/use-mobile-sensors";
import { Compass, Move, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

function AxisBar({ label, value, max = 15, color }: { label: string, value: number, max?: number, color: string }) {
  const percent = Math.min((Math.abs(value) / max) * 100, 100);
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-muted-foreground">{label}-AXIS</span>
        <span className={color}>{value.toFixed(2)}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden flex items-center relative">
        <div className="absolute left-1/2 w-[1px] h-full bg-white/20" />
        <motion.div 
          className={`h-full ${color.replace('text-', 'bg-')} rounded-full absolute`}
          style={{ 
            width: `${percent / 2}%`,
            left: value < 0 ? `${50 - (percent/2)}%` : '50%'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}

export default function Sensors() {
  const accel = useAccelerometer();
  const gyro = useGyroscope();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sensor Suite</h1>
        <p className="text-muted-foreground mt-2">Real-time IMU and environmental data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Accelerometer */}
        <div className="tech-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Move className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Accelerometer</h3>
              <p className="text-xs text-muted-foreground">Linear acceleration (m/s²)</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <AxisBar label="X" value={accel.x} color="text-red-500" />
            <AxisBar label="Y" value={accel.y} color="text-green-500" />
            <AxisBar label="Z" value={accel.z} color="text-blue-500" />
          </div>

          <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-3 gap-2">
            {['x', 'y', 'z'].map((axis, i) => (
              <div key={axis} className="text-center p-3 rounded-lg bg-secondary/50">
                <span className="block text-xs text-muted-foreground uppercase">{axis}</span>
                <span className="font-mono text-sm font-bold">
                  {/* @ts-ignore */}
                  {accel[axis].toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gyroscope */}
        <div className="tech-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Gyroscope</h3>
              <p className="text-xs text-muted-foreground">Angular velocity (deg/s)</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <AxisBar label="ALPHA" value={gyro.alpha} max={360} color="text-purple-500" />
            <AxisBar label="BETA" value={gyro.beta} max={180} color="text-yellow-500" />
            <AxisBar label="GAMMA" value={gyro.gamma} max={90} color="text-pink-500" />
          </div>

          <div className="relative h-32 mt-6 flex items-center justify-center border border-border/50 rounded-xl bg-secondary/20 overflow-hidden">
            <motion.div 
              className="w-16 h-16 border-2 border-primary rounded-lg flex items-center justify-center"
              animate={{ 
                rotateX: gyro.beta,
                rotateY: gyro.gamma,
                rotateZ: gyro.alpha
              }}
              style={{ perspective: 1000 }}
            >
              <div className="w-2 h-2 bg-primary rounded-full" />
            </motion.div>
            <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">3D Visualization</span>
          </div>
        </div>

        {/* Compass / Magnetometer (Mock) */}
        <div className="tech-card p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Magnetometer</h3>
              <p className="text-xs text-muted-foreground">Direction & Field Strength</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
            <div className="relative w-48 h-48 rounded-full border-4 border-secondary flex items-center justify-center bg-card shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground font-mono">
                <span className="absolute top-2">N</span>
                <span className="absolute bottom-2">S</span>
                <span className="absolute left-2">W</span>
                <span className="absolute right-2">E</span>
              </div>
              
              <motion.div 
                className="w-1 h-24 bg-red-500 absolute top-12 origin-bottom" 
                style={{ rotate: 360 - gyro.alpha }}
              />
              <motion.div 
                className="w-1 h-24 bg-white/20 absolute bottom-12 origin-top" 
                style={{ rotate: 360 - gyro.alpha }}
              />
              <div className="w-4 h-4 bg-foreground rounded-full z-10" />
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
               <div className="p-4 rounded-xl bg-secondary/30">
                 <span className="text-xs text-muted-foreground">Heading</span>
                 <p className="text-2xl font-mono font-bold mt-1">{(360 - gyro.alpha).toFixed(0)}°</p>
               </div>
               <div className="p-4 rounded-xl bg-secondary/30">
                 <span className="text-xs text-muted-foreground">Field Strength</span>
                 <p className="text-2xl font-mono font-bold mt-1">48<span className="text-sm text-muted-foreground ml-1">µT</span></p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
