import { useState, useEffect } from "react";

// Mock data generator for desktop testing
const useMock = !('DeviceMotionEvent' in window);

export function useAccelerometer() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (useMock) {
      const interval = setInterval(() => {
        setData({
          x: Math.sin(Date.now() / 1000) * 5,
          y: Math.cos(Date.now() / 800) * 5,
          z: 9.8 + Math.sin(Date.now() / 500),
        });
      }, 100);
      return () => clearInterval(interval);
    }

    const handler = (event: DeviceMotionEvent) => {
      setData({
        x: event.accelerationIncludingGravity?.x || 0,
        y: event.accelerationIncludingGravity?.y || 0,
        z: event.accelerationIncludingGravity?.z || 0,
      });
    };

    window.addEventListener("devicemotion", handler);
    return () => window.removeEventListener("devicemotion", handler);
  }, []);

  return data;
}

export function useGyroscope() {
  const [data, setData] = useState({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    if (useMock) {
      const interval = setInterval(() => {
        setData({
          alpha: (Date.now() / 100) % 360,
          beta: Math.sin(Date.now() / 1000) * 90,
          gamma: Math.cos(Date.now() / 1000) * 90,
        });
      }, 100);
      return () => clearInterval(interval);
    }

    const handler = (event: DeviceOrientationEvent) => {
      setData({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      });
    };

    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, []);

  return data;
}

export function useNetworkStatus() {
  const [status, setStatus] = useState<any>({
    online: navigator.onLine,
    downlink: 0,
    rtt: 0,
    type: 'unknown'
  });

  useEffect(() => {
    const updateStatus = () => {
      // @ts-ignore - Network Information API
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      setStatus({
        online: navigator.onLine,
        downlink: conn?.downlink || 0,
        rtt: conn?.rtt || 0,
        type: conn?.effectiveType || 'unknown'
      });
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    // @ts-ignore
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) conn.addEventListener('change', updateStatus);

    updateStatus();

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (conn) conn.removeEventListener('change', updateStatus);
    };
  }, []);

  return status;
}
