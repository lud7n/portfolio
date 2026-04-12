"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { setTransitionTrigger, setRouterPush } from "@/lib/pageTransition";

const normalize = (p: string) => p.replace(/\/$/, "") || "/";

export default function TransitionOverlay() {
  const overlayRef   = useRef<HTMLDivElement>(null);
  const router       = useRouter();
  const pathname     = usePathname();
  const pathnameRef  = useRef(pathname);

  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  // トリガー関数を登録
  useEffect(() => {
    // router.push をフォールバックとして先に登録
    setRouterPush((href: string) => router.push(href));

    const overlay = overlayRef.current;
    if (!overlay) return;

    setTransitionTrigger((href: string) => {
      // 同一ページへの遷移はフリーズするためスキップ
      if (normalize(href) === normalize(pathnameRef.current)) return;

      overlay.style.pointerEvents = "all";
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => router.push(href),
      });
    });
  }, [router]);

  // ページ変化時にフェードアウト
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.45,
      ease: "power2.out",
      delay: 0.05,
      onComplete: () => { overlay.style.pointerEvents = "none"; },
    });
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        zIndex: 9999,
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}
