import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Battery, 
  Activity, 
  Cpu, 
  Wifi, 
  Stethoscope, 
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/battery", label: "Battery", icon: Battery },
  { href: "/sensors", label: "Sensors", icon: Activity },
  { href: "/hardware", label: "Hardware", icon: Cpu },
  { href: "/network", label: "Network", icon: Wifi },
  { href: "/diagnostics", label: "Diagnostics", icon: Stethoscope },
];

export function Sidebar() {
  const [location] = useLocation();

  const NavContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          VTK Toolset
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-mono">v2.4.0-build</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="p-4 rounded-xl bg-gradient-to-br from-secondary to-background border border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Online
          </div>
          <div className="w-full bg-secondary-foreground/10 h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[85%] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md border-primary/20">
              <Menu className="w-5 h-5 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-card border-r-border">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
