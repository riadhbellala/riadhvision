import { useEffect, useRef } from "react";
import {
  animate,
  // eslint-disable-next-line no-unused-vars
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

// Each problem and its fix share a spot (x, y in % of the field) and a tilt.
const WORDS = [
  ["Slow to load", "Loads in a second", 8, 12, -8],
  ["Cluttered", "Focused", 38, 8, 5],
  ["Unclear offer", "One clear offer", 66, 14, -4],
  ["Broken on phones", "Built for phones", 14, 34, 6],
  ["Outdated", "Current", 48, 30, -10],
  ["Hard to update", "Easy to edit", 74, 36, 7],
  ["Generic template", "Made for you", 4, 58, -5],
  ["No leads", "Steady leads", 32, 52, 9],
  ["Heavy images", "Optimised media", 58, 56, -6],
  ["Confusing menu", "Simple navigation", 80, 62, 4],
  ["Invisible on Google", "Found on Google", 18, 80, 7],
  ["Scattered brand", "One brand", 50, 78, -7],
  ["No analytics", "Measured", 78, 86, -3],
];

// Lens radius in px: smaller on phones.
const R = typeof window !== "undefined" && window.innerWidth < 768 ? 62 : 90;

/**
 * The rough version as a scatter of crumpled word slips; a glass lens shows the
 * refined version underneath wherever it passes. The lens follows the pointer
 * (spring), and drifts on its own when nobody is pointing. Reduced motion: the
 * lens rests in the middle.
 */
function Field({ className = "mt-14 h-[78vh] min-h-[560px] md:h-[70vh]" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 });
  const clip = useMotionTemplate`circle(${R}px at ${sx}px ${sy}px)`;
  const pointing = useRef(false);

  useEffect(
    function drift() {
      const el = ref.current;
      if (!el) return undefined;
      const { width: w, height: h } = el.getBoundingClientRect();
      x.set(w / 2);
      y.set(h / 2);
      if (reduce) return undefined;
      // A slow figure-eight while idle.
      const c = animate(0, Math.PI * 2, {
        duration: 14,
        ease: "linear",
        repeat: Infinity,
        autoplay: false,
        onUpdate(t) {
          if (pointing.current) return;
          const b = el.getBoundingClientRect();
          x.set(b.width / 2 + Math.sin(t) * b.width * 0.32);
          y.set(b.height / 2 + Math.sin(t * 2) * b.height * 0.26);
        },
      });
      // Drift only while the field is on screen.
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? c.play() : c.pause()));
      io.observe(el);
      return () => {
        io.disconnect();
        c.stop();
      };
    },
    [reduce, x, y],
  );

  function move(event) {
    const b = ref.current.getBoundingClientRect();
    pointing.current = true;
    x.set(event.clientX - b.left);
    y.set(event.clientY - b.top);
  }

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => (pointing.current = false)}
      className={`relative ${className} overflow-hidden rounded-[28px] border border-snow/15 bg-ink/50 cursor-none touch-pan-y`}
      aria-label="Rough versus refined: move the lens over the problems to see the fixes"
      role="img"
    >
      {/* Rough: crumpled paper slips. */}
      {WORDS.map(function renderRough([rough, , left, top, tilt]) {
        return (
          <span
            key={rough}
            className="absolute px-2 py-1 md:px-4 md:py-2 bg-ice text-ink-2 text-[12px] md:text-body whitespace-nowrap shadow-[2px_3px_0_rgba(7,10,22,0.35)]"
            style={{
              left: `min(${left}%, calc(100% - 8rem))`,
              top: `${top}%`,
              rotate: `${tilt}deg`,
              filter: "saturate(0.6)",
            }}
          >
            {rough}
          </span>
        );
      })}

      {/* Refined: the same spots, set straight in glass, seen only through the lens. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-deep"
        style={{ clipPath: clip, WebkitClipPath: clip }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(91,131,232,0.5), transparent 70%)",
          }}
        />
        {WORDS.map(function renderRefined([rough, refined, left, top]) {
          return (
            <span
              key={rough}
              className="absolute glass-pill px-2 py-1 md:px-4 md:py-2 text-[12px] md:text-body text-snow whitespace-nowrap bg-royal/60!"
              style={{
                left: `min(${left}%, calc(100% - 8rem))`,
                top: `${top}%`,
              }}
            >
              {refined}
            </span>
          );
        })}
      </motion.div>

      {/* The lens: glass rim and handle. */}
      <motion.div
        aria-hidden
        className="absolute left-0 top-0 pointer-events-none"
        style={{ x: sx, y: sy }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: R * 2,
            height: R * 2,
            left: -R,
            top: -R,
            boxShadow:
              "0 0 0 10px rgba(201,216,244,0.35), 0 0 0 11px rgba(242,245,251,0.6), inset 0 0 40px rgba(201,216,244,0.35), 0 20px 60px rgba(7,10,22,0.5)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 26,
            height: 110,
            left: R * 0.62,
            top: R * 0.62,
            rotate: "-45deg",
            transformOrigin: "50% 0",
            background:
              "linear-gradient(90deg, rgba(201,216,244,0.55), rgba(91,131,232,0.8))",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        />
      </motion.div>
    </div>
  );
}

// "From rough to refined" (the second card in About): the rough version under
// a magnifier that reveals the refined one.
function BeforeAfter() {
  return (
    <div id="before-after" className="h-full flex flex-col rounded-panel border border-snow/15 bg-ink/35 p-6 md:p-8">
      <h3 className="text-snow font-light leading-[1.05] tracking-[-0.03em]" style={{ fontSize: "clamp(1.9rem, 3vw, 3rem)" }}>
        From rough to refined.
      </h3>
      <p className="text-body text-ice mt-3 max-w-[40ch]">Move the lens over the problems most sites share to see what they become.</p>
      <Field className="mt-6 flex-1 min-h-[420px]" />
    </div>
  );
}

export default BeforeAfter;
