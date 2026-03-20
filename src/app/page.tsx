"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Certifications from "@/components/Certifications";
import MarqueeStrip from "@/components/MarqueeStrip";

gsap.registerPlugin(ScrollTrigger);

function addZoomTransition(id: string) {
  gsap.fromTo(
    id,
    { scale: 0.72, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      transformOrigin: "center center",
      ease: "none",
      scrollTrigger: {
        trigger: id,
        start: "top 95%",
        end: "top 5%",
        scrub: 1.0,
      },
    }
  );
}

export default function Home() {
  useEffect(() => {
    // Hero → 手前に大きく拡大しながらフェードアウト
    gsap.to("#home", {
      scale: 1.45,
      opacity: 0,
      transformOrigin: "center center",
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 1.0,
      },
    });

    addZoomTransition("#about");
    addZoomTransition("#certifications");

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div style={{ perspective: "1400px" }}>
      <Hero />
      <MarqueeStrip />
      <About />
      <MarqueeStrip reverse />
      <Certifications />
    </div>
  );
}
