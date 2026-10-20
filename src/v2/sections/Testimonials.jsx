import { useCallback, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import GlassIcon from "../components/GlassIcon";
import NotchCard from "../components/NotchCard";
import { projects } from "../../constants";
import { cover } from "../components/projectArt";
import { EXTERNAL, siteOf } from "../components/links";

// SAMPLE quotes written for the layout: replace them with your clients' real
// words (or get each client's OK) before going live. `slug` links the quote to its project.
const QUOTES = [
  {
    quote:
      "The platform finally looks like the projects we sell. Buyers browse in French or Arabic, and the enquiries arrive already knowing what they want.",
    name: "YasHome",
    role: "Real estate platform, Algeria",
    slug: "yashome",
  },
  {
    quote:
      "Our whole catalogue is online in three languages and we update it ourselves. Distributors pull it up on their phones in front of customers.",
    name: "Batioil",
    role: "Lubricants brand",
    slug: "batioil",
  },
  {
    quote:
      "Our studies and projects finally read as clearly as we work. Partners land on the site and understand what Hydrame does in a few seconds.",
    name: "Hydrame",
    role: "Water and environment engineering",
    slug: "hydrame",
  },
];

const EASE = [0.22, 1, 0.36, 1];
const HOLD = 8000;

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Arrow({ flip }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path d="M3 9h12M10 4l5 5-5 5" />
    </svg>
  );
}

// Testimonials carousel (rendered inside Trust): one story at a time. The quote
// large on the left with its author, under a refracting glass quote mark; the
// project it's about on the right. Prev/next, swipe, arrow keys; it advances on
// its own and pauses while hovered or focused.
function Testimonials() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const q = QUOTES[index];
  const project = projects.find((p) => p.slug === q.slug);

  const go = useCallback((step) => {
    setDir(step);
    setIndex((i) => (i + step + QUOTES.length) % QUOTES.length);
  }, []);

  useEffect(
    function autoplay() {
      if (paused || reduce || QUOTES.length < 2) return undefined;
      const t = setTimeout(() => go(1), HOLD);
      return () => clearTimeout(t);
    },
    [index, paused, reduce, go],
  );

  function onKey(event) {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  }

  const slide = {
    initial: (d) => (reduce ? { opacity: 0 } : { opacity: 0, x: 40 * d }),
    animate: { opacity: 1, x: 0 },
    exit: (d) => (reduce ? { opacity: 0 } : { opacity: 0, x: -40 * d }),
  };

  return (
    <div id="testimonials" className="mt-24 md:mt-32">
      <div>
        <h3
          className="text-snow font-light leading-none tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.25rem, 4.5vw, 4.5rem)" }}
        >
          In their words.
        </h3>
      </div>

      <NotchCard
        className="mt-12"
        tl={[150, 60]}
        br={[150, 76]}
        tab={
          <span
            className="ml-1 rounded-pill bg-snow text-deep px-4 py-2 text-small font-medium tabular-nums"
            aria-live="polite"
          >
            {index + 1} / {QUOTES.length}
          </span>
        }
        corner={
          <span className="flex gap-2 mr-1">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="grid place-items-center w-12 h-12 rounded-full bg-snow text-deep transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <Arrow flip />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="grid place-items-center w-12 h-12 rounded-full bg-snow text-deep transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <Arrow />
            </button>
          </span>
        }
      >
        <div
          className="relative px-6 md:px-12 outline-none focus-visible:ring-2 focus-visible:ring-snow"
          tabIndex={0}
          onKeyDown={onKey}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={index}
              custom={dir}
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.45, ease: EASE }}
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center cursor-grab active:cursor-grabbing"
            >
              <div className="lg:col-span-7">
                <GlassIcon
                  name="quote"
                  size={96}
                  className="w-16 h-16 md:w-20 md:h-20 -ml-3 mb-2"
                />
                <blockquote
                  className="text-snow font-light leading-[1.2] tracking-[-0.025em]"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.75rem)" }}
                >
                  “{q.quote}”
                </blockquote>
                <footer className="mt-10 flex items-center gap-4">
                  <span className="grid place-items-center w-14 h-14 rounded-full bg-royal border border-snow/30 text-snow text-body font-medium">
                    {initials(q.name)}
                  </span>
                  <div>
                    <p className="text-body text-snow">{q.name}</p>
                    <p className="text-small text-ice">{q.role}</p>
                  </div>
                </footer>
              </div>

              {project && (
                <a
                  {...(siteOf(project) ? { href: siteOf(project), ...EXTERNAL } : {})}
                  draggable="false"
                  className="lg:col-span-5 group block rounded-[22px] border border-snow/20 bg-snow/8 p-2 transition-colors duration-200 hover:bg-snow/12"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-ink-2">
                    <img
                      src={cover(project)}
                      alt={`${project.name.split(" — ")[0]} website`}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="flex items-center justify-between gap-3 px-2 pt-3 pb-1 text-small">
                    <span className="text-snow">
                      {project.name.split(" — ")[0]}
                    </span>
                    <span className="text-ice group-hover:text-snow transition-colors">
                      Visit the site →
                    </span>
                  </p>
                </a>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress: one bar per story, the current one filling. */}
          <div className="relative mt-10 flex gap-2" aria-hidden>
            {QUOTES.map(function renderBar(_, i) {
              return (
                <span
                  key={i}
                  className="h-[3px] flex-1 max-w-24 rounded-full bg-snow/15 overflow-hidden"
                >
                  {i === index && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="block h-full bg-snow origin-left"
                      initial={{ scaleX: paused || reduce ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: paused || reduce ? 0 : HOLD / 1000,
                        ease: "linear",
                      }}
                    />
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </NotchCard>
    </div>
  );
}

export default Testimonials;
