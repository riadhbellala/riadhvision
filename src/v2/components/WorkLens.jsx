import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects } from "../../constants";

// Shipped sites with a live address, by slug (full-page screenshots; only the top is shown).
const SLUGS = ["yashome", "batioil", "hydrame"];
const SHOTS = SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean);

const EASE = [0.22, 1, 0.36, 1];
const HOLD = 2600; // ms per site

// Cropped first-screen previews (public/assets/projects/thumbs), not the full-page screenshots.
function thumb(project) {
  return `/assets/projects/thumbs/${project.slug}.webp`;
}

function shortName(name) {
  return name.split(" — ")[0];
}

function domain(href) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * The hero's window: a frosted glass browser showing the first screen of real
 * shipped sites, sliding in one after another. The names below pick a site;
 * hovering pauses. The window opens the case study. Reduced motion: cross-fade.
 */
function WorkLens() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const shot = SHOTS[active];

  useEffect(
    function cycle() {
      if (paused) return undefined;
      const t = setTimeout(() => setActive((i) => (i + 1) % SHOTS.length), HOLD);
      // Warm the next screenshot so it arrives sharp.
      const next = new Image();
      next.src = thumb(SHOTS[(active + 1) % SHOTS.length]);
      return () => clearTimeout(t);
    },
    [active, paused]
  );

  if (!shot) return null;

  return (
    <figure className="flex flex-col gap-5">
      <Link
        to={`/project/${shot.slug}`}
        aria-label={`Open the ${shortName(shot.name)} case study`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="group block rounded-[22px] p-2 outline-none focus-visible:ring-2 focus-visible:ring-snow"
        style={{
          background: "linear-gradient(160deg, rgba(242,245,251,0.22), rgba(242,245,251,0.06))",
          border: "1px solid rgba(242,245,251,0.28)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 30px 80px rgba(7,10,22,0.45)",
        }}
      >
        {/* Browser bar: three lights and the site's real address. */}
        <div className="flex items-center gap-3 px-2 pt-1 pb-3">
          <span aria-hidden className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-snow/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-snow/35" />
            <span className="w-2.5 h-2.5 rounded-full bg-snow/20" />
          </span>
          <span className="flex-1 min-w-0 truncate rounded-pill bg-ink/40 px-4 py-1.5 text-small text-ice text-center">{domain(shot.href)}</span>
        </div>

        <div className="relative aspect-[16/10] md:aspect-[4/3] overflow-hidden rounded-[16px] bg-ink-2">
          <AnimatePresence initial={false}>
            <motion.img
              key={shot.slug}
              src={thumb(shot)}
              alt={`${shortName(shot.name)} website`}
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top"
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: "0%" }}
              exit={reduce ? { opacity: 0 } : { x: "-100%" }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </AnimatePresence>
          <span className="absolute right-3 bottom-3 grid place-items-center w-11 h-11 rounded-full bg-snow text-deep opacity-0 scale-90 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M5 13 13 5M6 5h7v7" />
            </svg>
          </span>
        </div>
      </Link>

      <figcaption className="flex items-baseline justify-between gap-4 px-1">
        <span className="text-h4 text-snow">{shortName(shot.name)}</span>
        <span className="text-small text-ice">
          {shot.category}, {shot.year}
        </span>
      </figcaption>

      <ul className="flex flex-wrap gap-x-5 gap-y-2 px-1" aria-label="Featured work">
        {SHOTS.map(function renderName(p, i) {
          const on = i === active;
          return (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={`relative pb-2 text-small transition-colors duration-200 ${on ? "text-snow" : "text-ice/70 hover:text-snow"}`}
              >
                {shortName(p.name)}
                {/* Time left on the active site, as a filling bar. */}
                <span className="absolute left-0 right-0 bottom-0 h-[2px] rounded-full bg-snow/15 overflow-hidden">
                  {on && (
                    <motion.span
                      key={`${p.slug}-${paused}`}
                      className="block h-full bg-snow origin-left"
                      initial={{ scaleX: paused ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: paused ? 0 : HOLD / 1000, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

export default WorkLens;
