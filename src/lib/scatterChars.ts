import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function scatterChars(triggerEl: Element, charClass: string) {
  const chars = gsap.utils.toArray<HTMLElement>(`.${charClass}`, triggerEl);
  chars.forEach((char) => {
    const tx = (Math.random() - 0.5) * window.innerWidth * 1.2;
    const ty = (Math.random() - 0.5) * window.innerHeight * 0.8;
    const rot = (Math.random() - 0.5) * 540;
    gsap.to(char, {
      x: tx,
      y: ty,
      rotation: rot,
      opacity: 0,
      ease: "power2.in",
      scrollTrigger: {
        trigger: triggerEl,
        start: "top 20%",
        end: "bottom 20%",
        scrub: 1,
      },
    });
  });
}
