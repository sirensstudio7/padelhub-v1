"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  color: string;
  velocity: { x: number; y: number };
  alpha: number;
  lifetime: number;
  size: number;
}

interface Firework {
  x: number;
  y: number;
  color: string;
  velocity: { x: number; y: number };
  particles: Particle[];
  exploded: boolean;
  timeToExplode: number;
}

interface FireworksBackgroundProps {
  children: React.ReactNode;
  className?: string;
  /** When true, bursts emit from center (for podium avatar); otherwise classic rise-from-bottom */
  burstFromCenter?: boolean;
}

const COLORS = ["#9b87f5", "#D946EF", "#F97316", "#0EA5E9", "#ea384c", "#10B981", "#FCD34D", "#015f4d"];

function FireworksBackground({ children, className, burstFromCenter = false }: FireworksBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastFireworkTimeRef = useRef<number>(Date.now());
  const isDarkModeRef = useRef<boolean>(false);

  const explodeAt = (x: number, y: number, color: string) => {
    const particleCount = burstFromCenter ? 40 : 60 + Math.floor(Math.random() * 40);
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = (burstFromCenter ? 2 : 1) * (Math.random() * 5 + 1);
      particles.push({
        x,
        y,
        color,
        velocity: {
          x: Math.cos(angle) * velocity * (0.5 + Math.random()),
          y: Math.sin(angle) * velocity * (0.5 + Math.random()),
        },
        alpha: 1,
        lifetime: Math.random() * 30 + 30,
        size: burstFromCenter ? Math.random() * 2 + 0.5 : Math.random() * 3 + 1,
      });
    }
    fireworksRef.current.push({
      x,
      y,
      color,
      velocity: { x: 0, y: 0 },
      particles,
      exploded: true,
      timeToExplode: 0,
    });
  };

  const createFirework = (x?: number, y?: number, targetY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (burstFromCenter) {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      explodeAt(cx, cy, color);
      return;
    }

    const startX = x ?? Math.random() * canvas.width;
    const startY = canvas.height;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
    const velocity = 6 + Math.random() * 4;
    const target = targetY ?? canvas.height * (0.1 + Math.random() * 0.4);

    fireworksRef.current.push({
      x: startX,
      y: startY,
      color,
      velocity: {
        x: Math.sin(angle) * velocity,
        y: -Math.cos(angle) * velocity * 1.5,
      },
      particles: [],
      exploded: false,
      timeToExplode: target,
    });
  };

  const explodeFirework = (firework: Firework) => {
    const particleCount = 60 + Math.floor(Math.random() * 40);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 5 + 1;
      firework.particles.push({
        x: firework.x,
        y: firework.y,
        color: firework.color,
        velocity: {
          x: Math.cos(angle) * velocity * (0.5 + Math.random()),
          y: Math.sin(angle) * velocity * (0.5 + Math.random()),
        },
        alpha: 1,
        lifetime: Math.random() * 30 + 30,
        size: Math.random() * 3 + 1,
      });
    }
  };

  const updateAndDraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const fillStyle = isDarkModeRef.current ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.05)";
    if (burstFromCenter) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = fillStyle;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const current = fireworksRef.current;
    for (let i = 0; i < current.length; i++) {
      const f = current[i];

      if (!f.exploded) {
        f.x += f.velocity.x;
        f.y += f.velocity.y;
        f.velocity.y += 0.1;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = f.color;
        ctx.fill();
        if (
          f.y <= f.timeToExplode ||
          f.velocity.y >= 0 ||
          f.x < 0 ||
          f.x > canvas.width
        ) {
          if (f.y > 0 && f.y < canvas.height) explodeFirework(f);
          f.exploded = true;
        }
      } else {
        for (let j = 0; j < f.particles.length; j++) {
          const p = f.particles[j];
          p.x += p.velocity.x;
          p.y += p.velocity.y;
          p.velocity.y += burstFromCenter ? 0.02 : 0.05;
          p.alpha -= 1 / p.lifetime;
          if (p.alpha <= 0.1) {
            f.particles.splice(j, 1);
            j--;
            continue;
          }
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        if (f.particles.length === 0) {
          current.splice(i, 1);
          i--;
        }
      }
    }

    const now = Date.now();
    const interval = burstFromCenter ? 800 + Math.random() * 1200 : 1000 + Math.random() * 2000;
    if (now - lastFireworkTimeRef.current > interval) {
      const n = burstFromCenter ? 1 : Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < n; i++) createFirework();
      lastFireworkTimeRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(updateAndDraw);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const updateSize = () => {
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (parent) ro.observe(parent);

    const checkDark = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      isDarkModeRef.current = isDark;
    };
    checkDark();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", checkDark);

    if (burstFromCenter) {
      for (let i = 0; i < 2; i++) createFirework();
    } else {
      for (let i = 0; i < 3; i++) createFirework();
    }
    lastFireworkTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(updateAndDraw);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      if (parent) ro.unobserve(parent);
      mq.removeEventListener("change", checkDark);
    };
  }, [burstFromCenter]);

  return (
    <div className={cn("relative w-full", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ borderRadius: "inherit" }}
      />
      {children}
    </div>
  );
}

export default FireworksBackground;
