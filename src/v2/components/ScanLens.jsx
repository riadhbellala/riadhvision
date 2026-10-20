import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import GlassIcon from "./GlassIcon";

// The glass magnifier art (icons-webp/01_…): where its lens sits inside the
// square image, as fractions of the image size.
const ICON = 1.8; // icon size, in em of the text's font
// Centre of the clear glass inside the ring.
const LENS_X = 0.446;
const LENS_Y = 0.435;
const ZOOM = 1.35;
const HOLE_SRC = "/icons-webp/search-hole.png";
const ICON_SRC = "/icons-webp/01_magnifying_glass_light-removebg-preview.webp";
const HOLE = { WebkitMaskImage: `url(${HOLE_SRC})`, maskImage: `url(${HOLE_SRC})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" };

/**
 * Lines of type scanned by the glass magnifier, like reading: it glides along
 * the first line, drops to the next and reads it back, then retraces. Through
 * its lens the letters show enlarged and turn blue (an aria-hidden copy; the real text stays
 * plain for readers). Sized in em, so it follows the font size. Each line is a
 * [data-line] span, so the entrance can animate them. Reduced motion: the
 * magnifier rests at the end of the first line.
 */
function ScanLens({ lines, duration = 4, typeDelay = 0 }) {
  const boxRef = useRef(null);
  const groupRef = useRef(null);
  const copyRef = useRef(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const group = groupRef.current;
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
      const lens = { cx: s * LENS_X, cy: s * LENS_Y };
      geo = { pts, ...lens };
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
      const { cx, cy } = geo;
      const [px, py] = at(state.p);
      group.style.transform = `translate(${px - cx}px, ${py - cy}px)`;
      // The copy sits where the text is, zoomed around the lens centre.
      copy.style.left = `${-(px - cx)}px`;
      copy.style.top = `${-(py - cy)}px`;
      copy.style.transformOrigin = `${px}px ${py}px`;
    }

    // Writing effect: the letters appear one by one, line after line. The
    // magnifier comes in once the sentence is written.
    const chars = [...box.querySelectorAll(":scope > [data-line] [data-char]")];
    const typed = new Promise((done) => {
      if (reduce) return done();
      gsap.set(chars, { opacity: 0 });
      gsap.to(chars, { opacity: 1, duration: 0.01, stagger: 0.04, delay: typeDelay, ease: "none", onComplete: done });
    });

    // Show the magnifier only once the icon and its lens mask are both loaded,
    // so one never appears without the other.
    group.style.opacity = "0";
    let alive = true;
    Promise.all(
      [ICON_SRC, HOLE_SRC].map(
        (src) =>
          new Promise((done) => {
            const img = new Image();
            img.onload = img.onerror = done;
            img.src = src;
          })
      )
    ).then(() => typed).then(() => {
      if (!alive) return;
      group.style.transition = "opacity 400ms ease-out";
      group.style.opacity = "1";
      if (tween) tween.restart();
    });

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
          paused: true,
        });
    // Only scan while the headline is on screen.
    const io = new IntersectionObserver(([e]) => tween && +group.style.opacity === 1 && (e.isIntersecting ? tween.play() : tween.pause()));
    io.observe(box);
    return () => {
      alive = false;
      io.disconnect();
      ro.disconnect();
      tween?.kill();
    };
  }, [duration, lines.length, typeDelay]);

  return (
    <span ref={boxRef} className="relative inline-block">
      {lines.map(function renderLine(line) {
        return (
          <span key={line} data-line className="relative block w-fit whitespace-nowrap" aria-label={line}>
            {[...line].map((ch, i) => (
              <span key={i} data-char aria-hidden>
                {ch}
              </span>
            ))}
          </span>
        );
      })}
      <span ref={groupRef} aria-hidden className="absolute left-0 top-0 pointer-events-none will-change-transform" style={{ width: `${ICON}em`, height: `${ICON}em` }}>
        {/* What the lens sees: the same text, enlarged. */}
        {/* Cut to the icon's own lens opening (search-hole.png, traced from the
            icon), so it fills the glass exactly. */}
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ background: "radial-gradient(circle at 42% 38%, #E4ECFB, #B7C9EE 10%, #93ABE3 16%)", ...HOLE }}
        >
          <span ref={copyRef} className="absolute" style={{ transform: `scale(${ZOOM})`, color: "#2448C9", textShadow: "0 0 18px rgba(91,131,232,0.8)" }}>
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
