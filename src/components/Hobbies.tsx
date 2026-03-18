"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const hobbies = [
  {
    icon: "⌨️",
    title: "競技プログラミング",
    subtitle: "AtCoder — Highest: 緑上位",
    description:
      "大学2年生からAtCoderに継続的に取り組んでいます。アルゴリズムや数学的思考を磨きながら、実装力を鍛えています。公式基準では実務レベルのコーディング能力の目安とされる緑色上位に到達。",
    tags: ["AtCoder", "アルゴリズム", "C++", "競プロ"],
    accent: "border-cyan-500/30 hover:border-cyan-400/60",
    gradient: "from-cyan-500/10 to-blue-600/10",
    glow: "hover:shadow-[0_0_60px_rgba(0,180,216,0.12)]",
    tagColor: "bg-cyan-500/10 text-cyan-300",
  },
  {
    icon: "🧖",
    title: "サウナ",
    subtitle: "ととのう時間",
    description:
      "サウナで思考をリセットするのが好きです。水風呂と外気浴のルーティンで「ととのう」感覚が最高のリフレッシュになっています。開発に行き詰まったときのいい気分転換にもなっています。",
    tags: ["サウナ", "水風呂", "外気浴", "ととのう"],
    accent: "border-sky-500/30 hover:border-sky-400/60",
    gradient: "from-sky-500/10 to-teal-600/10",
    glow: "hover:shadow-[0_0_60px_rgba(14,165,233,0.12)]",
    tagColor: "bg-sky-500/10 text-sky-300",
  },
  {
    icon: "🎤",
    title: "アイドル",
    subtitle: "推し活",
    description:
      "アイドルのライブやコンテンツを楽しんでいます。好きなものに全力で向き合う姿勢に刺激を受けています。推し活を通じてエネルギーをチャージしています。",
    tags: ["ライブ", "推し活", "エンタメ"],
    accent: "border-teal-500/30 hover:border-teal-400/60",
    gradient: "from-teal-500/10 to-cyan-600/10",
    glow: "hover:shadow-[0_0_60px_rgba(20,184,166,0.12)]",
    tagColor: "bg-teal-500/10 text-teal-300",
  },
];

export default function Hobbies() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hobby-tag",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".hobby-heading",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".hobby-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hobbies-grid", start: "top 78%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hobbies"
      className="py-36 px-6 md:px-16 max-w-7xl mx-auto"
    >
      <span className="hobby-tag inline-block text-[10px] tracking-[0.35em] uppercase text-cyan-400 border border-cyan-400/30 px-3 py-1.5 rounded-full mb-8">
        Hobbies
      </span>

      <h2 className="hobby-heading text-5xl md:text-6xl font-black mb-16 tracking-tight">
        好きな{" "}
        <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          こと
        </span>
      </h2>

      <div className="hobbies-grid grid md:grid-cols-3 gap-6">
        {hobbies.map((hobby) => (
          <div
            key={hobby.title}
            className={`hobby-card group relative p-8 rounded-3xl border ${hobby.accent} bg-gradient-to-br ${hobby.gradient} backdrop-blur-sm transition-all duration-400 ${hobby.glow} overflow-hidden`}
          >
            <div className="text-5xl mb-6">{hobby.icon}</div>

            <h3 className="text-xl font-bold mb-1 text-white/90">{hobby.title}</h3>
            <p className="text-xs text-white/35 tracking-wide mb-4">{hobby.subtitle}</p>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              {hobby.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {hobby.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[11px] px-3 py-1 rounded-full ${hobby.tagColor} tracking-wide`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
