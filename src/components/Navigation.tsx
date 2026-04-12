"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { navigateTo } from "@/lib/pageTransition";
import { usePathname } from "next/navigation";
import { lenisInstance } from "@/components/SmoothScrollProvider";

const navLinks = [
  { href: "/", label: "About", sectionId: "about" },
  { href: "/skills", label: "Skills", sectionId: null },
  { href: "/projects", label: "Projects", sectionId: null },
  { href: "/articles", label: "Articles", sectionId: null },
  { href: "/hobbies", label: "Hobbies", sectionId: null },
];

// B: リンクごとのアクセントカラー
const linkAccents: Record<string, string> = {
  About:    "rgba(251,191,36,0.08)",
  Skills:   "rgba(34,211,238,0.08)",
  Projects: "rgba(167,139,250,0.08)",
  Articles: "rgba(99,102,241,0.08)",
  Hobbies:  "rgba(52,211,153,0.08)",
  Contact:  "rgba(251,113,133,0.08)",
};

// A: セクションIDを表示テキストに変換
const sectionLabels: Record<string, string> = {
  home:           "HOME",
  about:          "ABOUT",
  certifications: "CERTS",
  contact:        "CONTACT",
};

export default function Navigation() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const menuRef       = useRef<HTMLDivElement>(null);
  const spotlightRef  = useRef<HTMLDivElement>(null);
  const bgGradientRef = useRef<HTMLDivElement>(null);
  const linkRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const hamburgerRef  = useRef<HTMLButtonElement>(null);
  const originRef     = useRef({ x: 30, y: 30 });

  const pathname = usePathname();

  // 入場アニメーション + スクロール & アクティブセクション監視
  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.8 });
    tl.fromTo(".nav-hamburger", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power3.out" });

    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const ids  = ["home", "about", "certifications", "contact"];
      const midY = window.innerHeight / 2;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= midY && bottom >= midY) { setActiveSection(id); break; }
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // メニュー開閉
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const { x: ox, y: oy } = originRef.current;
    const origin = `${ox}px ${oy}px`;

    if (menuOpen) {
      gsap.set(menu, { display: "flex", clipPath: `circle(0% at ${origin})` });
      gsap.set(spotlightRef.current, { x: window.innerWidth / 2, y: window.innerHeight / 2 });

      // 円を広げる
      gsap.to(menu, {
        clipPath: `circle(150% at ${origin})`,
        duration: 0.7,
        ease: "power3.inOut",
      });

      // リンクをスタガーで出す
      linkRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { x: i % 2 === 0 ? -80 : 80, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.65, ease: "power4.out", delay: 0.3 + i * 0.07 }
        );
      });

      gsap.fromTo(".menu-meta", { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.65 });

      document.body.style.overflow = "hidden";

    } else {
      setHoveredLink(null);
      gsap.to(bgGradientRef.current, { opacity: 0, duration: 0.15 });

      // 円を縮める
      gsap.to(menu, {
        clipPath: `circle(0% at ${origin})`,
        duration: 0.55,
        ease: "power3.inOut",
        onComplete: () => { gsap.set(menu, { display: "none" }); },
      });
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const isActive = (link: (typeof navLinks)[0]) => {
    if (link.sectionId && activeSection === link.sectionId) return true;
    if (!link.sectionId && pathname === link.href) return true;
    return false;
  };

  // C: スポットライト追従
  const handleMenuMouseMove = (e: React.MouseEvent) => {
    gsap.to(spotlightRef.current, {
      x: e.clientX, y: e.clientY,
      duration: 0.55, ease: "power2.out",
    });
  };

  // B: ホバー時のアクセントグラデーション
  const handleLinkEnter = (label: string) => {
    setHoveredLink(label);
    if (bgGradientRef.current) {
      bgGradientRef.current.style.background =
        `radial-gradient(ellipse 70% 55% at 50% 50%, ${linkAccents[label]}, transparent)`;
      gsap.to(bgGradientRef.current, { opacity: 1, duration: 0.4 });
    }
  };

  const handleLinkLeave = () => {
    setHoveredLink(null);
    gsap.to(bgGradientRef.current, { opacity: 0, duration: 0.35 });
  };

  return (
    <>
      {/* ナビバー */}
      <nav
        style={{ paddingLeft: "clamp(2rem, 5vw, 5rem)", paddingRight: "clamp(2rem, 5vw, 5rem)", paddingTop: "1.25rem", paddingBottom: "1.25rem" }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-500 ${
          scrolled ? "backdrop-blur-sm" : ""
        }`}
      >
        <button
          ref={hamburgerRef}
          className="nav-hamburger opacity-0"
          onClick={() => {
            const rect = hamburgerRef.current?.getBoundingClientRect();
            if (rect) originRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            setMenuOpen((v) => !v);
          }}
          aria-label="Toggle menu"
          style={{
            position: "relative",
            width: 28,
            height: 20,
            background: "none",
            border: "none",
            padding: 0,
            color: "rgba(255,255,255,0.6)",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
          onMouseLeave={e => (e.currentTarget.style.color = menuOpen ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)")}
        >
          {/* line 1 */}
          <span style={{
            position: "absolute",
            width: 18,
            height: 1.5,
            borderRadius: 2,
            background: "currentColor",
            top: "50%",
            left: "50%",
            transformOrigin: "center",
            transform: menuOpen
              ? "translate(-50%, -50%) rotate(45deg)"
              : "translate(calc(-50% - 5px), -50%) rotate(-58deg)",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />
          {/* line 2 */}
          <span style={{
            position: "absolute",
            width: 18,
            height: 1.5,
            borderRadius: 2,
            background: "currentColor",
            top: "50%",
            left: "50%",
            transformOrigin: "center",
            transform: menuOpen
              ? "translate(-50%, -50%) rotate(-45deg)"
              : "translate(calc(-50% + 5px), -50%) rotate(-58deg)",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />
        </button>

        {/* ホームボタン（ホーム以外のページで表示） */}
        {pathname !== "/" && !menuOpen && (
          <Link
            href="/"
            className="flex items-center gap-2 group"
            style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.3s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M1 6.5L7 1L13 6.5V13H9.5V9.5H4.5V13H1V6.5Z"
                stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </nav>

      {/* フルスクリーンメニュー */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 hidden flex-col justify-center overflow-hidden backdrop-blur-md"
        style={{ background: "rgba(10,10,10,0.6)" }}
        onMouseMove={handleMenuMouseMove}
      >
        {/* B: リンクごとのアクセントグラデーション */}
        <div
          ref={bgGradientRef}
          className="absolute inset-0 pointer-events-none opacity-0"
        />

        {/* C: スポットライト */}
        <div
          ref={spotlightRef}
          className="absolute pointer-events-none rounded-full"
          style={{
            width: "520px", height: "520px",
            top: 0, left: 0,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(248,248,246,0.05) 0%, transparent 65%)",
          }}
        />

        {/* ナビリンク */}
        <nav className="relative z-10" style={{ paddingLeft: "clamp(2rem, 5vw, 5rem)", paddingRight: "clamp(2rem, 5vw, 5rem)" }}>
          {navLinks.map((link, i) => (
            <div
              key={link.href}
              ref={(el) => { linkRefs.current[i] = el; }}
              onMouseEnter={() => handleLinkEnter(link.label)}
              onMouseLeave={handleLinkLeave}
              style={{ paddingTop: "0.6rem", paddingBottom: "0.6rem" }}
            >
              <Link
                href={link.href}
                className="group flex items-baseline gap-5"
                style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  lenisInstance?.scrollTo(0, { immediate: true });
                  if (pathname !== link.href) navigateTo(link.href);
                }}
              >
                {/* D: ホバーで他リンクが暗くなる */}
                <span
                  className="font-black tracking-tight leading-none transition-all duration-200"
                  style={{
                    color: "#f8f8f6",
                    opacity: hoveredLink
                      ? hoveredLink === link.label ? 1 : 0.05
                      : isActive(link) ? 1 : 0.18,
                  }}
                >
                  {link.label}
                </span>
                <span
                  className="text-[10px] tracking-[0.3em] uppercase font-normal transition-opacity duration-200"
                  style={{
                    color: "#f8f8f6",
                    opacity: hoveredLink === link.label ? 0.35 : 0.1,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                  {isActive(link) && <span className="ml-3">— now</span>}
                </span>
              </Link>
            </div>
          ))}
        </nav>

        {/* フッターメタ */}
        <div className="menu-meta absolute bottom-10 left-10 md:left-20 right-10 md:right-20 flex justify-between text-white/[0.18] text-[9px] tracking-[0.35em] uppercase">
          <span>Portfolio — 工藤 翔太</span>
          <span>Frontend Engineer / UI Designer</span>
        </div>
      </div>
    </>
  );
}
