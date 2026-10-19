import { useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import GlassIcon from "./GlassIcon";

// The same little page, as code. Token colours: tag, attribute, string, text.
const CODE = [
  [["<", "p"], ["header", "t"], [" className", "a"], ['="nav glass-pill sticky top-5"', "s"], [">", "p"], ["…", "x"], ["</", "p"], ["header", "t"], [">", "p"]],
  [],
  [["<", "p"], ["section", "t"], [" className", "a"], ['="hero grid lg:grid-cols-2 gap-16"', "s"], [">", "p"]],
  [["  <", "p"], ["h1", "t"], [" className", "a"], ['="text-display"', "s"], [">", "p"], ["Where ideas take shape.", "x"], ["</", "p"], ["h1", "t"], [">", "p"]],
  [["  <", "p"], ["p", "t"], [">", "p"], ["Fast, clear websites and web apps, sketch to launch.", "x"], ["</", "p"], ["p", "t"], [">", "p"]],
  [["  <", "p"], ["Button", "t"], [" to", "a"], ['="/start"', "s"], [" variant", "a"], ['="primary"', "s"], [">", "p"], ["Start a project", "x"], ["</", "p"], ["Button", "t"], [">", "p"]],
  [["  <", "p"], ["Image", "t"], [" src", "a"], ['="/work/hero.webp"', "s"], [" alt", "a"], ['="Latest project"', "s"], [" priority", "a"], [" />", "p"]],
  [["</", "p"], ["section", "t"], [">", "p"]],
  [],
  [["const", "t"], [" metrics ", "x"], ["= ", "p"], ["await", "t"], [" lighthouse", "x"], ["(", "p"], ['"/"', "s"], [")  ", "p"], ["// performance: 98", "p"]],
];
const TOKEN = { p: "text-ice/60", t: "text-glow", a: "text-ice", s: "text-snow", x: "text-snow/90" };

/**
 * About card: "where design and engineering meet", literally. The left of the
 * card is a page being designed (frames, a selection, the pen); the right is
 * the same page as code. A fluted glass divider is where they meet: it sweeps
 * slowly on its own and can be dragged. Reduced motion: it rests in the middle.
 */
function DesignCode() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const split = useMotionValue(52); // % from the left
  const dragging = useRef(false);
  const clip = useMotionTemplate`inset(0 0 0 ${split}%)`;
  const left = useTransform(split, (v) => `${v}%`);

  useEffect(
    function sweep() {
      if (reduce) return undefined;
      const c = animate(0, Math.PI * 2, {
        duration: 9,
        ease: "linear",
        repeat: Infinity,
        onUpdate(t) {
          if (!dragging.current) split.set(50 + Math.sin(t) * 22);
        },
      });
      return () => c.stop();
    },
    [reduce, split]
  );

  function move(event) {
    if (!dragging.current) return;
    const b = ref.current.getBoundingClientRect();
    split.set(Math.min(92, Math.max(8, ((event.clientX - b.left) / b.width) * 100)));
  }

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e);
      }}
      onPointerMove={move}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      className="grain-heavy relative w-full aspect-[4/3] overflow-hidden rounded-card border border-snow/15 select-none cursor-ew-resize touch-pan-y"
      style={{
        background:
          "radial-gradient(ellipse 60% 60% at 30% 35%, rgba(201,216,244,0.55), rgba(91,131,232,0.45) 45%, transparent 75%), radial-gradient(ellipse 80% 70% at 90% 100%, rgba(7,10,22,0.8), transparent 70%), #2448C9",
      }}
      role="img"
      aria-label="A page being designed on the left and the same page as code on the right, meeting at a glass divider"
    >
      {/* Design: a page laid out in glass frames, one of them selected. */}
      <div aria-hidden className="absolute inset-[7%] flex flex-col gap-[4%]">
        <div className="h-[9%] rounded-pill bg-snow/25 border border-snow/40 flex items-center px-[3%] gap-[3%]">
          <span className="w-[14%] h-[30%] rounded-pill bg-snow/80" />
          <span className="ml-auto w-[9%] h-[24%] rounded-pill bg-snow/50" />
          <span className="w-[9%] h-[24%] rounded-pill bg-snow/50" />
          <span className="w-[14%] h-[55%] rounded-pill bg-snow" />
        </div>
        <div className="flex-1 grid grid-cols-[1.1fr_1fr] gap-[5%]">
          <div className="flex flex-col justify-center gap-[6%]">
            {/* Selected frame with handles and its size. */}
            <div className="relative">
              <div className="h-[clamp(14px,3.2vw,30px)] w-[90%] rounded-[6px] bg-snow/90" />
              <div className="mt-[6%] h-[clamp(14px,3.2vw,30px)] w-[70%] rounded-[6px] bg-snow/90" />
              <span className="absolute -inset-[6%] border border-snow" />
              {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map(function renderHandle(pos) {
                return <span key={pos} className={`absolute ${pos} w-2 h-2 bg-snow border border-royal`} />;
              })}
              <span className="absolute -bottom-[34%] left-1/2 -translate-x-1/2 rounded-[4px] bg-snow px-1.5 py-0.5 text-[10px] text-deep whitespace-nowrap">
                Heading
              </span>
            </div>
            <div className="mt-[6%] flex flex-col gap-[0.5em]">
              <span className="h-[6px] w-[85%] rounded-pill bg-snow/50" />
              <span className="h-[6px] w-[65%] rounded-pill bg-snow/50" />
            </div>
            <span className="w-[42%] h-[clamp(18px,3.4vw,34px)] rounded-pill bg-snow" />
          </div>
          <div className="rounded-[14px] bg-snow/20 border border-snow/40 grid place-items-center">
            <GlassIcon name="pen" size={120} float className="w-[55%] h-auto" />
          </div>
        </div>
      </div>

      {/* Code: the same page, on ink, revealed right of the divider. */}
      <motion.div aria-hidden className="absolute inset-0 bg-ink-2/95" style={{ clipPath: clip, WebkitClipPath: clip }}>
        <pre className="absolute inset-[7%] font-mono text-[clamp(9px,1.45vw,15px)] leading-[1.9] overflow-hidden whitespace-pre">
          {CODE.map(function renderLine(tokens, i) {
            return (
              <div key={i} className="flex">
                <span className="w-[2.5em] shrink-0 text-ice/30 tabular-nums">{i + 1}</span>
                <span>
                  {tokens.map(function renderToken([text, kind], j) {
                    return (
                      <span key={j} className={TOKEN[kind]}>
                        {text}
                      </span>
                    );
                  })}
                </span>
              </div>
            );
          })}
        </pre>
      </motion.div>

      {/* The meeting point: a fluted glass divider with a grip. */}
      <motion.div aria-hidden className="absolute inset-y-0 -translate-x-1/2 w-6 md:w-8" style={{ left }}>
        <div className="fluted absolute inset-0 border-x border-snow/40" style={{ backgroundColor: "rgba(242,245,251,0.12)" }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-snow text-deep shadow-[0_8px_24px_rgba(7,10,22,0.4)]">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 5 2 9l4 4M12 5l4 4-4 4" />
          </svg>
        </div>
      </motion.div>

      <span className="absolute left-4 top-4 glass-pill bg-ink/30! px-4 py-1.5 text-label text-snow">Design</span>
      <span className="absolute right-4 top-4 glass-pill bg-ink/30! px-4 py-1.5 text-label text-snow">Engineering</span>
    </div>
  );
}

export default DesignCode;
