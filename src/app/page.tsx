"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Certifications from "@/components/Certifications";
import Theme from "@/components/Theme";
import MarqueeStrip from "@/components/MarqueeStrip";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollCTA from "@/components/ScrollCTA";
import AuroraBackground from "@/components/AuroraBackground";

gsap.registerPlugin(ScrollTrigger);

// "A": カウントアップ / "C": パーティクル収束
const LOADING_VARIANT: "A" | "C" = "A";

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
  const [loading, setLoading] = useState(true);

  // スクロールロック
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [loading]);

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
    addZoomTransition("#theme");

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <>
      <AuroraBackground />
      {loading && (
        <LoadingScreen variant={LOADING_VARIANT} onComplete={() => setLoading(false)} />
      )}
    <div style={{ perspective: "1400px" }}>
      <Hero />
      <MarqueeStrip />
      <About />
      <MarqueeStrip reverse />
      <Certifications />
      <MarqueeStrip />
      <Theme />
    </div>
    <ScrollCTA />
    </>
  );
}
