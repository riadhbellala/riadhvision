// Folder (adapted from the "FolderInteraction" component: plain JSX, framer-motion
// instead of `motion` since it's the same API and already installed, RiadhVision
// palette and glass). A folder whose pages fan out of it when it opens.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Where each page sits closed (tucked in the folder) and open (fanned out above it).
const POSES = [
  { closed: { rotate: -4, x: -40, y: 6 }, open: { rotate: -14, x: -118, y: -150 }, z: 4, spring: { stiffness: 70, damping: 16 } },
  { closed: { rotate: 0, x: 0, y: 0 }, open: { rotate: 2, x: 0, y: -178 }, z: 5, spring: { stiffness: 80, damping: 17 } },
  { closed: { rotate: 5, x: 44, y: 4 }, open: { rotate: 14, x: 118, y: -150 }, z: 4, spring: { stiffness: 74, damping: 16 } },
];

/**
 * `items` = [{ key, image, title, to }], up to three. The folder opens on
 * hover, focus or tap (and `defaultOpen` opens it once, `openDelay` ms after
 * mount); each page is
 * a link. `label` is shown in a bubble above. Reduced motion: no springs.
 */
export function Folder({ items = [], label, defaultOpen = false, openDelay = 900, className = "" }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(
    function openOnce() {
      if (!defaultOpen) return undefined;
      const t = setTimeout(() => setOpen(true), openDelay);
      return () => clearTimeout(t);
    },
    [defaultOpen, openDelay]
  );

  const pages = items.slice(0, 3);
  const t = (spring) => (reduce ? { duration: 0 } : { type: "spring", ...spring });

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {label && (
        <div className="relative z-10 flex flex-col items-center mb-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={hovered ?? "label"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-[18px] border border-snow/20 bg-ink/80 px-5 py-2.5 text-body text-snow shadow-[0_10px_30px_rgba(7,10,22,0.35)]"
            >
              {hovered ?? label}
            </motion.p>
          </AnimatePresence>
          <svg width="18" height="11" viewBox="0 0 22 14" className="-mt-px" aria-hidden>
            <path d="M0 0 L22 0 L11 14 Z" fill="rgba(7,10,22,0.8)" />
          </svg>
        </div>
      )}

      <div
        className="relative w-[300px] h-[250px] mt-[170px] cursor-pointer"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => {
          setOpen(defaultOpen);
          setHovered(null);
        }}
        onClick={() => setOpen((v) => !v)}
      >
        {/* Soft shadow pool under the folder. */}
        <div
          aria-hidden
          className="absolute -left-8 -right-8 top-12 -bottom-10 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 70% at 50% 60%, rgba(7,10,22,0.6), transparent 75%)", filter: "blur(22px)" }}
        />

        {/* Folder back. */}
        <div
          aria-hidden
          className="absolute left-[18px] right-[18px] top-[18px] bottom-[14px] rounded-[22px] border border-snow/15"
          style={{ background: "linear-gradient(160deg, #2448C9, #132A7A 45%, #0E1430)", boxShadow: "inset 0 1px 0 rgba(242,245,251,0.25)" }}
        />

        {/* Pages: the projects. */}
        {pages.map(function renderPage(item, i) {
          const pose = POSES[i];
          return (
            <motion.div
              key={item.key}
              initial={pose.closed}
              animate={open ? pose.open : pose.closed}
              transition={t(pose.spring)}
              className="absolute top-4 left-1/2 -ml-[66px] w-[132px] h-[168px]"
              style={{ zIndex: pose.z }}
            >
              <Link
                to={item.to}
                tabIndex={open ? 0 : -1}
                aria-label={`Open the ${item.title} case study`}
                onMouseEnter={() => setHovered(item.title)}
                onFocus={() => {
                  setOpen(true);
                  setHovered(item.title);
                }}
                onClick={(e) => {
                  if (!open) e.preventDefault();
                  e.stopPropagation();
                }}
                className="block w-full h-full overflow-hidden rounded-[14px] border border-snow/30 bg-ink-2 shadow-[0_10px_24px_rgba(7,10,22,0.45)] transition-transform duration-200 ease-out hover:scale-[1.06] focus-visible:ring-2 focus-visible:ring-snow outline-none"
              >
                <img src={item.image} alt="" draggable="false" className="w-full h-full object-cover object-top" />
              </Link>
            </motion.div>
          );
        })}

        {/* Front flap with the tab, in frosted cobalt glass; tips forward when open. */}
        <motion.div
          aria-hidden
          animate={{ rotateX: open ? -42 : 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", duration: 1, bounce: 0.15 }}
          className="absolute left-[17px] right-[17px] bottom-[13px] h-[156px] z-[8] pointer-events-none"
          style={{ transformOrigin: "bottom center", transformPerspective: 700 }}
        >
          <svg viewBox="0 0 210 150" preserveAspectRatio="none" className="w-full h-full block overflow-visible" style={{ filter: "drop-shadow(0 6px 14px rgba(7,10,22,0.35))" }}>
            <defs>
              <linearGradient id="rv-flap" x1="0" y1="22" x2="0" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(201,216,244,0.55)" />
                <stop offset="30%" stopColor="rgba(91,131,232,0.6)" />
                <stop offset="70%" stopColor="rgba(36,72,201,0.82)" />
                <stop offset="100%" stopColor="rgba(19,42,122,0.95)" />
              </linearGradient>
              <linearGradient id="rv-flap-edge" x1="0" y1="0" x2="0" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="60%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <path d="M 14 0 L 64 0 Q 74 0 79 9 L 86 22 L 196 22 Q 210 22 210 36 L 210 136 Q 210 150 196 150 L 14 150 Q 0 150 0 136 L 0 14 Q 0 0 14 0 Z" fill="url(#rv-flap)" />
            <path d="M 14 0 L 64 0 Q 74 0 79 9 L 86 22 L 196 22 Q 210 22 210 36" fill="none" stroke="url(#rv-flap-edge)" strokeWidth="1.2" />
          </svg>
          <div className="absolute top-[24px] left-0 w-[55%] h-[45%]" style={{ background: "radial-gradient(ellipse at 18% 8%, rgba(255,255,255,0.22), transparent 70%)" }} />
          <img src="/assets/logo/logowhite.webp" alt="" className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 h-9 w-auto opacity-80" />
        </motion.div>
      </div>
    </div>
  );
}

export default Folder;
