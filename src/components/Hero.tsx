"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleField from "@/components/ParticleField";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 入場アニメーション
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(
        ".hero-line-1",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power4.out" }
      )
        .fromTo(
          ".hero-line-2",
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "power4.out" },
          "-=0.75"
        )
        .fromTo(
          ".hero-meta",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".hero-scroll",
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.2"
        );

      // スクロールパララックス（各レイヤーを異なる速度で動かす）
      gsap.to(".hero-line-1", {
        yPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".hero-line-2", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".hero-meta", {
        yPercent: -8,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "40% top",
          scrub: 1,
        },
      });

      // H: テキストの呼吸アニメーション（入場完了後にスタート）
      gsap.to(".hero-line-1 h1", {
        scale: 1.003,
        repeat: -1,
        yoyo: true,
        duration: 3.8,
        ease: "sine.inOut",
        delay: 2.2,
        transformOrigin: "left center",
      });
      gsap.to(".hero-line-2 h1", {
        scale: 1.003,
        repeat: -1,
        yoyo: true,
        duration: 4.2,
        ease: "sine.inOut",
        delay: 2.8,
        transformOrigin: "left center",
      });

      // B: スクロールで文字が飛び散る
      const chars = gsap.utils.toArray<HTMLElement>(".hero-char");
      chars.forEach((char) => {
        const tx = (Math.random() - 0.5) * window.innerWidth * 1.4;
        const ty = (Math.random() - 0.5) * window.innerHeight * 1.2;
        const rot = (Math.random() - 0.5) * 720;
        gsap.to(char, {
          x: tx,
          y: ty,
          rotation: rot,
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "60% top",
            scrub: 1,
          },
        });
      });

      // 背景の大きな文字もゆっくり動く
      gsap.to(".hero-bg-text", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-screen w-full overflow-hidden flex flex-col justify-center px-8 md:px-20"
    >
      {/* パーティクル */}
      <ParticleField />

      {/* Ambient Glow — 左上 indigo */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10%",
          left: "-20%",
          width: "70vw",
          height: "70vw",
          background: "radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      {/* Ambient Glow — 右下 violet */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-20%",
          right: "-10%",
          width: "55vw",
          height: "55vw",
          background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      {/* 背景の大きなKS文字 */}
      <div
        className="hero-bg-text absolute right-0 bottom-0 font-black leading-none select-none pointer-events-none text-white/[0.04]"
        style={{ fontSize: "28vw" }}
      >
        KS
      </div>

      {/* 細いボーダーライン（上部） */}
      <div className="absolute top-24 left-8 md:left-20 right-8 md:right-20 h-px bg-white/8" />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Line 1 — 通常テキスト */}
        <div className="hero-line-1">
          <p className="text-[10px] tracking-[0.45em] uppercase text-white/30 mb-5 font-medium">
            Frontend Engineer / UI Designer
          </p>
          <h1
            className="font-black tracking-[-0.03em] leading-[0.88] text-white"
            style={{ fontSize: "clamp(52px, 9.5vw, 130px)" }}
          >
            {"Optimize my".split("").map((char, i) => (
              <span key={i} className="hero-char inline-block" style={{ whiteSpace: char === " " ? "pre" : "normal" }}>
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Line 2 — グラデーションテキスト */}
        <div className="hero-line-2">
          <h1
            className="font-black tracking-[-0.03em] leading-[0.88]"
            style={{ fontSize: "clamp(52px, 9.5vw, 130px)" }}
          >
            {"objectives.".split("").map((char, i) => (
              <span
                key={i}
                className="hero-char inline-block"
                style={{
                  background: "linear-gradient(135deg, #a5b4fc 0%, #818cf8 35%, #6366f1 65%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* メタ情報 */}
        <div className="hero-meta flex items-center gap-6 mt-10">
          <div className="h-px w-12 bg-white/20" />
          <p className="text-xs text-white/35 tracking-[0.25em] uppercase">
            目標を常に最適化し続けること
          </p>
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div className="hero-scroll absolute bottom-10 right-8 md:right-20 flex flex-col items-center gap-3">
        <span
          className="text-[9px] tracking-[0.4em] uppercase text-white/25"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-black/20 to-transparent" />
      </div>
    </section>
  );
}
