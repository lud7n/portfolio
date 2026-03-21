"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

// ─── Variant A: Circular gauge + count-up ─────────────────────────────────────
const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function VariantA({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const numEl = numRef.current;
    const arc = arcRef.current;
    if (!overlay || !numEl || !arc) return;

    // A: 冷色スレート → 暖色アンバー
    const coldR = 148, coldG = 163, coldB = 184;
    const warmR = 180, warmG = 140, warmB = 90;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(obj.val);
        const t = obj.val / 100;

        numEl.textContent = String(v);

        // D: 色相シフト
        const r = Math.round(coldR + (warmR - coldR) * t);
        const g = Math.round(coldG + (warmG - coldG) * t);
        const b = Math.round(coldB + (warmB - coldB) * t);
        const color = `rgba(${r},${g},${b},0.9)`;
        numEl.style.color = color;
        arc.style.stroke = color;

        // 円弧の進捗
        arc.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - t));

        // 背景透過 + ぼかし解除
        overlay.style.backgroundColor = `rgba(0,0,0,${1 - t})`;
        overlay.style.backdropFilter = `blur(${(1 - t) * 18}px)`;
      },
      onComplete,
    });
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
    >
      {/* 円ゲージ */}
      <div className="relative flex items-center justify-center">
        <svg
          width={RADIUS * 2 + 24}
          height={RADIUS * 2 + 24}
          className="absolute"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* トラック */}
          <circle
            cx={RADIUS + 12}
            cy={RADIUS + 12}
            r={RADIUS}
            fill="none"
            stroke="rgba(148,163,184,0.08)"
            strokeWidth={1}
          />
          {/* ゲージ */}
          <circle
            ref={arcRef}
            cx={RADIUS + 12}
            cy={RADIUS + 12}
            r={RADIUS}
            fill="none"
            stroke="rgba(148,163,184,0.9)"
            strokeWidth={1}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            strokeLinecap="round"
          />
        </svg>

        {/* 中央テキスト */}
        <div className="flex flex-col items-center gap-3">
          <span
            className="text-[9px] tracking-[0.45em] uppercase"
            style={{ color: "rgba(148,163,184,0.35)" }}
          >
            lud7n
          </span>
          <div className="flex items-end gap-1 leading-none">
            <span
              ref={numRef}
              className="text-4xl font-black tabular-nums"
              style={{ color: "rgba(148,163,184,0.9)" }}
            >
              0
            </span>
            <span
              className="text-sm font-black mb-0.5"
              style={{ color: "rgba(148,163,184,0.3)" }}
            >
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Variant C: Particle convergence → explosion ───────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  ex: number;
  ey: number;
  size: number;
  opacity: number;
}

function VariantC({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const COUNT = 200;

    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 150 + Math.random() * Math.max(cx, cy);
      const exAngle = Math.random() * Math.PI * 2;
      const exDist = 400 + Math.random() * 900;
      return {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        tx: cx + (Math.random() - 0.5) * 24,
        ty: cy + (Math.random() - 0.5) * 24,
        ex: cx + Math.cos(exAngle) * exDist,
        ey: cy + Math.sin(exAngle) * exDist,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.25,
      };
    });

    const CONVERGE_DUR = 90; // ~1.5s @ 60fps
    const HOLD_DUR = 14;
    const EXPLODE_DUR = 40;

    let phase = 0;
    let convergeProgress = 0;
    let holdFrames = 0;
    let explodeProgress = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (phase === 0) {
        // ── Converge ──
        convergeProgress = Math.min(convergeProgress + 1 / CONVERGE_DUR, 1);
        const t = easeInOut(convergeProgress);
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(lerp(p.x, p.tx, t), lerp(p.y, p.ty, t), p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(248,248,246,${p.opacity})`;
          ctx.fill();
        }
        if (convergeProgress >= 1) phase = 1;
      } else if (phase === 1) {
        // ── Hold + pulse ──
        holdFrames++;
        const pulse = Math.sin((holdFrames / HOLD_DUR) * Math.PI);
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(p.tx, p.ty, p.size * (1 + pulse * 2.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(248,248,246,${Math.min(1, p.opacity * (1 + pulse * 0.8))})`;
          ctx.fill();
        }
        if (holdFrames >= HOLD_DUR) phase = 2;
      } else if (phase === 2) {
        // ── Explode ──
        explodeProgress = Math.min(explodeProgress + 1 / EXPLODE_DUR, 1);
        const t = easeOut(explodeProgress);
        for (const p of particles) {
          const opacity = p.opacity * (1 - explodeProgress);
          ctx.beginPath();
          ctx.arc(lerp(p.tx, p.ex, t), lerp(p.ty, p.ey, t), p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(248,248,246,${opacity})`;
          ctx.fill();
        }
        if (explodeProgress >= 1) {
          cancelAnimationFrame(animId);
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete,
          });
          return;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────
export default function LoadingScreen({
  variant,
  onComplete,
}: {
  variant: "A" | "C";
  onComplete: () => void;
}) {
  return variant === "A" ? (
    <VariantA onComplete={onComplete} />
  ) : (
    <VariantC onComplete={onComplete} />
  );
}
