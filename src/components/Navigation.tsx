"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/hobbies", label: "Hobbies" },
  { href: "#contact", label: "Contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.8 });
    tl.fromTo(
      ".nav-logo",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
    ).fromTo(
      ".nav-link",
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" },
      "-=0.3"
    );

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-5 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-[#001a3d]/80 border-b border-white/[0.06]"
          : ""
      }`}
    >
      <a href="#home" className="nav-logo opacity-0">
        <span className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          KS.
        </span>
      </a>

      <ul className="flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="nav-link opacity-0 text-xs font-medium text-white/50 hover:text-white transition-colors duration-200 tracking-[0.15em] uppercase relative group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-teal-400 group-hover:w-full transition-all duration-300" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
