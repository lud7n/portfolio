"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!?";

interface Props {
  text: string;
  className?: string;
  delay?: number;
}

export default function ScrambleText({ text, className = "", delay = 0 }: Props) {
  const [displayed, setDisplayed] = useState(text);
  const elRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number>(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      setTimeout(() => {
        let iter = 0;
        const total = text.length * 6;

        const animate = () => {
          const progress = iter / total;
          setDisplayed(
            text
              .split("")
              .map((char, i) => {
                if (char === " ") return " ";
                if (i / text.length < progress) return char;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
              })
              .join("")
          );
          iter++;
          if (iter <= total) {
            frameRef.current = requestAnimationFrame(animate);
          } else {
            setDisplayed(text);
          }
        };

        frameRef.current = requestAnimationFrame(animate);
      }, delay);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) run();
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [text, delay]);

  return (
    <span ref={elRef} className={className}>
      {displayed}
    </span>
  );
}
