"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { FaCode, FaLayerGroup, FaHeart } from "react-icons/fa";
import type { IconType } from "react-icons";

// ── A: カラー Circle Reveal ──────────────────────────────
function runColorReveal(originEl: HTMLElement, color: string, onDone: () => void) {
  const rect = originEl.getBoundingClientRect();
  const ox   = rect.left + rect.width  / 2;
  const oy   = rect.top  + rect.height / 2;
  const size = rect.width;

  const div = document.createElement("div");
  div.style.cssText = `
    position: fixed; z-index: 9999; border-radius: 50%;
    background: ${color}; pointer-events: none;
    width: ${size}px; height: ${size}px;
    left: ${ox - size / 2}px; top: ${oy - size / 2}px;
    transform: scale(1); transform-origin: center center;
  `;
  document.body.appendChild(div);

  const maxDist = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
  gsap.to(div, {
    scale: (maxDist * 2) / size,
    duration: 0.65,
    ease: "power3.inOut",
    onComplete: () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onDone();
          setTimeout(() => { if (document.body.contains(div)) document.body.removeChild(div); }, 500);
        });
      });
    },
  });
}

// ── Button ───────────────────────────────────────────────
type RevealMode = { type: "color"; color: string };

type ButtonColor = { ring: string; glow: string; label: string };

function CTAButton({
  label, href, reveal, Icon, iconClass, color,
}: {
  label: string;
  href: string;
  reveal: RevealMode;
  Icon: IconType;
  iconClass: string;
  color: ButtonColor;
}) {
  const router = useRouter();
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    const el = btnRef.current;
    if (!el) return;
    const ring    = el.querySelector(".cta-ring")  as HTMLElement;
    const icon    = el.querySelector(".cta-icon")  as HTMLElement;
    const labelEl = el.querySelector(".cta-label") as HTMLElement;

    gsap.to(icon, { scale: 1.25, duration: 0.4, ease: "power2.out" });
    gsap.to(ring, { scale: 1.12, duration: 0.4, ease: "power2.out" });
    ring.style.borderColor = color.ring;
    ring.style.boxShadow   = `0 0 18px 4px ${color.glow}, inset 0 0 8px 1px ${color.glow}`;
    labelEl.style.color    = color.label;
  };

  const handleMouseLeave = () => {
    const el = btnRef.current;
    if (!el) return;
    const ring    = el.querySelector(".cta-ring")  as HTMLElement;
    const icon    = el.querySelector(".cta-icon")  as HTMLElement;
    const labelEl = el.querySelector(".cta-label") as HTMLElement;

    gsap.to(icon, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    gsap.to(ring, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    ring.style.borderColor = "rgba(255,255,255,0.2)";
    ring.style.boxShadow   = "none";
    labelEl.style.color    = "rgba(255,255,255,0.25)";
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const ring = btnRef.current?.querySelector(".cta-ring") as HTMLElement;
    runColorReveal(ring ?? (btnRef.current as HTMLElement), reveal.color, () => router.push(href));
  };

  return (
    <a
      ref={btnRef}
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center gap-3 cursor-pointer w-14"
    >
      <div
        className="cta-ring w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
        style={{
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.03)",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <Icon
          className={`cta-icon ${iconClass}`}
          size={14}
          style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.3s ease" }}
        />
      </div>
      <span
        className="cta-label text-[9px] tracking-[0.3em] uppercase"
        style={{ color: "rgba(255,255,255,0.25)", transition: "color 0.3s ease" }}
      >
        {label}
      </span>
    </a>
  );
}

// ── ScrollCTA ────────────────────────────────────────────
export default function ScrollCTA() {
  return (
    <>
      <style>{`
        @keyframes cursor-blink {
          0%, 48%  { opacity: 1; }
          50%, 98% { opacity: 0.15; }
          100%     { opacity: 1; }
        }
        .icon-skills { animation: cursor-blink 1.2s step-end infinite; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .icon-projects { animation: spin-slow 8s linear infinite; }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14%      { transform: scale(1.3); }
          28%      { transform: scale(1); }
          42%      { transform: scale(1.18); }
          56%      { transform: scale(1); }
        }
        .icon-hobbies { animation: heartbeat 2s ease-in-out infinite; }

        a:hover .icon-skills,
        a:hover .icon-projects,
        a:hover .icon-hobbies { animation-play-state: paused; }
      `}</style>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-end gap-8">
        <CTAButton
          label="Skills" href="/skills"
          reveal={{ type: "color", color: "#3730a3" }}
          Icon={FaCode} iconClass="icon-skills"
          color={{ ring: "rgba(99,102,241,0.7)", glow: "rgba(99,102,241,0.35)", label: "rgba(129,140,248,0.9)" }}
        />
        <CTAButton
          label="Projects" href="/projects"
          reveal={{ type: "color", color: "#065f46" }}
          Icon={FaLayerGroup} iconClass="icon-projects"
          color={{ ring: "rgba(16,185,129,0.7)", glow: "rgba(16,185,129,0.3)", label: "rgba(52,211,153,0.9)" }}
        />
        <CTAButton
          label="Hobbies" href="/hobbies"
          reveal={{ type: "color", color: "#4c0519" }}
          Icon={FaHeart} iconClass="icon-hobbies"
          color={{ ring: "rgba(244,63,94,0.7)", glow: "rgba(244,63,94,0.3)", label: "rgba(251,113,133,0.9)" }}
        />
      </div>
    </>
  );
}
