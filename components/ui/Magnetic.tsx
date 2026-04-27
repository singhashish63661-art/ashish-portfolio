"use client";

import { useState, type ReactNode, type MouseEvent } from "react";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export default function Magnetic({ children, className, strength = 18 }: MagneticProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    setOffset({
      x: (x / (rect.width / 2)) * strength,
      y: (y / (rect.height / 2)) * strength,
    });
  };

  const onMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: "transform 180ms ease-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
