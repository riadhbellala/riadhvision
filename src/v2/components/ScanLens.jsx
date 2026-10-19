import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import GlassIcon from "./GlassIcon";

// The glass magnifier art (icons-webp/01_…): where its lens sits inside the
// square image, as fractions of the image size.
const ICON = 1.8; // icon size, in em of the text's font
// The clear glass inside the ring is a slight ellipse (the ring is tilted).
const LENS_X = 0.446;
const LENS_Y = 0.435;
const LENS_RX = 0.108;
const LENS_RY = 0.122;
const ZOOM = 1.35;

/**
 * Lines of type scanned by the glass magnifier, like reading: it glides along
 * the first line, drops to the next and reads it back, then retraces. Through
 * its lens the letters show enlarged (an aria-hidden copy; the real text stays
 * plain for readers). Sized in em, so it follows the font size. Each line is a
 * [data-line] span, so the entrance can animate them. Reduced motion: the
 * magnifier rests at the end of the first line.
 */
function ScanLens({ lines, duration = 4 }) {
  const boxRef = useRef(null);
  const groupRef = useRef(null);
  const clipRef = useRef(null);
  const copyRef = useRef(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const group = groupRef.current;
    const clip = clipRef.current;
    const copy = copyRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { p: reduce ? 1 / 3 : 0 };
    let geo;

    function measure() {
      const fs = parseFloat(getComputedStyle(box).fontSize);
      const s = fs * ICON;
      const els = [...box.querySelectorAll(":scope > [data-line]")];
      // Path for the lens centre: line 1 left to right, then line 2 right to left, …
      const pts = [];
      els.forEach((el, i) => {
        const y = el.offsetTop + el.offsetHeight / 2;
        const a = el.offsetLeft + fs * 0.25;
        const b = el.offsetLeft + el.offsetWidth - fs * 0.15;
        if (i % 2) pts.push([b, y], [a, y]);
        else pts.push([a, y], [b, y]);
      });
      const lens = { cx: s * LENS_X, cy: s * LENS_Y, rx: s * LENS_RX, ry: s * LENS_RY };
      geo = { pts, ...lens };
      Object.assign(clip.style, {
        left: `${lens.cx - lens.rx}px`,
        top: `${lens.cy - lens.ry}px`,
        width: `${2 * lens.rx}px`,
        height: `${2 * lens.ry}px`,
      });
      copy.style.width = `${box.offsetWidth}px`;
      paint();
    }

    // Point along the path at progress p (0..1), by length.
    function at(p) {
      const { pts } = geo;
      const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
      let d = p * segs.reduce((a, b) => a + b, 0);
      for (let i = 0; i < segs.length; i++) {
        if (d <= segs[i] || i === segs.length - 1) {
          const t = segs[i] ? Math.min(1, d / segs[i]) : 0;
          return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t];
        }
        d -= segs[i];
      }
      return pts[0];
    }

    function paint() {
      if (!geo || geo.pts.length < 2) return;
      const { cx, cy, rx, ry } = geo;
      const [px, py] = at(state.p);
      group.style.transform = `translate(${px - cx}px, ${py - cy}px)`;
      // The copy sits where the text is, zoomed around the lens centre.
      copy.style.left = `${-(px - rx)}px`;
      copy.style.top = `${-(py - ry)}px`;
      copy.style.transformOrigin = `${px}px ${py}px`;
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    document.fonts?.ready.then(measure);

    const tween = reduce
      ? null
      : gsap.to(state, {
          p: 1,
          duration: duration * Math.max(1, lines.length),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.6,
          onUpdate: paint,
        });
    return () => {
      ro.disconnect();
      tween?.kill();
    };
  }, [duration, lines.length]);

  return (
    <span ref={boxRef} className="relative inline-block">
      {lines.map(function renderLine(line) {
        return (
          <span key={line} data-line className="block w-fit whitespace-nowrap">
            {line}
          </span>
        );
      })}
      <span ref={groupRef} aria-hidden className="absolute left-0 top-0 pointer-events-none will-change-transform" style={{ width: `${ICON}em`, height: `${ICON}em` }}>
        {/* What the lens sees: the same text, enlarged. */}
        <span ref={clipRef} className="absolute overflow-hidden rounded-[50%]" style={{ background: "rgba(36,72,201,0.35)" }}>
          <span ref={copyRef} className="absolute" style={{ transform: `scale(${ZOOM})` }}>
            {lines.map(function renderCopy(line) {
              return (
                <span key={line} className="block w-fit whitespace-nowrap">
                  {line}
                </span>
              );
            })}
          </span>
        </span>
        <GlassIcon name="search" size={200} className="absolute inset-0 w-full h-full max-w-none drop-shadow-[0_12px_24px_rgba(7,10,22,0.35)]" />
      </span>
    </span>
  );
}

export default ScanLens;
