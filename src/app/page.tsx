"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/Hero";
import About from "@/components/About";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Hero → 手前に拡大しながらフェードアウト
    gsap.to("#home", {
      scale: 1.18,
      opacity: 0,
      transformOrigin: "center center",
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // About → 奥から迫ってくる
    gsap.fromTo(
      "#about",
      { scale: 0.82, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        transformOrigin: "center center",
        ease: "none",
        scrollTrigger: {
          trigger: "#about",
          start: "top 90%",
          end: "top 10%",
          scrub: 1.2,
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div style={{ perspective: "1200px" }}>
      <Hero />
      <About />
    </div>
  );
}
