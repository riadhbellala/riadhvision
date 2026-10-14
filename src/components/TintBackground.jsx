import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Soft top edge (fades in over 160px) and a fade into the next section.
const MASK = "linear-gradient(to bottom, transparent 0, black 160px, black 85%, transparent 100%)";

/**
 * Icy section tint. Place it in a light SectionShell's `decoration` slot: it
 * sits on the sheet (z-0), under the page lines (z-1) and the content (z-10).
 * It blends in as the section scrolls up (no visible switch); with reduced
 * motion it stays at full opacity.
 */
function TintBackground() {
  const ref = useRef(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: ref.current.parentElement, start: "top bottom", end: "top 35%", scrub: true },
      }
    );
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 z-0 bg-accent/25 rounded-t-[24px] md:rounded-t-[40px] pointer-events-none"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    />
  );
}

export default TintBackground;
