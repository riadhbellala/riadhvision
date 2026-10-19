import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FIELD_RECIPES } from "../fieldRecipes";

gsap.registerPlugin(ScrollTrigger);

const EXTEND = "25vh";
function fieldMask(top, bottom) {
  const a = top ? `transparent, black ${EXTEND}` : "black, black";
  const b = bottom ? `black calc(100% - ${EXTEND}), transparent` : "black";
  return `linear-gradient(${a}, ${b})`;
}

function lightGradient(light) {
  const stops = light.stops.map(([c, a, at]) => `rgba(${c},${a}) ${at}%`).join(", ");
  return `linear-gradient(${light.dir}, ${stops})`;
}

function poolGradient(pool) {
  // Optional halo: the pool's edge glows in a colour (royal) before fading out.
  if (pool.halo) {
    return `radial-gradient(ellipse ${pool.rx} ${pool.ry} at ${pool.at}, rgba(${pool.color},${pool.alpha}) 0%, rgba(${pool.color},${pool.alpha * 0.85}) 30%, rgba(${pool.halo},0.85) 62%, rgba(${pool.halo},0) 100%)`;
  }
  return `radial-gradient(ellipse ${pool.rx} ${pool.ry} at ${pool.at}, rgba(${pool.color},${pool.alpha}), rgba(${pool.color},${pool.alpha * 0.55}) 45%, transparent 100%)`;
}

/**
 * Grainy gradient field behind a section (see fieldRecipes.js). It extends
 * 25vh above and below its section with a vertical fade, so neighbouring
 * fields cross-dissolve and the page reads as one artwork. Layers: colour
 * body → corner light → dark pool → heavy grain. The light and the pool drift
 * a little with scroll. Static with reduced motion.
 *
 * The light and the pool are anchored to the section itself (not the
 * extended field), so a corner light really starts at the section's corner.
 *
 * extendTop     false for the first section (nothing above to blend from)
 * extendBottom  false for the last section (nothing below to blend into)
 */
function GradientField({ recipe, extendTop = true, extendBottom = true }) {
  const rootRef = useRef(null);
  const r = FIELD_RECIPES[recipe];

  useGSAP(
    () => {
      if (!r || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const k = window.matchMedia("(min-width: 768px)").matches ? 1 : 0.4;
      const st = { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo("[data-field=light]", { x: `${-3 * k}vw`, rotate: -1.5 * k }, { x: `${3 * k}vw`, rotate: 1.5 * k, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-field=pool]", { x: `${2.5 * k}vw`, rotate: 1 * k }, { x: `${-2.5 * k}vw`, rotate: -1 * k, ease: "none", scrollTrigger: st });
    },
    { scope: rootRef }
  );

  if (!r) return null;
  // Section-sized, plus 6vh of bleed so the drift's slight rotation never shows an edge.
  const box = {
    top: `calc(${extendTop ? EXTEND : "0px"} - 6vh)`,
    bottom: `calc(${extendBottom ? EXTEND : "0px"} - 6vh)`,
  };

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="grain-heavy absolute inset-x-0 z-0 pointer-events-none overflow-hidden"
      style={{
        top: extendTop ? `-${EXTEND}` : 0,
        bottom: extendBottom ? `-${EXTEND}` : 0,
        maskImage: fieldMask(extendTop, extendBottom),
        WebkitMaskImage: fieldMask(extendTop, extendBottom),
        background: r.bodyCss || `linear-gradient(180deg, ${r.body[0]}, ${r.body[1]})`,
      }}
    >
      {/* Section-sized layers, 5vw wider on each side so the drift never shows an edge */}
      {r.light && (
        <div
          data-field="light"
          className="absolute -inset-x-[5vw]"
          style={{
            ...box,
            background: lightGradient(r.light),
            // Fade in under the section above instead of starting on a hard line.
            maskImage: extendTop ? "linear-gradient(transparent 6vh, black 20vh)" : undefined,
            WebkitMaskImage: extendTop ? "linear-gradient(transparent 6vh, black 20vh)" : undefined,
          }}
        />
      )}
      {/* The pool sits over the light, so the dark cuts into it as in the reference */}
      <div data-field="pool" className="absolute -inset-x-[5vw]" style={{ ...box, background: poolGradient(r.pool) }} />
    </div>
  );
}

export default GradientField;
