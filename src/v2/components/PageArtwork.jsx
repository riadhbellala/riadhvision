import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";

gsap.registerPlugin(ScrollTrigger);

// Sections in page order and the base colour each one sits on.
const SECTIONS = [
  ["hero", "#070A16"], // ink
  ["manifesto", "#F2F5FB"], // snow
  ["services", "#132A7A"], // deep
  ["work", "#0E1430"], // ink-2
  ["before-after", "#C9D8F4"], // ice
  ["focus-engine", "#070A16"], // ink
  ["process", "#C9D8F4"], // ice
  ["testimonials", "#132A7A"], // deep
  ["trust", "#070A16"], // ink
  ["now", "#F2F5FB"], // snow
  ["contact", "#C9D8F4"], // ice
  ["footer", "#070A16"], // ink
];

const ZONE_VH = 36; // height of each painted transition, centred on a boundary
const PARALLAX = 0.08; // max offset as a fraction of the shape's height

const c = {
  royal: (a) => `rgba(36,72,201,${a})`,
  glow: (a) => `rgba(91,131,232,${a})`,
  ice: (a) => `rgba(201,216,244,${a})`,
  snow: (a) => `rgba(242,245,251,${a})`,
  deep: (a) => `rgba(19,42,122,${a})`,
};

/**
 * Light shapes, each anchored to a section: x as a fraction of the page width,
 * y as a fraction of the section's height (1 = its bottom boundary), sizes in
 * vw / vh. `mobile: false` drops the shape on small screens (half the shapes).
 */
const SHAPES = [
  // Hero: diagonal royal → glow band and an ice glow bottom-left…
  { section: "hero", x: 0.5, y: 0.45, w: 140, h: 42, rotate: -15, fill: `radial-gradient(closest-side, ${c.royal(0.75)}, ${c.glow(0.4)} 55%, transparent)` },
  { section: "hero", x: 0.08, y: 0.85, w: 70, h: 60, mobile: false, fill: `radial-gradient(closest-side, ${c.ice(0.45)}, ${c.ice(0.15)} 55%, transparent)` },
  // …widening into a ~160vw elliptical light horizon that opens into Manifesto.
  { section: "hero", x: 0.5, y: 1.12, w: 160, h: 80, fill: `radial-gradient(closest-side, ${c.snow(1)}, ${c.ice(0.85)} 45%, ${c.glow(0.35)} 75%, transparent)` },
  // Manifesto → Services: royal / glow blobs rising from Manifesto's bottom like a grainy horizon.
  { section: "manifesto", x: 0.18, y: 1, w: 60, h: 46, fill: `radial-gradient(closest-side, ${c.royal(0.6)}, ${c.glow(0.3)} 55%, transparent)` },
  { section: "manifesto", x: 0.5, y: 1.02, w: 80, h: 52, mobile: false, fill: `radial-gradient(closest-side, ${c.glow(0.55)}, ${c.royal(0.3)} 55%, transparent)` },
  { section: "manifesto", x: 0.84, y: 1, w: 58, h: 44, fill: `radial-gradient(closest-side, ${c.royal(0.55)}, ${c.glow(0.25)} 55%, transparent)` },
  // Services: ice highlights at the left and right edges of the deep field.
  { section: "services", x: -0.06, y: 0.5, w: 46, h: 80, mobile: false, fill: `radial-gradient(closest-side, ${c.ice(0.32)}, transparent)` },
  { section: "services", x: 1.06, y: 0.5, w: 46, h: 80, mobile: false, fill: `radial-gradient(closest-side, ${c.ice(0.32)}, transparent)` },
  // Work: two quiet glow shapes behind the content.
  { section: "work", x: 0.3, y: 0.4, w: 60, h: 55, fill: `radial-gradient(closest-side, ${c.glow(0.16)}, transparent)` },
  { section: "work", x: 0.72, y: 0.7, w: 60, h: 55, mobile: false, fill: `radial-gradient(closest-side, ${c.glow(0.14)}, transparent)` },
  // Before / After: a horizon curve opening from ink-2 into ice across Work → Before/After.
  { section: "before-after", x: 0.5, y: 0, w: 160, h: 70, fill: `radial-gradient(closest-side, ${c.snow(0.9)}, ${c.ice(0.6)} 45%, ${c.ice(0.2)} 75%, transparent)` },
  // Focus Engine: one centred royal orb on ink.
  { section: "focus-engine", x: 0.5, y: 0.55, w: 50, h: 50, square: true, fill: `radial-gradient(closest-side, ${c.royal(0.6)}, ${c.glow(0.22)} 60%, transparent)` },
  // Process: the orb's light spreading into ice across Focus Engine → Process.
  // Centred on the boundary (half in each section); its outer ring is ice, so
  // Process's royal label sits on calm ice.
  { section: "process", x: 0.5, y: 0, w: 160, h: 70, fill: `radial-gradient(closest-side, ${c.glow(0.5)}, ${c.ice(0.6)} 45%, ${c.ice(0.2)} 75%, transparent)` },
  // Testimonials: a soft wide royal aura (kept inside its own section).
  { section: "testimonials", x: 0.5, y: 0.5, w: 140, h: 55, mobile: false, fill: `radial-gradient(closest-side, ${c.royal(0.3)}, ${c.glow(0.12)} 60%, transparent)` },
  // Trust: thin, long horizontal light streaks in the lower half, like motion blur.
  { section: "trust", x: 0.3, y: 0.58, w: 110, h: 3.5, fill: `radial-gradient(closest-side, ${c.glow(0.55)}, ${c.royal(0.3)} 50%, transparent)` },
  { section: "trust", x: 0.62, y: 0.66, w: 130, h: 2.5, mobile: false, fill: `radial-gradient(closest-side, ${c.royal(0.6)}, ${c.glow(0.25)} 50%, transparent)` },
  { section: "trust", x: 0.45, y: 0.74, w: 90, h: 4, fill: `radial-gradient(closest-side, ${c.glow(0.45)}, ${c.royal(0.25)} 50%, transparent)` },
  { section: "trust", x: 0.75, y: 0.8, w: 100, h: 3, mobile: false, fill: `radial-gradient(closest-side, ${c.glow(0.5)}, ${c.royal(0.25)} 50%, transparent)` },
  { section: "trust", x: 0.25, y: 0.87, w: 120, h: 2.5, mobile: false, fill: `radial-gradient(closest-side, ${c.royal(0.5)}, ${c.glow(0.2)} 50%, transparent)` },
  // Contact: a large poster orb (deep core, royal → glow → ice edges), set to the
  // right of the text column so the deep text never crosses its core.
  { section: "contact", x: 0.8, y: 0.55, w: 44, h: 44, square: true, fill: `radial-gradient(closest-side, ${c.deep(0.95)}, ${c.royal(0.8)} 40%, ${c.glow(0.55)} 65%, ${c.ice(0.35)} 85%, transparent)` },
];

function measure(wrapper) {
  const origin = wrapper.getBoundingClientRect();
  const W = origin.width;
  const H = origin.height;
  const vh = window.innerHeight / 100;
  const boxes = {};
  for (const [id] of SECTIONS) {
    const el = document.getElementById(id);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    boxes[id] = { top: r.top - origin.top, height: r.height };
  }

  // Base gradient: each colour holds through its section and blends across a
  // ZONE_VH-tall band centred on every boundary (never a sharp stop).
  const half = (ZONE_VH * vh) / 2;
  const stops = [];
  SECTIONS.forEach(([id, color], i) => {
    const b = boxes[id];
    const h = Math.min(half, b.height / 2);
    const start = i === 0 ? 0 : b.top + h;
    const end = i === SECTIONS.length - 1 ? H : b.top + b.height - h;
    stops.push(`${color} ${start.toFixed(0)}px`, `${color} ${end.toFixed(0)}px`);
  });
  const base = `linear-gradient(to bottom, ${stops.join(", ")})`;

  const shapes = SHAPES.map((s) => {
    const b = boxes[s.section];
    const w = (s.w / 100) * W;
    const h = s.square ? w : s.h * vh;
    return { ...s, left: s.x * W - w / 2, top: b.top + s.y * b.height - h / 2, width: w, height: h };
  });

  return { H, base, shapes };
}

/**
 * One long artwork painted behind the whole page and scrolling with it. Each
 * section sits on its own part; boundaries are painted blends. Light shapes use
 * radial-gradient falloff (no filter: blur on page-tall layers) and drift
 * slightly slower than the page. Render as the first child of a relative
 * page wrapper.
 */
function PageArtwork() {
  const rootRef = useRef(null);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [geo, setGeo] = useState(null);

  // Measure on resize (debounced) and once fonts are ready.
  useLayoutEffect(() => {
    const wrapper = rootRef.current.parentElement;
    let timer;
    const update = () => {
      const next = measure(wrapper);
      if (!next) return;
      setGeo((prev) => (prev && prev.base === next.base && prev.H === next.H ? prev : next));
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(update, 150);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(wrapper);
    document.fonts?.ready.then(schedule);
    update();
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Parallax: one ScrollTrigger; each shape lags the page by up to 8% of its height.
  useLayoutEffect(() => {
    if (!geo || !isDesktop || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = gsap.context(() => {
      const els = [...rootRef.current.querySelectorAll("[data-parallax]")];
      const setters = els.map((el) => gsap.quickSetter(el, "y", "px"));
      const items = els.map((el) => ({
        centre: parseFloat(el.dataset.centre),
        max: parseFloat(el.style.height) * PARALLAX,
      }));
      ScrollTrigger.create({
        trigger: rootRef.current.parentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: () => {
          const view = window.scrollY + window.innerHeight / 2 - (rootRef.current.getBoundingClientRect().top + window.scrollY);
          items.forEach((it, i) => {
            const offset = (view - it.centre) * 0.15;
            setters[i](Math.max(-it.max, Math.min(it.max, offset)));
          });
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [geo, isDesktop]);

  const shapes = geo ? geo.shapes.filter((s) => isDesktop || s.mobile !== false) : [];

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="grain absolute inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ background: geo ? geo.base : "#070A16" }}
    >
      {shapes.map((s, i) => (
        <div
          key={i}
          data-parallax
          data-centre={s.top + s.height / 2}
          className="absolute"
          style={{
            left: s.left,
            top: s.top,
            width: s.width,
            height: s.height,
            background: s.fill,
            // The independent CSS rotate property, so GSAP's parallax y (a transform) doesn't override it.
            rotate: s.rotate ? `${s.rotate}deg` : undefined,
            willChange: isDesktop ? "transform" : undefined,
          }}
        />
      ))}
    </div>
  );
}

export default PageArtwork;
