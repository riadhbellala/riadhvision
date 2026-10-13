import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GROOVE_WIDTH, groove } from "../lib/groove";

gsap.registerPlugin(ScrollTrigger);

const fadeEnds = "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)";

/**
 * A single carved arc that draws itself as its section scrolls into view.
 * Place it as a direct child of the section (SectionShell's `decoration` slot).
 *
 * side    "left" | "right": edge the arc bulges out from
 * radius  circle radius in px
 * inset   distance of the arc's apex from that edge, in vw
 * top     top of the visible band, % of the section
 * height  height of the visible band, % of the section
 * theme   "light" | "navy"
 */
const GrooveLine = ({ side = "left", radius = 900, inset = 2.5, top = 0, height = 100, theme = "light" }) => {
  const wrapperRef = useRef(null);
  const colors = groove[theme];
  const pad = GROOVE_WIDTH / 2 + 2;
  const c = radius + pad; // circle centre within the SVG
  const size = c * 2;
  // Half circle facing into the page: right half for the left edge, left half for the right edge.
  const arc = (r) => `M ${c} ${c - r} A ${r} ${r} 0 0 ${side === "left" ? 1 : 0} ${c} ${c + r}`;

  useGSAP(
    () => {
      const paths = wrapperRef.current.querySelectorAll("path");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(paths, { strokeDashoffset: 0 });
        return;
      }
      gsap.to(paths, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current.parentElement,
          start: "top 85%",
          end: "center 40%",
          scrub: 0.8,
          // Once drawn, stay drawn: finish the stroke and stop tracking scroll.
          onLeave: (self) => {
            self.kill();
            gsap.to(paths, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out", overwrite: true });
          },
        },
      });
    },
    { scope: wrapperRef }
  );

  const stroke = (r, width, color) => (
    <path
      d={arc(r)}
      fill="none"
      pathLength={1}
      strokeWidth={width}
      style={{ stroke: color, strokeDasharray: 1, strokeDashoffset: 1 }}
    />
  );

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="absolute z-0 pointer-events-none overflow-hidden hidden xl:block"
      style={{
        top: `${top}%`,
        height: `${height}%`,
        [side]: 0,
        width: `calc(${inset}vw + ${pad}px)`,
        maskImage: fadeEnds,
        WebkitMaskImage: fadeEnds,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute"
        style={{ top: `calc(50% - ${c}px)`, [side]: `calc(${inset}vw - ${radius + c}px)` }}
      >
        {stroke(radius, GROOVE_WIDTH, colors.band)}
        {stroke(radius - GROOVE_WIDTH / 2, 1, colors.inner)}
        {stroke(radius + GROOVE_WIDTH / 2, 1, colors.outer)}
      </svg>
    </div>
  );
};

export default GrooveLine;
