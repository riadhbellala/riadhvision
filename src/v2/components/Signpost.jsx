// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";
import GlassIcon from "./GlassIcon";

// The three boards of the glass signpost, in % of the 500px art: centre and tilt.
const BOARDS = [
  { label: "Website", x: 48, y: 23, rotate: 12 },
  { label: "Online store", x: 55, y: 44.5, rotate: -10 },
  { label: "Web app", x: 47, y: 67.5, rotate: 8 },
];

/**
 * The glass signpost as a chooser of paths: its three boards read Website,
 * Online store and Web app. `active` (one of those labels) lights its board and
 * dims the others, and the post gives a small nudge toward it; with nothing
 * active the post idles and every board reads at rest.
 */
function Signpost({ active = null, className = "" }) {
  const reduce = useReducedMotion();
  const index = BOARDS.findIndex((b) => b.label === active);

  return (
    <motion.div
      className={`relative aspect-square ${className}`}
      animate={reduce || index < 0 ? { rotate: 0 } : { rotate: [0, index === 1 ? -3 : 3, 0] }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      <GlassIcon name="signpost" size={900} className="absolute inset-0 w-full h-full" />
      {BOARDS.map(function renderBoard(board, i) {
        const on = i === index;
        const dim = index >= 0 && !on;
        return (
          <span
            key={board.label}
            data-board
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-semibold uppercase tracking-[0.06em] transition-[color,opacity,transform] duration-500"
            style={{
              left: `${board.x}%`,
              top: `${board.y}%`,
              rotate: `${board.rotate}deg`,
              fontSize: "clamp(0.8rem, 1.25vw, 1.2rem)",
              scale: on ? "1.1" : "1",
              color: on ? "#2448C9" : "#0E1430",
              opacity: dim ? 0.35 : 1,
              textShadow: "0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            {board.label}
          </span>
        );
      })}
    </motion.div>
  );
}

export default Signpost;
