"use client";

import { useEffect, useState } from "react";

export default function InteractiveBackground() {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-startup-template absolute inset-[-8%] opacity-95 dark:opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_20%,rgba(15,23,42,0.05)_84%,rgba(15,23,42,0.08)_100%)] dark:bg-[radial-gradient(circle_at_50%_45%,transparent_12%,rgba(2,6,23,0.22)_82%,rgba(2,6,23,0.4)_100%)]" />
      <div className="bg-premium-grain absolute inset-0 opacity-[0.05]" />

      <div className="bg-startup-float absolute left-[14%] top-[20%] h-1.5 w-1.5 rounded-full bg-sky-300/32 [animation-delay:0.2s]" />
      <div className="bg-startup-float absolute left-[76%] top-[22%] h-1.5 w-1.5 rounded-full bg-emerald-300/28 [animation-delay:1s]" />

      <div
        className="absolute h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/8 blur-3xl transition-all duration-1000 dark:bg-sky-300/9"
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
      />
      <div
        className="absolute h-[14rem] w-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/7 blur-3xl transition-all duration-1000 dark:bg-emerald-300/8"
        style={{ left: `${100 - position.x}%`, top: `${100 - position.y}%` }}
      />
    </div>
  );
}
