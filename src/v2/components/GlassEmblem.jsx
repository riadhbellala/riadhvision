import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function maskOf(src) {
  return { WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" };
}

/**
 * The RiadhVision emblem as a glass object woven into a headline (after the
 * "My portfolio" glass-ring poster). The emblem is a flat image, made to feel
 * 3D: it sits in perspective and slowly turns in X and Y, turns further as
 * the section scrolls (scrubbed, so it reverses), and a light sheen slides
 * across its surface. It is drawn twice around the headline: a solid copy
 * behind the type, and a glass copy in front, cut to the emblem's exact
 * shape, that blurs the letters behind it, so the type reads through the glass.
 *
 * Wrap the headline: <GlassEmblem className="…placement…">{h2}</GlassEmblem>.
 * Reduced motion: it holds still at a slight angle.
 */
function GlassEmblem({ children, src = "/emblem.webp", className = "" }) {
  const SRC = src;
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const layers = root.querySelectorAll("[data-emblem]");
    gsap.set(layers, { transformPerspective: 900, rotateY: -18, rotateX: 10, rotate: -8 });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = gsap.context(() => {
      // Idle turn, the same on both copies so they stay one object.
      // Paused while off screen.
      const idle = gsap.to(layers, { rotateY: 22, rotateX: -8, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true });
      ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onToggle: (self) => (self.isActive ? idle.play() : idle.pause()) });
      // Scroll adds a turn on top (reverses when scrolling back up).
      gsap.fromTo(
        layers,
        { rotate: -20, y: 40 },
        {
          rotate: 12,
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative isolate">
      {/* Behind the type: the solid emblem. */}
      <div aria-hidden className={`absolute -z-10 pointer-events-none ${className}`}>
        <div data-emblem className="w-full h-full">
          <img src={SRC} alt="" draggable="false" className="w-full h-full drop-shadow-[0_30px_50px_rgba(7,10,22,0.55)]" />
        </div>
      </div>

      {children}

      {/* In front of the type: glass in the emblem's shape. The letters under
          it blur and tint, and the emblem's highlights sit on top, faint. */}
      <div aria-hidden className={`absolute z-10 pointer-events-none ${className}`}>
        <div data-emblem className="relative w-full h-full overflow-hidden" style={maskOf(SRC)}>
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(91,131,232,0.18)",
              WebkitBackdropFilter: "blur(4px) brightness(1.1)",
              backdropFilter: "blur(4px) brightness(1.1)",
            }}
          />
          <img src={SRC} alt="" draggable="false" className="absolute inset-0 w-full h-full" style={{ opacity: 0.55, mixBlendMode: "screen" }} />
          {/* Light sliding across the surface. */}
          <span className="emblem-sheen absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-snow/45 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export default GlassEmblem;
