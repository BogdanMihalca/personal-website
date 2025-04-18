"use client";
import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/lib/contexts/performance-mode";

interface RainEffectProps {
  intensity?: "light" | "moderate" | "heavy";
  color?: "cyan" | "purple" | "pink";
  className?: string;
}

class Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
  canvas: HTMLCanvasElement;
  baseColor: string;
  ctx: CanvasRenderingContext2D;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    baseColor: string
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.baseColor = baseColor;
    this.x = 0;
    this.y = 0;
    this.length = 0;
    this.speed = 0;
    this.opacity = 0;
    this.width = Math.random() * 1.5 + 0.5;
    this.reset();
  }

  reset(): void {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * -100;
    this.length = Math.random() * 10 + 5;
    this.speed = Math.random() * 5 + 10;
    this.opacity = Math.random() * 0.4 + 0.6;
  }

  draw(): void {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x, this.y + this.length);
    this.ctx.strokeStyle = this.baseColor;
    this.ctx.lineWidth = this.width;
    this.ctx.globalAlpha = this.opacity;
    this.ctx.stroke();
  }

  update(): void {
    this.y += this.speed;

    if (this.y > this.canvas.height) {
      this.reset();
    }

    this.draw();
  }
}

export const RainEffect = ({
  intensity = "moderate",
  color = "cyan",
  className,
}: RainEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const dropsRef = useRef<Drop[]>([]);
  const { reducedAnimations } = usePerformanceMode();

  const getDropCount = useCallback((): number => {
    if (reducedAnimations) {
      switch (intensity) {
        case "light":
          return 25;
        case "heavy":
          return 70;
        default:
          return 45; // moderate
      }
    }

    switch (intensity) {
      case "light":
        return 100;
      case "heavy":
        return 300;
      default:
        return 200; // moderate
    }
  }, [intensity, reducedAnimations]);

  const getDropColor = useCallback((): string => {
    switch (color) {
      case "purple":
        return "#B026FF";
      case "pink":
        return "#FF2D6C";
      default:
        return "#0FEFFD"; // cyan
    }
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = (): void => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      initDrops();
    };

    const initDrops = (): void => {
      const dropCount = getDropCount();
      const baseColor = getDropColor();

      dropsRef.current = [];

      for (let i = 0; i < dropCount; i++) {
        dropsRef.current.push(new Drop(canvas, ctx, baseColor));
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = (): void => {
      if (!reducedAnimations || Math.random() > 0.5) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      ctx.shadowBlur = reducedAnimations ? 2 : 5;
      ctx.shadowColor = getDropColor();

      const updateCount = reducedAnimations
        ? Math.ceil(dropsRef.current.length / 2)
        : dropsRef.current.length;

      for (let i = 0; i < updateCount; i++) {
        dropsRef.current[i].update();
      }

      if (reducedAnimations) {
        setTimeout(() => {
          animationRef.current = requestAnimationFrame(render);
        }, 40); // ~25 fps instead of 60fps
      } else {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [intensity, color, getDropCount, getDropColor, reducedAnimations]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none z-5", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      aria-hidden="true"
    />
  );
};
