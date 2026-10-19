import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";

// Soft edges top and bottom so the panel melts into the fixed background (no cut).
const EDGE_MASK = "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)";

// Three soft blobs that read as one S-shaped glow (positions in % of the section).
const BLOBS = [
  { left: 66, top: 32, w: 60, h: 40, color: "rgba(201,216,244,0.95)", drift: -10 }, // ice, upper right
  { left: 46, top: 52, w: 44, h: 30, color: "rgba(91,131,232,1)", drift: 6 }, // glow, centre bend
  { left: 26, top: 74, w: 62, h: 36, color: "rgba(201,216,244,0.9)", drift: -16 }, // ice, lower left
];

/**
 * Section backdrop: a royal-blue bed with grainy ice/glow blobs forming a soft
 * S, like a printed gradient poster. The blobs drift at different speeds as
 * the section scrolls through (parallax), static with reduced motion.
 * `flip` mirrors it horizontally. Use as Section's `backdrop`.
 */
function Bloom({ flip = false }) {
  const rootRef = useRef(null);
  const isDesktop = useMediaQuery({ minWidth: 768 });

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = gsap.context(() => {
      const blobs = rootRef.current.querySelectorAll("[data-blob]");
      gsap.fromTo(
        blobs,
        { yPercent: (i) => -BLOBS[i].drift, rotate: (i) => (i % 2 ? 6 : -6) },
        {
          yPercent: (i) => BLOBS[i].drift,
          rotate: (i) => (i % 2 ? -6 : 6),
          ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="grain-heavy absolute inset-0 pointer-events-none overflow-hidden"
      style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK, transform: flip ? "scaleX(-1)" : undefined }}
    >
      <div className="absolute inset-0 bg-royal" />
      {/* Darker corners keep the edges deep, like the reference. */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 0% 10%, rgba(19,42,122,0.9), transparent 70%)" }}
      />
      {BLOBS.map(function renderBlob(b, i) {
        return (
          <div
            key={i}
            data-blob
            className="absolute rounded-full"
            style={{
              left: `${b.left}%`,
              top: `${isDesktop ? b.top : b.top + 12}%`, // lower on mobile, between the stacked callouts
              width: `${b.w}%`,
              height: `${isDesktop ? b.h : b.h * 0.6}%`,
              translate: "-50% -50%",
              background: `radial-gradient(closest-side, ${b.color} 30%, transparent)`,
              filter: `blur(${isDesktop ? 40 : 28}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

export default Bloom;
