import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// An ellipse ~160% of the screen wide hanging from the top centre: transparent
// inside, then deep → glow → ice → snow outwards. The bottom row ends fully in
// snow and the light rises softly at the sides.
const RISE =
  "radial-gradient(ellipse 80% 100% at 50% 0%, transparent 0%, transparent 38%, rgba(19,42,122,0.55) 58%, rgba(91,131,232,0.75) 72%, rgba(201,216,244,0.95) 86%, #F2F5FB 100%)";
// Mirrored: leaves the light, curving back down into the dark page.
const FALL =
  "radial-gradient(ellipse 80% 100% at 50% 100%, transparent 0%, transparent 38%, rgba(19,42,122,0.55) 58%, rgba(91,131,232,0.75) 72%, rgba(201,216,244,0.95) 86%, #F2F5FB 100%)";

const EDGE_IN = "linear-gradient(to bottom, transparent, black 40%)";
const EDGE_OUT = "linear-gradient(to top, transparent, black 40%)";

/**
 * Light horizon transition (~60vh), placed in the flow between two sections.
 * direction "in": dark → light (the next section sits on snow).
 * direction "out": light → dark (back to the page background).
 * Above the page background, below the content; no text sits on it.
 * It rises slightly as it scrolls into view.
 *
 * data-light marks which part of it is light, for the navbar's text colour.
 */
function LightHorizon({ direction = "in" }) {
  const rootRef = useRef(null);
  const layerRef = useRef(null);
  const rising = direction === "in";

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        layerRef.current,
        { y: 40 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "top 40%", scrub: true },
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-light={rising ? "0.55-1" : "0-0.45"}
      className="relative z-[5] h-[60vh] pointer-events-none"
    >
      {/* Overlaps 40px on the light side so the rise never opens a gap */}
      <div
        ref={layerRef}
        className={`grain absolute inset-x-0 ${rising ? "top-0 -bottom-10" : "-top-10 bottom-0"}`}
        style={{
          background: rising ? RISE : FALL,
          // Fade the dark-side edge so the curve dissolves into the page background.
          maskImage: rising ? EDGE_IN : EDGE_OUT,
          WebkitMaskImage: rising ? EDGE_IN : EDGE_OUT,
        }}
      />
    </div>
  );
}

export default LightHorizon;
