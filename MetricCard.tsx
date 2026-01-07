import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: any;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  delay?: number;
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend,
  trendUp,
  className,
  delay = 0 
}: MetricCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className={cn("tech-card p-6 flex flex-col justify-between relative overflow-hidden group", className)}
    >
      <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-24 h-24" />
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trendUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold font-mono tracking-tight text-foreground">
            {value}
          </span>
          {unit && <span className="text-sm text-muted-foreground font-mono">{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
}
