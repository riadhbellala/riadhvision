import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The RiadhVision emblem as a large, soft background object: half off the
 * page edge, behind the content, it turns in perspective and drifts as the
 * section scrolls (scrubbed, so it reverses on the way back up). Use as a
 * Section `backdrop`. `side` picks the edge. Still with reduced motion.
 */
function EmblemDrift({ src = "/emblem.webp", side = "left", top = "20%", opacity = 0.4, className = "", imgClassName = "" }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const dir = side === "left" ? 1 : -1;
    gsap.set(el, { transformPerspective: 1000, rotateY: 25 * dir, rotateX: 12, rotate: -10 * dir });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const tween = gsap.fromTo(
      el,
      { y: 160, rotate: -30 * dir, rotateY: 35 * dir },
      {
        y: -160,
        rotate: 25 * dir,
        rotateY: -20 * dir,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 1 },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [side]);

  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <img
        ref={ref}
        src={src}
        alt=""
        draggable="false"
        style={{ top, opacity }}
        className={`absolute w-[60vw] max-w-[640px] md:w-[38vw] will-change-transform ${imgClassName} ${
          side === "left" ? "-left-[18vw] md:-left-[10vw]" : "-right-[18vw] md:-right-[10vw]"
        }`}
      />
    </div>
  );
}

export default EmblemDrift;
