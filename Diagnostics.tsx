import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Speaker, Mic, Camera, Fingerprint, Vibrate, Play, CheckCircle, XCircle } from "lucide-react";
import { useCreateDiagnostic, useDiagnostics } from "@/hooks/use-diagnostics";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Diagnostics() {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mutate: saveResult } = useCreateDiagnostic();
  const { data: history } = useDiagnostics();

  // Test Functions
  const testVibration = () => {
    setActiveTest('vibration');
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 500]);
      setTimeout(() => completeTest('Vibration', 'pass'), 1500);
    } else {
      completeTest('Vibration', 'fail', 'API not supported');
    }
  };

  const testSpeaker = () => {
    setActiveTest('speaker');
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
    setTimeout(() => completeTest('Speaker', 'pass'), 1200);
  };

  const testCamera = async () => {
    setActiveTest('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        completeTest('Camera', 'pass');
      }, 3000);
    } catch (e) {
      completeTest('Camera', 'fail', 'Permission denied or no device');
    }
  };

  const completeTest = (name: string, status: 'pass' | 'fail', details?: string) => {
    setActiveTest(null);
    saveResult({ toolName: name, status, details });
  };

  // Touch Test Setup
  useEffect(() => {
    if (activeTest === 'touch' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 4;

      const draw = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as MouseEvent).clientX - rect.left;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as MouseEvent).clientY - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      };

      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('touchmove', draw);
      
      return () => {
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('touchmove', draw);
      };
    }
  }, [activeTest]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Diagnostics</h1>
        <p className="text-muted-foreground mt-2">Hardware component verification tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Test Cards */}
        {[
          { id: 'speaker', name: 'Speaker Test', icon: Speaker, action: testSpeaker, desc: 'Plays 440Hz sine wave tone' },
          { id: 'vibration', name: 'Vibration Motor', icon: Vibrate, action: testVibration, desc: 'Triggers haptic feedback pattern' },
          { id: 'camera', name: 'Camera Feed', icon: Camera, action: testCamera, desc: 'Verifies video input stream' },
          { id: 'touch', name: 'Touch Screen', icon: Fingerprint, action: () => setActiveTest('touch'), desc: 'Interactive drawing canvas' },
        ].map((test) => (
          <div key={test.id} className="tech-card p-6 flex flex-col items-start gap-4 hover:border-primary/50 cursor-pointer" onClick={test.action}>
            <div className="p-3 bg-secondary rounded-xl">
              <test.icon className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{test.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{test.desc}</p>
            </div>
            <Button className="mt-auto w-full" disabled={activeTest !== null} variant="outline">
              {activeTest === test.id ? 'Testing...' : 'Run Test'}
            </Button>
          </div>
        ))}
      </div>

      {/* Active Test Modals / Areas */}
      {activeTest === 'camera' && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card p-4 rounded-2xl max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Camera Verification</h3>
            <video ref={videoRef} className="w-full rounded-lg bg-black aspect-video" />
            <p className="text-center mt-4 text-muted-foreground">Closing automatically in 3s...</p>
          </div>
        </div>
      )}

      {activeTest === 'touch' && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Touch Calibration</h3>
            <div className="flex gap-2">
              <Button onClick={() => completeTest('Touch Screen', 'fail')} variant="destructive">Fail</Button>
              <Button onClick={() => completeTest('Touch Screen', 'pass')} className="bg-green-600 hover:bg-green-700">Pass</Button>
            </div>
          </div>
          <canvas ref={canvasRef} className="flex-1 w-full rounded-xl border-2 border-dashed border-primary/50 touch-none" />
          <p className="text-center mt-2 text-muted-foreground">Draw on the screen to verify touch responsiveness</p>
        </div>
      )}

      {/* History Table */}
      <div className="tech-card p-6 mt-8">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Diagnostic History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
              <tr>
                <th className="px-6 py-3 rounded-l-lg">Test Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Details</th>
                <th className="px-6 py-3 rounded-r-lg">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {history?.map((result) => (
                <tr key={result.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium">{result.toolName}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      result.status === 'pass' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {result.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{result.details || '-'}</td>
                  <td className="px-6 py-4 font-mono text-xs">{format(new Date(result.createdAt!), 'MMM d, HH:mm:ss')}</td>
                </tr>
              ))}
              {(!history || history.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No diagnostic logs found. Run a test to see results here.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
