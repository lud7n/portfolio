"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/#about", label: "About", sectionId: "about" },
  { href: "/skills", label: "Skills", sectionId: null },
  { href: "/projects", label: "Projects", sectionId: null },
  { href: "/hobbies", label: "Hobbies", sectionId: null },
  { href: "/#contact", label: "Contact", sectionId: "contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // 入場アニメーション + スクロール監視 + アクティブセクション検出
  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.8 });
    tl.fromTo(".nav-logo", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(".nav-hamburger", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.3");

    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // ビューポート中心にどのセクションがあるか判定
      const ids = ["home", "about", "certifications", "contact"];
      const midY = window.innerHeight / 2;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= midY && bottom >= midY) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // メニュー開閉アニメーション
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    if (menuOpen) {
      gsap.set(menu, { display: "flex" });
      gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(
        ".menu-link",
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "power4.out", delay: 0.1 }
      );
      gsap.fromTo(".menu-meta", { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.55 });
      document.body.style.overflow = "hidden";
    } else {
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

  return (
    <>
      {/* バー */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-5 transition-all duration-500 ${
          scrolled ? "backdrop-blur-xl bg-[#0a0a0a]/90 border-b border-white/[0.06]" : ""
        }`}
      >
        <Link href="/" className="nav-logo opacity-0">
          <span className="text-lg font-black tracking-tight text-white">KS.</span>
        </Link>

        {/* ハンバーガー */}
        <button
          className="nav-hamburger opacity-0 flex flex-col justify-center gap-[5px] w-8 h-8 relative"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-px bg-white origin-center transition-all duration-300"
            style={{
              transform: menuOpen ? "translateY(5px) rotate(45deg)" : "none",
              width: "100%",
            }}
          />
          <span
            className="block h-px bg-white transition-all duration-300"
            style={{
              opacity: menuOpen ? 0 : 1,
              width: "66%",
            }}
          />
          <span
            className="block h-px bg-white origin-center transition-all duration-300"
            style={{
              transform: menuOpen ? "translateY(-9px) rotate(-45deg)" : "none",
              width: "100%",
            }}
          />
        </button>
      </nav>

      {/* フルスクリーンメニュー */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-[#0a0a0a] hidden flex-col justify-center px-10 md:px-20"
      >
        <nav className="space-y-1">
          {navLinks.map((link, i) => (
            <div key={link.href} className="overflow-hidden">
              <Link
                href={link.href}
                className="menu-link block font-black tracking-tight leading-none py-3 transition-colors duration-200 group flex items-baseline gap-5"
                style={{ fontSize: "clamp(42px, 8vw, 96px)" }}
                onClick={() => setMenuOpen(false)}
              >
                <span
                  className={`transition-colors duration-200 ${
                    isActive(link) ? "text-white" : "text-white/15 group-hover:text-white/70"
                  }`}
                >
                  {link.label}
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase font-normal text-white/20 group-hover:text-white/40 transition-colors duration-200 self-center">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {isActive(link) && (
                  <span className="text-[9px] tracking-[0.35em] uppercase font-normal text-white/30 self-center">
                    — now
                  </span>
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* フッターメタ */}
        <div className="menu-meta absolute bottom-10 left-10 md:left-20 right-10 md:right-20 flex justify-between text-white/20 text-[9px] tracking-[0.35em] uppercase">
          <span>Portfolio — 工藤 翔太</span>
          <span>Frontend Engineer / UI Designer</span>
        </div>
      </div>
    </>
  );
}
