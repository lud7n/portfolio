"use client";

import { useEffect, useRef } from "react";

// プロジェクトのアクセントカラー（RGB）
const PROJECT_COLORS = [
  [99,  102, 241],  // indigo  #6366f1
  [16,  185, 129],  // emerald #10b981
  [245, 158, 11],   // amber   #f59e0b
  [139, 92,  246],  // violet  #8b5cf6
];

function lerpColor(a: number[], b: number[], t: number) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ラインの定義（x位置・太さ・透明度・ドリフト速度）
const LINES = [
  { x: 0.04,  w: 0.6, alpha: 0.35, drift: 0.008,  phase: 0.0  },
  { x: 0.13,  w: 1.2, alpha: 0.55, drift: -0.006, phase: 1.1  },
  { x: 0.22,  w: 0.5, alpha: 0.25, drift: 0.005,  phase: 2.3  },
  { x: 0.38,  w: 0.8, alpha: 0.40, drift: -0.009, phase: 0.7  },
  { x: 0.50,  w: 1.5, alpha: 0.60, drift: 0.007,  phase: 3.1  },
  { x: 0.62,  w: 0.6, alpha: 0.30, drift: -0.005, phase: 1.8  },
  { x: 0.75,  w: 1.0, alpha: 0.45, drift: 0.008,  phase: 4.2  },
  { x: 0.85,  w: 0.5, alpha: 0.28, drift: -0.006, phase: 2.9  },
  { x: 0.93,  w: 1.3, alpha: 0.50, drift: 0.004,  phase: 0.5  },
];

export default function ProjectsLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let scrollY = 0;
    let maxScroll = 1;
    const onScroll = () => {
      scrollY = window.scrollY;
      maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      onScroll();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;

    const render = () => {
      t += 0.012;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // スクロール進捗 0〜1 → 4プロジェクト × セクション
      const progress = scrollY / maxScroll; // 0〜1
      const colorProgress = progress * (PROJECT_COLORS.length - 1);
      const colorIdx = Math.floor(colorProgress);
      const colorT   = easeInOut(colorProgress - colorIdx);
      const colorA   = PROJECT_COLORS[Math.min(colorIdx,     PROJECT_COLORS.length - 1)];
      const colorB   = PROJECT_COLORS[Math.min(colorIdx + 1, PROJECT_COLORS.length - 1)];
      const rgb      = lerpColor(colorA, colorB, colorT);

      for (const line of LINES) {
        const xBase = line.x * w;
        const xDrift = Math.sin(t * line.drift * 10 + line.phase) * 18;
        const x = xBase + xDrift;

        // 縦グラデーション: 上下フェード、中央が最も明るい
        const grad = ctx.createLinearGradient(x, 0, x, h);
        grad.addColorStop(0,    `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 0)`);
        grad.addColorStop(0.15, `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, ${line.alpha * 0.4})`);
        grad.addColorStop(0.45, `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, ${line.alpha})`);
        grad.addColorStop(0.65, `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, ${line.alpha})`);
        grad.addColorStop(0.88, `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, ${line.alpha * 0.3})`);
        grad.addColorStop(1,    `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 0)`);

        // グロー（太い＋薄い）
        ctx.save();
        ctx.shadowColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 0.6)`;
        ctx.shadowBlur  = 12;
        ctx.strokeStyle = grad;
        ctx.lineWidth   = line.w * 2.5;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
        ctx.restore();

        // コアライン（細くシャープ）
        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth   = line.w;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
        ctx.restore();
      }

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
