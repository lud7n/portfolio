"use client";

import { useEffect, useRef } from "react";

export default function SkillsAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;

    // シンプルなノイズ代わりにsin/cosを組み合わせた疑似オーロラ
    const render = () => {
      t += 0.004;
      const w = canvas.width;
      const h = canvas.height;
      const scroll = scrollY * 0.0003;

      ctx.clearRect(0, 0, w, h);

      // 3〜4個の楕円グラデーションをブレンド
      // scrollで色相をわずかにシフトさせつつ、ブロブはビューポート全体をカバー
      const s = scroll * 0.15;
      const blobs = [
        { x: 0.25 + Math.sin(t * 0.7) * 0.12, y: 0.25 + Math.cos(t * 0.5) * 0.08 + s, rx: 0.65, ry: 0.5,  color: "99,102,241",   alpha: 0.38 },
        { x: 0.78 + Math.cos(t * 0.6) * 0.1,  y: 0.5  + Math.sin(t * 0.4) * 0.1  + s, rx: 0.6,  ry: 0.48, color: "139,92,246",  alpha: 0.32 },
        { x: 0.5  + Math.sin(t * 0.5) * 0.09, y: 0.15 + Math.cos(t * 0.8) * 0.07 + s, rx: 0.5,  ry: 0.4,  color: "6,182,212",   alpha: 0.25 },
        { x: 0.15 + Math.cos(t * 0.9) * 0.07, y: 0.72 + Math.sin(t * 0.6) * 0.08 + s, rx: 0.45, ry: 0.38, color: "129,140,248", alpha: 0.28 },
        { x: 0.65 + Math.sin(t * 0.4) * 0.08, y: 0.85 + Math.cos(t * 0.7) * 0.07 + s, rx: 0.5,  ry: 0.42, color: "99,102,241",  alpha: 0.25 },
        { x: 0.35 + Math.cos(t * 0.5) * 0.1,  y: 0.62 + Math.sin(t * 0.5) * 0.08 + s, rx: 0.45, ry: 0.36, color: "139,92,246",  alpha: 0.22 },
      ];

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (const b of blobs) {
        const cx = b.x * w;
        const cy = b.y * h;
        const rx = b.rx * w;
        const ry = b.ry * h;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
        grad.addColorStop(0,   `rgba(${b.color}, ${b.alpha})`);
        grad.addColorStop(0.5, `rgba(${b.color}, ${b.alpha * 0.4})`);
        grad.addColorStop(1,   `rgba(${b.color}, 0)`);

        ctx.save();
        ctx.scale(1, ry / rx);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy * (rx / ry), rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
