"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "TypeScript / React", level: 88, color: "from-cyan-400 to-blue-500" },
  { name: "UI / UX Design", level: 85, color: "from-pink-400 to-purple-500" },
  { name: "HTML / CSS", level: 90, color: "from-orange-400 to-rose-500" },
  { name: "Figma", level: 85, color: "from-purple-400 to-indigo-500" },
  { name: "C++", level: 75, color: "from-green-400 to-emerald-500" },
  { name: "Git / GitHub", level: 80, color: "from-indigo-400 to-purple-500" },
];

const techStack = [
  "TypeScript",
  "React",
  "Next.js",
  "HTML / CSS",
  "C++",
  "Figma",
  "Illustrator",
  "Photoshop",
  "MUI",
  "Git",
  "GitHub",
  "Tailwind",
];

const aiTools = [
  { name: "Claude / Claude Code", role: "メインコーディング" },
  { name: "ChatGPT", role: "サブコーディング・雑務" },
  { name: "Gemini", role: "サブコーディング・議事録" },
  { name: "NotebookLM", role: "ドキュメント整理" },
  { name: "Cursor", role: "個人開発メイン" },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skill-bar-fill",
        { width: "0%" },
        {
          width: (_, el: HTMLElement) => el.dataset.width + "%",
          duration: 1.4,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".skills-bars",
            start: "top 78%",
          },
        }
      );

      gsap.fromTo(
        ".tech-chip",
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          stagger: 0.04,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".tech-chips",
            start: "top 82%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-36 px-6 md:px-16 max-w-7xl mx-auto"
    >
      <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-purple-400 border border-purple-400/30 px-3 py-1.5 rounded-full mb-8">
        Skills
      </span>

      <h2 className="text-5xl md:text-6xl font-black mb-16 tracking-tight">
        What I{" "}
        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          work with
        </span>
      </h2>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Skill bars */}
        <div className="skills-bars space-y-7">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-2.5">
                <span className="text-sm font-medium text-white/75">{skill.name}</span>
                <span className="text-xs text-white/35 tabular-nums">{skill.level}%</span>
              </div>
              <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden">
                <div
                  className={`skill-bar-fill h-full rounded-full bg-gradient-to-r ${skill.color}`}
                  data-width={skill.level}
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack chips + AI Tools */}
        <div className="space-y-10">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-6">
              Tech Stack
            </p>
            <div className="tech-chips flex flex-wrap gap-2.5">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="tech-chip px-4 py-2 rounded-full border border-white/[0.09] bg-white/[0.04] text-xs text-white/60 hover:border-indigo-500/40 hover:text-white hover:bg-white/[0.08] transition-all duration-200 tracking-wide"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-6">
              AI Tools
            </p>
            <div className="space-y-2.5">
              {aiTools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:border-purple-500/30 hover:bg-white/[0.06] transition-all duration-200"
                >
                  <span className="text-xs font-medium text-white/70">{tool.name}</span>
                  <span className="text-[10px] text-white/30 tracking-wide">{tool.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
