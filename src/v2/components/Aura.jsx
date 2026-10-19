// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

// Palette stops for the blobs (rgba so each blob fades to transparent).
const TONES = {
  light: ["rgba(36,72,201,0.55)", "rgba(19,42,122,0.35)", "rgba(91,131,232,0.45)"], // royal, deep, glow
  dark: ["rgba(19,42,122,0.9)", "rgba(36,72,201,0.7)", "rgba(91,131,232,0.5)", "rgba(201,216,244,0.25)"], // deep, royal, glow, ice
};

// Blob layouts per variant: position/size in % of the layer, breathing drift in px.
const VARIANTS = {
  orb: [
    { left: "50%", top: "50%", w: "62%", h: "70%", drift: [18, -12], duration: 12 },
    { left: "38%", top: "58%", w: "40%", h: "46%", drift: [-22, 10], duration: 14 },
    { left: "64%", top: "40%", w: "34%", h: "40%", drift: [14, 16], duration: 10 },
  ],
  horizon: [
    { left: "50%", top: "92%", w: "120%", h: "48%", drift: [24, -6], duration: 13 },
    { left: "30%", top: "88%", w: "60%", h: "36%", drift: [-18, 8], duration: 11 },
    { left: "74%", top: "96%", w: "54%", h: "34%", drift: [16, -8], duration: 14 },
  ],
  wave: [
    { left: "30%", top: "30%", w: "70%", h: "38%", drift: [22, 14], duration: 12, rotate: -18 },
    { left: "68%", top: "68%", w: "70%", h: "38%", drift: [-20, -10], duration: 14, rotate: -18 },
    { left: "50%", top: "50%", w: "40%", h: "30%", drift: [10, -14], duration: 10, rotate: -18 },
  ],
};

/**
 * Soft grainy aura: 2–3 large blurred palette blobs that slowly breathe.
 * Decorative only. Position it with `className` (it fills its positioned
 * parent by default). Static with reduced motion; lighter below md.
 */
function Aura({ variant = "orb", tone = "light", className = "" }) {
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const blobs = (VARIANTS[variant] || VARIANTS.orb).slice(0, isDesktop ? 3 : 2);
  const colors = TONES[tone] || TONES.light;
  const blur = isDesktop ? 80 : 50;

  return (
    <div aria-hidden className={`grain absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {blobs.map(function renderBlob(b, i) {
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: b.left,
              top: b.top,
              width: b.w,
              height: b.h,
              x: "-50%",
              y: "-50%",
              rotate: b.rotate || 0,
              background: `radial-gradient(closest-side, ${color}, transparent)`,
              filter: `blur(${blur}px)`,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.06, 1],
                    translateX: [0, b.drift[0], 0],
                    translateY: [0, b.drift[1], 0],
                  }
            }
            transition={{ duration: b.duration, ease: "easeInOut", repeat: Infinity }}
          />
        );
      })}
    </div>
  );
}

export default Aura;
