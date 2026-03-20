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

    // F: カーソル位置・静止検知
    let mouseX = -9999;
    let mouseY = -9999;
    let hasMoved   = false;
    let lastMoveTime = Date.now(); // 0ではなく現在時刻で初期化
    let gatherStrength = 0;

    // I: スクロール速度
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hasMoved     = true;
      lastMoveTime = Date.now();
    };

    const onScroll = () => {
      const current = window.scrollY;
      const delta   = Math.abs(current - lastScrollY);
      scrollSpeed   = Math.min(delta * 0.3, 5);
      lastScrollY   = current;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll",    onScroll, { passive: true });

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
        size:         Math.random() * 1.4 + 0.4,
        opacity:      Math.random() * 0.45 + 0.15,
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed:  Math.random() * 0.008 + 0.003,
        wobbleAmp:    Math.random() * 0.6 + 0.2,
      }));
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;

      // F: カーソルが2秒静止したら gather 強度を上げる
      // hasMoved が true の場合のみ発動（初期状態では collect しない）
      const idle = Date.now() - lastMoveTime;
      if (hasMoved && idle > 2000) {
        gatherStrength = Math.min(1, gatherStrength + 0.003);
      } else {
        gatherStrength = Math.max(0, gatherStrength - 0.05);
      }

      // I: スクロール速度を減衰
      scrollSpeed *= 0.88;
      const speedMult = 1 + scrollSpeed;

      for (const p of particles) {
        const wobbleX = Math.sin(t * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmp * 0.04;
        const wobbleY = Math.cos(t * p.wobbleSpeed * 0.7 + p.wobbleOffset) * p.wobbleAmp * 0.04;

        // I: スクロール時は通常移動を加速
        p.x += (p.vx + wobbleX) * speedMult;
        p.y += (p.vy + wobbleY) * speedMult;

        // F: gather — 距離に応じた引力（スクロール倍率には乗せない）
        if (gatherStrength > 0) {
          const dx   = mouseX - p.x;
          const dy   = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          // 近いほど弱く（行き過ぎ防止）、遠いほど強く引く
          const force = Math.min(dist * 0.08, 2.5) * gatherStrength;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

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
      window.removeEventListener("scroll",    onScroll);
      window.removeEventListener("resize",    onResize);
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
