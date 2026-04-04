"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/#about", label: "About", sectionId: "about" },
  { href: "/skills", label: "Skills", sectionId: null },
  { href: "/projects", label: "Projects", sectionId: null },
  { href: "/articles", label: "Articles", sectionId: null },
  { href: "/hobbies", label: "Hobbies", sectionId: null },
  { href: "/#contact", label: "Contact", sectionId: "contact" },
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

    if (menuOpen) {
      gsap.set(menu, { display: "flex" });
      // スポットライト初期位置をセンターに
      gsap.set(spotlightRef.current, { x: window.innerWidth / 2, y: window.innerHeight / 2 });

      gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });

      // E: 偶数リンクは左から、奇数は右から
      linkRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { x: i % 2 === 0 ? -110 : 110, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.75, ease: "power4.out", delay: 0.08 + i * 0.07 }
        );
      });

      gsap.fromTo(".menu-meta", { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.55 });

      document.body.style.overflow = "hidden";

    } else {
      setHoveredLink(null);
      gsap.to(bgGradientRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(menu, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
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
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-5 transition-all duration-500 ${
          scrolled ? "backdrop-blur-xl bg-[#0a0a0a]/90 border-b border-white/[0.06]" : ""
        }`}
      >
        <button
          className="nav-hamburger opacity-0 flex flex-col justify-center gap-[5px] w-8 h-8"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block h-px bg-white origin-center transition-all duration-300 w-full"
            style={{ transform: menuOpen ? "translateY(5px) rotate(45deg)" : "none" }} />
          <span className="block h-px bg-white transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1, width: "66%" }} />
          <span className="block h-px bg-white origin-center transition-all duration-300 w-full"
            style={{ transform: menuOpen ? "translateY(-9px) rotate(-45deg)" : "none" }} />
        </button>
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
        <nav className="relative z-10 space-y-0 px-10 md:px-20">
          {navLinks.map((link, i) => (
            <div
              key={link.href}
              ref={(el) => { linkRefs.current[i] = el; }}
              onMouseEnter={() => handleLinkEnter(link.label)}
              onMouseLeave={handleLinkLeave}
            >
              <Link
                href={link.href}
                className="group flex items-baseline gap-5 py-2"
                style={{ fontSize: "clamp(38px, 7vw, 90px)" }}
                onClick={() => setMenuOpen(false)}
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
