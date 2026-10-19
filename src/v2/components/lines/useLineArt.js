import { useEffect, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);
// --ease-soft: cubic-bezier(0.22, 1, 0.36, 1)
CustomEase.create("soft", "0.22,1,0.36,1");

/** Live size of an element (ResizeObserver), for pixel-exact SVG geometry. */
export function useBox(ref) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setBox((b) => (b.w === el.offsetWidth && b.h === el.offsetHeight ? b : { w: el.offsetWidth, h: el.offsetHeight }));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return box;
}

/**
 * Line art is part of the background: strokes ([data-draw]) and dots
 * ([data-pop]) are always fully there, never drawn on. The layer drifts a
 * little slower than the page (scrubbed parallax), like the background behind
 * it. Static with reduced motion. `ready` delays setup until the geometry exists.
 */
export function useDrawOn(rootRef, ready) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready) return undefined;
    const ctx = gsap.context(() => {
      gsap.set(root.querySelectorAll("[data-draw]"), { strokeDasharray: "none", strokeDashoffset: 0 });
      gsap.set(root.querySelectorAll("[data-pop]"), { opacity: (i, el) => el.dataset.opacity || 1, scale: 1 });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        root,
        { y: 40 },
        {
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: root.closest("section") || root, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [rootRef, ready]);
}

// Long lines fade at both ends.
export const END_FADE = "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)";
