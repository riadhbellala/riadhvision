import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";
import { SCENES, SCENE_ORDER, SCENE_VARS } from "../backgroundScenes";

gsap.registerPlugin(ScrollTrigger);

const BLEND_VH = 0.6; // each blend lasts ~60% of a viewport height of scrolling

function varsFor(name) {
  const scene = SCENES[name];
  const out = {};
  for (const key of Object.keys(SCENE_VARS)) out[SCENE_VARS[key]] = scene[key];
  return out;
}

// Colour stop with alpha from a CSS colour variable.
function v(name, pct) {
  return `color-mix(in srgb, var(${name}) ${pct}%, transparent)`;
}

/**
 * One fixed background for the whole page. The composition never changes:
 * a diagonal band, two corner glows (bottom-left, top-right), a calm centre
 * and grain. Only the colours change with scroll, blending from one section's
 * scene (see backgroundScenes.js) to the next while their boundary crosses
 * the middle of the screen. The shapes breathe on their own, independent of
 * scroll. Static with reduced motion.
 */
function PageBackground() {
  const rootRef = useRef(null);
  const isDesktop = useMediaQuery({ minWidth: 768 });

  // Colour flow: one timeline, scrubbed over the whole page.
  useLayoutEffect(() => {
    const root = rootRef.current;
    gsap.set(root, varsFor(SCENE_ORDER[0]));
    let ctx;

    function build() {
      ctx?.revert();
      ctx = gsap.context(() => {
        gsap.set(root, varsFor(SCENE_ORDER[0]));
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max <= 0) return;
        const vh = window.innerHeight;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 1.2 },
        });
        SCENE_ORDER.slice(1).forEach((id) => {
          const el = document.getElementById(id);
          if (!el) return;
          // Scroll position where this section's top edge crosses mid-screen.
          const boundary = el.getBoundingClientRect().top + window.scrollY - vh / 2;
          const duration = (BLEND_VH * vh) / max;
          const at = Math.min(1 - duration, Math.max(0, boundary / max - duration / 2));
          tl.to(root, { ...varsFor(id), duration, ease: "sine.inOut" }, at);
        });
        tl.set({}, {}, 1); // timeline spans exactly 0–1 of the page
      });
    }

    let timer;
    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(build, 150);
    }
    build();
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    document.fonts?.ready.then(schedule);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      ctx?.revert();
    };
  }, []);

  // Free breathing of the shapes (not scroll-linked); durations never sync.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const k = isDesktop ? 1 : 0.5;
    const ctx = gsap.context(() => {
      const loop = { repeat: -1, yoyo: true, ease: "sine.inOut" };
      gsap.to("[data-bg=band]", { x: `${4 * k}vw`, rotate: -15 + 6 * k, scale: 1.08, duration: 26, ...loop });
      gsap.fromTo("[data-bg=glow-a]", { x: `${-4 * k}vw`, scale: 0.95 }, { x: `${3 * k}vw`, y: `${-3 * k}vh`, rotate: 6, scale: 1.06, duration: 19, ...loop });
      gsap.fromTo("[data-bg=glow-b]", { x: `${3 * k}vw`, scale: 1.05 }, { x: `${-4 * k}vw`, y: `${3 * k}vh`, rotate: -6, scale: 0.96, duration: 30, ...loop });
    }, rootRef);
    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="grain fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Ink veil over the base: even the brightest scene base (royal) stays at
          about deep behind the content; brightness comes from the band and glows. */}
      <div className="absolute inset-0" style={{ background: "rgba(7,10,22,0.45)" }} />
      {/* Diagonal band */}
      <div
        data-bg="band"
        className="absolute left-1/2 top-1/2 w-[160vw] h-[42vh] -ml-[80vw] -mt-[21vh]"
        style={{
          transform: "rotate(-15deg)", // GSAP parses this as the start of the breathing loop
          background: `radial-gradient(closest-side, ${v("--bg-band", 72)}, ${v("--bg-band", 34)} 55%, transparent)`,
        }}
      />
      {/* Corner glows, kept at the edges, off the content column */}
      <div
        data-bg="glow-a"
        className="absolute -left-[22vw] -bottom-[26vh] w-[52vw] h-[56vh]"
        style={{ background: `radial-gradient(closest-side, ${v("--bg-glow-a", 70)}, ${v("--bg-glow-a", 25)} 50%, transparent)` }}
      />
      <div
        data-bg="glow-b"
        className="absolute -right-[22vw] -top-[26vh] w-[52vw] h-[56vh]"
        style={{ background: `radial-gradient(closest-side, ${v("--bg-glow-b", 65)}, ${v("--bg-glow-b", 22)} 50%, transparent)` }}
      />
      {/* Calm centre: keeps the content column at deep or darker, whatever the scene */}
      <div
        className="absolute left-1/2 top-1/2 w-[80vw] h-[80vh] -ml-[40vw] -mt-[40vh]"
        style={{ background: "radial-gradient(closest-side, rgba(7,10,22,0.5), rgba(7,10,22,0.25) 60%, transparent)" }}
      />
    </div>
  );
}

export default PageBackground;
