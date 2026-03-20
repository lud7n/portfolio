"use client";

import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  wobbleOffset: number;
  wobbleSpeed: number;
  wobbleAmp: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    // F: カーソル追従・静止検知
    let mouseX = -9999;
    let mouseY = -9999;
    let lastMoveTime = 0;
    let gatherStrength = 0;

    // I: スクロール速度
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveTime = Date.now();
    };

    const onScroll = () => {
      const current = window.scrollY;
      const delta = Math.abs(current - lastScrollY);
      scrollSpeed = Math.min(delta * 0.25, 4);
      lastScrollY = current;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 400);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        size: Math.random() * 1.4 + 0.4,
        opacity: Math.random() * 0.45 + 0.15,
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.008 + 0.003,
        wobbleAmp: Math.random() * 0.6 + 0.2,
      }));
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;

      // F: 静止 2秒後からgather強度を上げる、動くとリセット
      const idle = Date.now() - lastMoveTime;
      if (idle > 2000) {
        gatherStrength = Math.min(1, gatherStrength + 0.002);
      } else {
        gatherStrength = Math.max(0, gatherStrength - 0.06);
      }

      // I: スクロール速度を減衰
      scrollSpeed *= 0.88;
      const speedMult = 1 + scrollSpeed;

      for (const p of particles) {
        const wobbleX = Math.sin(t * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmp * 0.04;
        const wobbleY = Math.cos(t * p.wobbleSpeed * 0.7 + p.wobbleOffset) * p.wobbleAmp * 0.04;

        let dvx = 0;
        let dvy = 0;

        // F: カーソル方向へ引力
        if (gatherStrength > 0) {
          const dx   = mouseX - p.x;
          const dy   = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = gatherStrength * 0.012;
          dvx = (dx / dist) * force;
          dvy = (dy / dist) * force;
        }

        // I: スクロール速度でwobble量を増幅
        p.x += (p.vx + wobbleX * speedMult + dvx) * speedMult;
        p.y += (p.vy + wobbleY * speedMult + dvy) * speedMult;

        if (p.x < -2) p.x = canvas.width + 2;
        if (p.x > canvas.width + 2) p.x = -2;
        if (p.y < -2) p.y = canvas.height + 2;
        if (p.y > canvas.height + 2) p.y = -2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 248, 246, ${p.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    const onResize = () => { resize(); createParticles(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
